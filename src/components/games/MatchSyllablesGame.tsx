import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WORDS_28, WordData } from '../../data/words28';
import { WordSvgIllustration } from '../WordSvgIllustration';
import { formatCase, getFontClass } from '../../utils/textFormat';
import { FontMode } from '../Header';
import { speakPortuguese, speakSyllable, speakSyllableSequence, sfx } from '../../utils/audio';
import { Sparkles, RefreshCw, Trophy, Check, ArrowRight, Heart, Volume2 } from 'lucide-react';

interface Props {
  fontMode: FontMode;
  onAddStars: (amount: number) => void;
}

interface MatchCard {
  id: string;
  type: 'image' | 'syllable';
  wordId: string;
  label: string;
  syllable: string;
  isMatched: boolean;
}

export const MatchSyllablesGame: React.FC<Props> = ({ fontMode, onAddStars }) => {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selectedImageCard, setSelectedImageCard] = useState<MatchCard | null>(null);
  const [selectedSyllableCard, setSelectedSyllableCard] = useState<MatchCard | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [round, setRound] = useState(1);
  const [mistakes, setMistakes] = useState(0);

  const PAIR_COUNT = 4;

  const startNewGame = () => {
    // Escolhe 4 palavras aleatórias
    const shuffledWords = [...WORDS_28].sort(() => 0.5 - Math.random()).slice(0, PAIR_COUNT);

    const imageCards: MatchCard[] = shuffledWords.map((w) => ({
      id: `img-${w.id}`,
      type: 'image',
      wordId: w.id,
      label: w.word,
      syllable: w.syllables[0], // sílaba inicial ou chave
      isMatched: false,
    }));

    const syllableCards: MatchCard[] = shuffledWords.map((w) => ({
      id: `syl-${w.id}`,
      type: 'syllable',
      wordId: w.id,
      label: w.word,
      syllable: w.syllables[0],
      isMatched: false,
    }));

    // Baralhar as duas listas
    const shuffledImages = imageCards.sort(() => 0.5 - Math.random());
    const shuffledSyllables = syllableCards.sort(() => 0.5 - Math.random());

    setCards([...shuffledImages, ...shuffledSyllables]);
    setSelectedImageCard(null);
    setSelectedSyllableCard(null);
    setMatchedCount(0);
    setMistakes(0);

    speakPortuguese('Liga cada imagem à sua sílaba inicial!');
  };

  useEffect(() => {
    startNewGame();
  }, [round]);

  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched) {
      // Mesmo após associada, clicar pronuncia o elemento para treino contínuo
      if (card.type === 'image') {
        speakPortuguese(card.label);
      } else {
        speakSyllable(card.syllable);
      }
      return;
    }

    if (card.type === 'image') {
      speakPortuguese(card.label);
      setSelectedImageCard(card);
      // Se já havia uma sílaba selecionada, verifica o par
      if (selectedSyllableCard) {
        checkPair(card, selectedSyllableCard);
      }
    } else {
      speakSyllable(card.syllable);
      setSelectedSyllableCard(card);
      // Se já havia uma imagem selecionada, verifica o par
      if (selectedImageCard) {
        checkPair(selectedImageCard, card);
      }
    }
  };

  const checkPair = (imgCard: MatchCard, sylCard: MatchCard) => {
    if (imgCard.wordId === sylCard.wordId) {
      // Acerto!
      sfx.playCorrect();
      setCards((prev) =>
        prev.map((c) =>
          c.id === imgCard.id || c.id === sylCard.id ? { ...c, isMatched: true } : c
        )
      );
      setSelectedImageCard(null);
      setSelectedSyllableCard(null);
      setMatchedCount((m) => {
        const next = m + 1;
        if (next === PAIR_COUNT) {
          // Ronda concluída!
          onAddStars(5);
          sfx.playFanfare();
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
          });
          setTimeout(() => {
            speakPortuguese('Parabéns! Ligaste todas as imagens com sucesso!');
          }, 400);
        } else {
          // Reforço auditivo: primeiro pronuncia a sílaba, depois a palavra
          setTimeout(() => {
            speakSyllableSequence([sylCard.syllable], imgCard.label);
          }, 300);
        }
        return next;
      });
    } else {
      // Erro suave
      sfx.playTryAgain();
      setMistakes((m) => m + 1);
      setTimeout(() => {
        setSelectedImageCard(null);
        setSelectedSyllableCard(null);
      }, 700);
    }
  };

  const isCompleted = matchedCount === PAIR_COUNT;

  const imageCards = cards.filter((c) => c.type === 'image');
  const syllableCards = cards.filter((c) => c.type === 'syllable');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Placar Superior */}
      <div className="bg-white rounded-3xl p-4 border-2 border-purple-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center font-black">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Jogo: Liga Sílaba à Imagem</h3>
            <p className="text-xs text-slate-500 font-medium">
              Clica numa imagem e depois na sua sílaba inicial
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-black">
          <div className="text-center">
            <span className="text-slate-400 block text-[10px]">Pares Feitos</span>
            <span className="text-purple-600 text-base">
              {matchedCount} / {PAIR_COUNT}
            </span>
          </div>
          <button
            onClick={() => {
              sfx.playPop();
              startNewGame();
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            title="Baralhar novas cartas"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Área dos Cartões de Ligação */}
      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-4 border-purple-300 shadow-lg space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* Coluna 1: Imagens */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block text-center">
                1. Escolhe a Imagem 🖼️
              </span>
              <div className="space-y-3">
                {imageCards.map((card) => {
                  const isSelected = selectedImageCard?.id === card.id;
                  return (
                    <button
                      key={card.id}
                      disabled={card.isMatched}
                      onClick={() => handleCardClick(card)}
                      className={`w-full p-3 sm:p-4 rounded-2xl border-3 flex items-center gap-3 transition-all cursor-pointer text-left ${
                        card.isMatched
                          ? 'bg-emerald-50 border-emerald-400 opacity-60'
                          : isSelected
                          ? 'bg-purple-100 border-purple-500 ring-4 ring-purple-300 scale-102 shadow-md'
                          : 'bg-slate-50 hover:bg-purple-50/50 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <WordSvgIllustration wordId={card.wordId} size="md" />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-base sm:text-lg font-black text-slate-800 block truncate ${getFontClass(
                            fontMode
                          )}`}
                        >
                          {formatCase(card.label, fontMode)}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {card.isMatched ? '✓ Ligado!' : 'Toca para escolher'}
                        </span>
                      </div>
                      {card.isMatched && <Check size={20} className="text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coluna 2: Sílabas Iniciais */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block text-center">
                2. Escolhe a Sílaba 🔤
              </span>
              <div className="space-y-3">
                {syllableCards.map((card) => {
                  const isSelected = selectedSyllableCard?.id === card.id;
                  return (
                    <button
                      key={card.id}
                      disabled={card.isMatched}
                      onClick={() => handleCardClick(card)}
                      className={`w-full p-4 sm:p-5 rounded-2xl border-3 flex items-center justify-center transition-all cursor-pointer ${
                        card.isMatched
                          ? 'bg-emerald-50 border-emerald-400 opacity-60 text-emerald-800'
                          : isSelected
                          ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-102 shadow-md text-amber-950'
                          : 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 hover:border-amber-300 text-slate-800'
                      }`}
                    >
                      <span
                        className={`text-2xl sm:text-3xl font-black ${getFontClass(fontMode)}`}
                      >
                        {formatCase(card.syllable, fontMode)}
                      </span>
                      {card.isMatched && (
                        <Check size={20} className="text-emerald-600 ml-2 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Ecrã de Vitória do Jogo */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-4 border-emerald-400 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl shadow-inner animate-bounce">
            🎉
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Excelente Trabalho!
            </h2>
            <p className="text-slate-600 font-medium max-w-md mx-auto">
              Completaste todos os pares de sílaba e imagem com grande sucesso! Ganhaste +5 estrelas
              ⭐
            </p>
          </div>

          <button
            onClick={() => {
              sfx.playPop();
              setRound((r) => r + 1);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>Jogar Nova Ronda</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
