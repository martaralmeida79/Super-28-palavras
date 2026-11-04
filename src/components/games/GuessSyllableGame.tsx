import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WORDS_28, WordData } from '../../data/words28';
import { WordSvgIllustration } from '../WordSvgIllustration';
import { formatCase, getFontClass } from '../../utils/textFormat';
import { FontMode } from '../Header';
import { speakPortuguese, speakSyllable, speakSyllableSequence, sfx } from '../../utils/audio';
import { Volume2, Sparkles, RefreshCw, Trophy, ArrowRight, CheckCircle2, XCircle, Volume1 } from 'lucide-react';

interface Props {
  fontMode: FontMode;
  onAddStars: (amount: number) => void;
}

interface Question {
  word: WordData;
  missingIndex: number;
  targetSyllable: string;
  options: string[];
}

export const GuessSyllableGame: React.FC<Props> = ({ fontMode, onAddStars }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  // Gera uma nova pergunta de associação sílaba-imagem
  const generateQuestion = () => {
    // Escolhe uma palavra com pelo menos 1 sílaba
    const randomIndex = Math.floor(Math.random() * WORDS_28.length);
    const word = WORDS_28[randomIndex];

    // Escolhe que sílaba vai ficar escondida
    const missingIndex = Math.floor(Math.random() * word.syllables.length);
    const targetSyllable = word.syllables[missingIndex];

    // Cria opções falsas convincentes vindas de outras palavras ou da mesma família silábica
    const distractors = new Set<string>();

    // Tenta apanhar sílabas das linhas do quadro silábico da palavra
    word.syllableRows.forEach((r) => {
      r.syllables.forEach((s) => {
        if (s !== '–' && s !== '-' && s !== targetSyllable) {
          distractors.add(s);
        }
      });
    });

    // Se ainda precisar de mais, apanha sílabas de outras palavras
    const allSyllables = WORDS_28.flatMap((w) => w.syllables);
    while (distractors.size < 6) {
      const s = allSyllables[Math.floor(Math.random() * allSyllables.length)];
      if (s !== targetSyllable) {
        distractors.add(s);
      }
    }

    const shuffledDistractors = Array.from(distractors)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [targetSyllable, ...shuffledDistractors].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      word,
      missingIndex,
      targetSyllable,
      options,
    });
    setSelectedOption(null);
    setIsAnswered(false);

    // Fala a instrução amigável e depois pronuncia a palavra
    setTimeout(() => {
      speakPortuguese(`Que sílaba falta em ${word.word}?`);
    }, 200);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);
    setQuestionCount((c) => c + 1);

    // Pronuncia imediatamente a sílaba em que o aluno clicou
    speakSyllable(option);

    const isCorrect = option === currentQuestion.targetSyllable;

    setTimeout(() => {
      if (isCorrect) {
        sfx.playCorrect();
        setScore((s) => s + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        onAddStars(2);

        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
        });

        // Reforço fonológico sequencial: sílaba -> palavra inteira
        setTimeout(() => {
          speakSyllableSequence(
            currentQuestion.word.syllables,
            currentQuestion.word.word
          );
        }, 300);
      } else {
        sfx.playTryAgain();
        setStreak(0);
        setTimeout(() => {
          speakPortuguese(`Esta sílaba é ${option}. A palavra ${currentQuestion.word.word} precisa de ${currentQuestion.targetSyllable}.`);
        }, 400);
      }
    }, 400);
  };

  const handleTileClick = (syl: string) => {
    speakSyllable(syl);
  };

  const handleNext = () => {
    sfx.playPop();
    generateQuestion();
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Placar Superior */}
      <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Jogo: Qual é a Sílaba?</h3>
            <p className="text-xs text-slate-500 font-medium">Associa a sílaba correta à imagem</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-black">
          <div className="text-center">
            <span className="text-slate-400 block text-[10px]">Acertos</span>
            <span className="text-emerald-600 text-base">{score}</span>
          </div>
          <div className="text-center">
            <span className="text-slate-400 block text-[10px]">Sequência</span>
            <span className="text-amber-500 text-base flex items-center gap-0.5">
              🔥 {streak}
            </span>
          </div>
        </div>
      </div>

      {/* Cartão Principal do Desafio */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg text-center space-y-6 relative overflow-hidden">
        {/* Pergunta */}
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
            <Sparkles size={14} className="text-amber-600" /> Pergunta #{questionCount + 1}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Que sílaba falta para formar a palavra?
          </h2>
        </div>

        {/* Imagem em Destaque */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group p-4 bg-gradient-to-tr from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 shadow-inner">
            <WordSvgIllustration wordId={currentQuestion.word.id} size="xl" />
            <div className="flex items-center gap-1.5 absolute -bottom-2 -right-2">
              <button
                onClick={() => {
                  sfx.playPop();
                  speakPortuguese(currentQuestion.word.word);
                }}
                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
                title="Ouvir palavra inteira"
              >
                <Volume2 size={16} />
              </button>
              <button
                onClick={() => {
                  speakSyllableSequence(currentQuestion.word.syllables, currentQuestion.word.word);
                }}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                title="Ouvir sílaba a sílaba"
              >
                <Volume1 size={15} />
                <span>Soletrar</span>
              </button>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 mt-2">
            {currentQuestion.word.article} {formatCase(currentQuestion.word.word, fontMode)}
          </span>
          <p className="text-[11px] text-slate-400 font-medium">
            👉 Toca nas sílabas para ouvir a pronúncia de cada uma!
          </p>
        </div>

          {/* Visualização das Sílabas com o Espaço Vazio - Cada bloco é clicável para reforço auditivo */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {currentQuestion.word.syllables.map((syl, idx) => {
              const isTarget = idx === currentQuestion.missingIndex;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isTarget) {
                      handleTileClick(syl);
                    } else if (isAnswered) {
                      handleTileClick(currentQuestion.targetSyllable);
                    }
                  }}
                  className={`min-w-[64px] sm:min-w-[76px] h-16 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black border-3 transition-all cursor-pointer ${
                    isTarget
                      ? isAnswered
                        ? selectedOption === currentQuestion.targetSyllable
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-md animate-bounce ring-2 ring-emerald-300'
                          : 'bg-rose-100 border-rose-500 text-rose-800'
                        : 'bg-amber-100 border-dashed border-amber-400 text-amber-500 animate-pulse'
                      : 'bg-slate-100 hover:bg-amber-100 border-slate-300 hover:border-amber-400 text-slate-800 shadow-xs'
                  } ${getFontClass(fontMode)}`}
                  title={!isTarget ? `Toca para ouvir ${syl}` : undefined}
                >
                  {isTarget ? (
                    isAnswered ? (
                      formatCase(currentQuestion.targetSyllable, fontMode)
                    ) : (
                      <span className="text-amber-500 text-3xl font-black">?</span>
                    )
                  ) : (
                    formatCase(syl, fontMode)
                  )}
                </button>
              );
            })}
          </div>

          {/* Opções de Resposta - Clicar pronuncia imediatamente a sílaba */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isTarget = option === currentQuestion.targetSyllable;

              let btnStyle =
                'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800 hover:border-amber-300';

              if (isAnswered) {
                if (isTarget) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102';
                } else if (isSelected && !isTarget) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 opacity-80';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`py-4 px-6 rounded-2xl text-2xl sm:text-3xl font-black border-3 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${btnStyle} ${getFontClass(
                    fontMode
                  )}`}
                  title={`Ouvir e escolher a sílaba ${option}`}
                >
                  <span>{formatCase(option, fontMode)}</span>
                  <Volume1 size={18} className="text-amber-500/70" />
                  {isAnswered && isTarget && <CheckCircle2 size={24} className="text-white" />}
                  {isAnswered && isSelected && !isTarget && (
                    <XCircle size={24} className="text-white" />
                  )}
                </button>
            );
          })}
        </div>

        {/* Feedback & Botão Próxima */}
        {isAnswered && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {selectedOption === currentQuestion.targetSyllable ? (
              <div className="p-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-emerald-800 text-sm font-extrabold flex items-center justify-center gap-2 mb-4">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span>Excelente! Acertaste a sílaba! (+2 estrelas ⭐)</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-2xl text-amber-900 text-sm font-extrabold flex items-center justify-center gap-2 mb-4">
                <span>
                  A resposta correta era{' '}
                  <strong className="underline text-base">
                    {formatCase(currentQuestion.targetSyllable, fontMode)}
                  </strong>
                  . Não desistas!
                </span>
              </div>
            )}

            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Seguinte Palavra</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
