import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WORDS_28 } from '../../data/words28';
import { formatCase, getFontClass } from '../../utils/textFormat';
import { FontMode } from '../Header';
import { speakPortuguese, speakSyllable, sfx } from '../../utils/audio';
import { Headphones, Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, Trophy, Volume1 } from 'lucide-react';

interface Props {
  fontMode: FontMode;
  onAddStars: (amount: number) => void;
}

interface DictationQuestion {
  target: string;
  sourceWord: string;
  options: string[];
}

export const DictationGame: React.FC<Props> = ({ fontMode, onAddStars }) => {
  const [currentQuestion, setCurrentQuestion] = useState<DictationQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const generateQuestion = () => {
    // Escolhe uma palavra e uma sílaba interessante (dígrafos ou sílabas ricas)
    const randomWord = WORDS_28[Math.floor(Math.random() * WORDS_28.length)];
    const validSyllables = randomWord.syllables.filter((s) => s !== '–' && s !== '-');
    const target = validSyllables[Math.floor(Math.random() * validSyllables.length)];

    // Encontra 3 opções plausíveis
    const distractors = new Set<string>();

    // Busca nas linhas da palavra
    randomWord.syllableRows.forEach((r) => {
      r.syllables.forEach((s) => {
        if (s !== '–' && s !== '-' && s !== target) {
          distractors.add(s);
        }
      });
    });

    const allSyllables = WORDS_28.flatMap((w) => w.syllables);
    while (distractors.size < 4) {
      const s = allSyllables[Math.floor(Math.random() * allSyllables.length)];
      if (s !== target) distractors.add(s);
    }

    const options = [
      target,
      ...Array.from(distractors)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3),
    ].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      target,
      sourceWord: randomWord.word,
      options,
    });
    setSelectedOption(null);
    setIsAnswered(false);

    // Reproduz o som com o motor de sílabas
    setTimeout(() => {
      speakSyllable(target);
    }, 250);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handlePlaySound = () => {
    if (!currentQuestion) return;
    sfx.playPop();
    speakSyllable(currentQuestion.target);
  };

  const handleSelect = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);
    setRound((r) => r + 1);

    // Pronuncia imediatamente a opção clicada
    speakSyllable(option);

    const isCorrect = option === currentQuestion.target;

    setTimeout(() => {
      if (isCorrect) {
        sfx.playCorrect();
        setScore((s) => s + 1);
        onAddStars(2);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
        setTimeout(() => {
          speakPortuguese(`Muito bem! Ouviste a sílaba ${currentQuestion.target}!`);
        }, 300);
      } else {
        sfx.playTryAgain();
        setTimeout(() => {
          speakPortuguese(`Tu escolheste ${option}. O som ditado era ${currentQuestion.target}.`);
        }, 300);
      }
    }, 350);
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Placar Superior */}
      <div className="bg-white rounded-3xl p-4 border-2 border-cyan-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-black">
            <Headphones size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Ditado Silábico</h3>
            <p className="text-xs text-slate-500 font-medium">
              Ouve com atenção e descobre qual é a sílaba certa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-black">
          <span className="text-slate-400">Pontuação:</span>
          <span className="text-cyan-600 text-base">{score}</span>
        </div>
      </div>

      {/* Caixa do Ditado */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-cyan-300 shadow-lg text-center space-y-6">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 font-extrabold text-xs">
            <Sparkles size={14} className="text-cyan-600" /> Pergunta #{round + 1}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Que sílaba acabaste de ouvir?
          </h2>
        </div>

        {/* Botão Gigante de Ouvir Novamente */}
        <div className="py-4">
          <button
            onClick={handlePlaySound}
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white flex flex-col items-center justify-center gap-1 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer ring-8 ring-cyan-100"
            title="Ouvir som da sílaba"
          >
            <Volume2 size={36} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">Ouvir</span>
          </button>
          <p className="text-xs text-slate-400 font-semibold mt-3">
            Toca no botão azul para escutar o som quantas vezes quiseres!
          </p>
        </div>

        {/* Opções de Cartões */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isTarget = option === currentQuestion.target;

            let cardStyle =
              'bg-slate-50 hover:bg-cyan-50 border-slate-200 text-slate-800 hover:border-cyan-300';

            if (isAnswered) {
              if (isTarget) {
                cardStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102';
              } else if (isSelected && !isTarget) {
                cardStyle = 'bg-rose-500 text-white border-rose-600 opacity-80';
              } else {
                cardStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(option)}
                className={`py-5 px-6 rounded-2xl text-2xl sm:text-3xl font-black border-3 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${cardStyle} ${getFontClass(
                  fontMode
                )}`}
              >
                <span>{formatCase(option, fontMode)}</span>
                {isAnswered && isTarget && <CheckCircle2 size={24} className="text-white" />}
                {isAnswered && isSelected && !isTarget && (
                  <XCircle size={24} className="text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Seguinte */}
        {isAnswered && (
          <div className="pt-2 animate-in fade-in duration-300 space-y-4">
            {selectedOption === currentQuestion.target ? (
              <div className="p-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-emerald-800 text-sm font-extrabold flex items-center justify-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span>Excelente ouvido! Ouviste com atenção! (+2 ⭐)</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-2xl text-amber-900 text-sm font-extrabold flex items-center justify-center gap-2">
                <span>
                  O som correto era{' '}
                  <strong className="underline text-base">
                    {formatCase(currentQuestion.target, fontMode)}
                  </strong>
                  .
                </span>
              </div>
            )}

            <button
              onClick={() => {
                sfx.playPop();
                generateQuestion();
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-base shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Seguinte Sílaba</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
