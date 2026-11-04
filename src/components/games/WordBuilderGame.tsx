import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WORDS_28, WordData } from '../../data/words28';
import { WordSvgIllustration } from '../WordSvgIllustration';
import { formatCase, getFontClass } from '../../utils/textFormat';
import { FontMode } from '../Header';
import { speakPortuguese, speakSyllable, speakSyllableSequence, sfx } from '../../utils/audio';
import { Sparkles, Volume2, ArrowRight, RotateCcw, Blocks, CheckCircle2, Volume1 } from 'lucide-react';

interface Props {
  fontMode: FontMode;
  initialWord?: WordData | null;
  onAddStars: (amount: number) => void;
}

interface SyllableBlock {
  id: string;
  syllable: string;
  originalIndex: number;
}

export const WordBuilderGame: React.FC<Props> = ({
  fontMode,
  initialWord,
  onAddStars,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [placedSyllables, setPlacedSyllables] = useState<(SyllableBlock | null)[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<SyllableBlock[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isError, setIsError] = useState(false);

  const activeWord = initialWord || WORDS_28[currentWordIndex];

  // Configura a palavra atual e baralha as sílabas
  const setupWord = (word: WordData) => {
    const blocks: SyllableBlock[] = word.syllables.map((syl, idx) => ({
      id: `${word.id}-${idx}-${syl}`,
      syllable: syl,
      originalIndex: idx,
    }));

    // Baralhar os blocos
    const shuffled = [...blocks].sort(() => 0.5 - Math.random());
    setAvailableBlocks(shuffled);
    setPlacedSyllables(new Array(word.syllables.length).fill(null));
    setIsCompleted(false);
    setIsError(false);

    speakPortuguese(`Monta a palavra ${word.word}`);
  };

  useEffect(() => {
    if (initialWord) {
      const idx = WORDS_28.findIndex((w) => w.id === initialWord.id);
      if (idx !== -1) setCurrentWordIndex(idx);
      setupWord(initialWord);
    } else {
      setupWord(WORDS_28[currentWordIndex]);
    }
  }, [initialWord, currentWordIndex]);

  // Coloca uma sílaba disponível no primeiro espaço vazio
  const handlePlaceBlock = (block: SyllableBlock) => {
    if (isCompleted) return;

    const firstEmptyIndex = placedSyllables.findIndex((s) => s === null);
    if (firstEmptyIndex === -1) return;

    // Pronúncia imediata da sílaba ao clicar
    speakSyllable(block.syllable);

    const newPlaced = [...placedSyllables];
    newPlaced[firstEmptyIndex] = block;
    setPlacedSyllables(newPlaced);

    // Remove dos disponíveis
    setAvailableBlocks((prev) => prev.filter((b) => b.id !== block.id));

    // Se todos os espaços foram preenchidos, verifica se a palavra está correta
    const remainingEmpty = newPlaced.filter((s) => s === null).length;
    if (remainingEmpty === 0) {
      checkWord(newPlaced as SyllableBlock[]);
    }
  };

  // Remove uma sílaba colocada e devolve aos disponíveis
  const handleRemovePlacedBlock = (index: number) => {
    if (isCompleted) return;
    const block = placedSyllables[index];
    if (!block) return;

    // Pronuncia a sílaba que está a ser retirada
    speakSyllable(block.syllable);

    const newPlaced = [...placedSyllables];
    newPlaced[index] = null;
    setPlacedSyllables(newPlaced);

    setAvailableBlocks((prev) => [...prev, block]);
    setIsError(false);
  };

  // Verifica se a sequência de sílabas forma a palavra correta
  const checkWord = (placed: SyllableBlock[]) => {
    const constructed = placed.map((b) => b.syllable).join('');
    const target = activeWord.syllables.join('');

    if (constructed.toLowerCase() === target.toLowerCase()) {
      // Correto!
      sfx.playCorrect();
      setIsCompleted(true);
      setIsError(false);
      onAddStars(3);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });

      // Reforço auditivo e consciência fonológica: pronuncia cada sílaba pausadamente e depois a palavra inteira
      setTimeout(() => {
        speakSyllableSequence(activeWord.syllables, activeWord.word);
      }, 350);
    } else {
      // Incorreto
      sfx.playTryAgain();
      setIsError(true);
      setTimeout(() => {
        speakPortuguese('Ainda não está na ordem certa. Toca nas sílabas para tentar de novo.');
      }, 200);
    }
  };

  const handleNextWord = () => {
    sfx.playPop();
    const nextIdx = (currentWordIndex + 1) % WORDS_28.length;
    setCurrentWordIndex(nextIdx);
  };

  const handleReset = () => {
    sfx.playPop();
    setupWord(activeWord);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Placar Superior */}
      <div className="bg-white rounded-3xl p-4 border-2 border-blue-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-black">
            <Blocks size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Jogo: Monta Palavras</h3>
            <p className="text-xs text-slate-500 font-medium">
              Palavra {currentWordIndex + 1} de {WORDS_28.length}
            </p>
          </div>
        </div>

        {/* Seletor rápido de palavra */}
        <div className="flex items-center gap-2">
          <select
            value={currentWordIndex}
            onChange={(e) => {
              sfx.playPop();
              setCurrentWordIndex(Number(e.target.value));
            }}
            className="text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            {WORDS_28.map((w, idx) => (
              <option key={w.id} value={idx}>
                #{w.number} {w.word}
              </option>
            ))}
          </select>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            title="Recomeçar esta palavra"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Cartão de Montagem da Palavra */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-blue-300 shadow-lg text-center space-y-6">
        {/* Imagem da Palavra com controlos de áudio */}
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 shadow-inner relative group">
            <WordSvgIllustration wordId={activeWord.id} size="xl" />
            <div className="flex items-center gap-1.5 absolute -bottom-2 -right-2">
              <button
                onClick={() => {
                  speakSyllableSequence(activeWord.syllables, activeWord.word);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Ouvir sílaba a sílaba"
              >
                <Volume2 size={16} />
                <span>Ouvir Sílabas</span>
              </button>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 mt-2">
            {activeWord.article} {formatCase(activeWord.word, fontMode)} • {activeWord.syllables.length}{' '}
            {activeWord.syllables.length === 1 ? 'sílaba' : 'sílabas'}
          </span>
          <p className="text-[11px] text-slate-400 font-medium">
            👉 Clica em qualquer bloco para ouvir a sílaba pronunciada!
          </p>
        </div>

        {/* Espaços de Encaixe das Sílabas */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
            Clica nas sílabas abaixo para preencher os espaços:
          </span>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {placedSyllables.map((block, idx) => (
              <button
                key={idx}
                onClick={() => handleRemovePlacedBlock(idx)}
                className={`min-w-[70px] sm:min-w-[85px] h-20 sm:h-24 rounded-3xl flex items-center justify-center text-2xl sm:text-3xl font-black border-3 transition-all cursor-pointer ${
                  block
                    ? isCompleted
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-md scale-105'
                      : isError
                      ? 'bg-rose-100 border-rose-400 text-rose-800'
                      : 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm'
                    : 'bg-slate-50 border-dashed border-slate-300 text-slate-300 hover:border-slate-400'
                } ${getFontClass(fontMode)}`}
                title={block ? 'Toca para remover esta sílaba' : 'Espaço vazio'}
              >
                {block ? formatCase(block.syllable, fontMode) : (
                  <span className="text-slate-300 text-lg font-bold">{idx + 1}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bloco de Sílabas Disponíveis para Clicar */}
        {!isCompleted && (
          <div className="space-y-3 pt-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Sílabas Baralhadas 🎲
            </span>
            <div className="flex items-center justify-center gap-3 flex-wrap min-h-[70px]">
              {availableBlocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => handlePlaceBlock(block)}
                  className={`px-5 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-2xl sm:text-3xl rounded-2xl shadow-md border-b-4 border-amber-600 transition-all cursor-pointer hover:scale-105 ${getFontClass(
                    fontMode
                  )}`}
                >
                  {formatCase(block.syllable, fontMode)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback de Erro */}
        {isError && (
          <div className="p-3 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
            <span>A ordem não está certa. Toca numa sílaba para a devolver e tenta outra vez!</span>
          </div>
        )}

        {/* Conclusão com Sucesso */}
        {isCompleted && (
          <div className="pt-2 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl text-emerald-800 font-black text-base flex items-center justify-center gap-2">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <span>
                Parabéns! Formaste "{formatCase(activeWord.word, fontMode)}" com sucesso! (+3
                estrelas ⭐)
              </span>
            </div>

            <button
              onClick={handleNextWord}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Próxima Palavra</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
