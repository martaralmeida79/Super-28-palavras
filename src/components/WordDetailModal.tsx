import React from 'react';
import { X, Volume2, Sparkles, PenTool, Blocks, BookOpen } from 'lucide-react';
import { WordData, VOWEL_HEADERS } from '../data/words28';
import { WordSvgIllustration } from './WordSvgIllustration';
import { formatCase, getFontClass } from '../utils/textFormat';
import { FontMode } from './Header';
import { speakPortuguese, speakSyllable, speakSyllableSequence, sfx } from '../utils/audio';

interface Props {
  word: WordData | null;
  onClose: () => void;
  fontMode: FontMode;
  onPracticeWriting: (word: WordData) => void;
  onPracticeBuilder: (word: WordData) => void;
}

export const WordDetailModal: React.FC<Props> = ({
  word,
  onClose,
  fontMode,
  onPracticeWriting,
  onPracticeBuilder,
}) => {
  if (!word) return null;

  const handleSpeakWord = () => {
    sfx.playPop();
    speakSyllableSequence(word.syllables, word.word);
  };

  const handleSpeakSyllable = (syl: string) => {
    if (syl === '–' || syl === '-') return;
    speakSyllable(syl);
  };

  const handleSpeakSentence = () => {
    sfx.playPop();
    speakPortuguese(word.sentence);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border-4 border-amber-300 relative max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className={`p-4 bg-gradient-to-r ${word.color} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm">
              #{word.number}
            </span>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                {word.category} • Página {word.page}
              </span>
              <h2 className={`text-2xl md:text-3xl font-black ${getFontClass(fontMode)}`}>
                {word.article} {formatCase(word.word, fontMode)}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sfx.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6">
          {/* Main Visual & Syllable Separation */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-amber-50/70 p-5 rounded-3xl border-2 border-amber-200">
            <WordSvgIllustration wordId={word.id} size="xl" />

            <div className="flex-1 text-center sm:text-left space-y-3 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-amber-800">Divisão Silábica:</span>
                <button
                  onClick={handleSpeakWord}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-xs shadow-sm transition-all"
                >
                  <Volume2 size={15} />
                  Ouvir Palavra
                </button>
              </div>

              {/* Syllable Blocks */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {word.syllables.map((syl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSpeakSyllable(syl)}
                    className={`px-4 py-2 bg-white hover:bg-amber-100 border-2 border-amber-300 rounded-2xl text-xl md:text-2xl font-black text-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 ${getFontClass(
                      fontMode
                    )}`}
                    title="Clica para ouvir esta sílaba"
                  >
                    <span>{formatCase(syl, fontMode)}</span>
                    <Volume2 size={16} className="text-amber-500" />
                  </button>
                ))}
              </div>

              <p className="text-xs text-amber-700 font-medium">
                👉 Toca em cada sílaba para ouvir o seu som isolado!
              </p>
            </div>
          </div>

          {/* Quadro Silábico desta Palavra */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-amber-600" />
              <h3 className="font-extrabold text-slate-800 text-base">
                Família Silábica (Quadro Oficial)
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 bg-white">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="py-1.5 px-2 text-xs font-bold text-slate-500">Família</th>
                    {VOWEL_HEADERS.map((v) => (
                      <th key={v} className="py-1.5 px-3 font-black text-sm text-slate-700 uppercase">
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {word.syllableRows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b last:border-0 border-slate-100 hover:bg-amber-50/50">
                      <td className="py-2 px-2 text-xs font-bold text-slate-400 bg-slate-50/70">
                        {row.rowLabel || `Linha ${rIdx + 1}`}
                      </td>
                      {row.syllables.map((syl, cIdx) => {
                        const isDash = syl === '–' || syl === '-';
                        const isInWord = word.syllables.includes(syl);
                        return (
                          <td key={cIdx} className="py-2 px-2">
                            {isDash ? (
                              <span className="text-slate-300 font-bold text-sm">—</span>
                            ) : (
                              <button
                                onClick={() => handleSpeakSyllable(syl)}
                                className={`px-2.5 py-1 rounded-xl font-black text-sm md:text-base transition-all ${
                                  isInWord
                                    ? 'bg-amber-400 text-amber-950 font-black shadow-sm ring-2 ring-amber-300'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                } ${getFontClass(fontMode)}`}
                              >
                                {formatCase(syl, fontMode)}
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Frase de Leitura */}
          <div className="bg-blue-50/80 p-4 rounded-2xl border-2 border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <Sparkles size={14} /> Treino de Leitura de Frase
              </span>
              <button
                onClick={handleSpeakSentence}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-xs border border-blue-200"
              >
                <Volume2 size={14} /> Ouvir Frase
              </button>
            </div>
            <p className={`text-base md:text-lg font-bold text-slate-800 ${getFontClass(fontMode)}`}>
              "{formatCase(word.sentence, fontMode)}"
            </p>
          </div>

          {/* Regra Fonológica / Dica Pedagógica */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600 block mb-0.5">
              💡 {word.ruleTitle}
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">{word.ruleDescription}</p>
          </div>

          {/* Ações Práticas */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                sfx.playPop();
                onPracticeWriting(word);
                onClose();
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <PenTool size={18} />
              Escrever no Caderno
            </button>
            <button
              onClick={() => {
                sfx.playPop();
                onPracticeBuilder(word);
                onClose();
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Blocks size={18} />
              Montar a Palavra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
