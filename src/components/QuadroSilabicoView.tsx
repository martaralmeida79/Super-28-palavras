import React, { useState } from 'react';
import { WORDS_28, WordData, VOWEL_HEADERS, ALPHABET_LIST } from '../data/words28';
import { WordSvgIllustration } from './WordSvgIllustration';
import { formatCase, getFontClass } from '../utils/textFormat';
import { FontMode } from './Header';
import { speakPortuguese, speakSyllable, speakSyllableSequence, sfx } from '../utils/audio';
import { Volume2, Search, Filter, Sparkles, BookOpen, Layers } from 'lucide-react';

interface Props {
  fontMode: FontMode;
  onSelectWord: (word: WordData) => void;
  onOpenPdf: () => void;
}

export const QuadroSilabicoView: React.FC<Props> = ({
  fontMode,
  onSelectWord,
  onOpenPdf,
}) => {
  const [selectedPage, setSelectedPage] = useState<'all' | 1 | 2>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedSyllable, setHighlightedSyllable] = useState<string | null>(null);

  const filteredWords = WORDS_28.filter((w) => {
    if (selectedPage !== 'all' && w.page !== selectedPage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchWord = w.word.toLowerCase().includes(q);
      const matchSyllable = w.syllables.some((s) => s.toLowerCase().includes(q));
      const matchFamily = w.syllableRows.some((r) =>
        r.syllables.some((s) => s.toLowerCase().includes(q))
      );
      return matchWord || matchSyllable || matchFamily;
    }
    return true;
  });

  const handleSyllableClick = (syl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (syl === '–' || syl === '-') return;
    setHighlightedSyllable(syl);
    speakSyllable(syl);
    setTimeout(() => {
      setHighlightedSyllable((current) => (current === syl ? null : current));
    }, 1200);
  };

  const handleAlphabetClick = (pair: string[]) => {
    sfx.playPop();
    speakPortuguese(`Letra ${pair[0]}`);
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black mb-3">
            <BookOpen size={14} />
            <span>Método das 28 Palavras • Quadro Oficial</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Explora o Quadro Silábico Interativo!
          </h2>
          <p className="text-amber-50 text-sm md:text-base font-medium mt-1">
            Clica em qualquer palavra para ver todos os detalhes ou toca numa sílaba individual para ouvir a sua pronúncia perfeita em português.
          </p>
        </div>

        {/* Decorative Emojis */}
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none select-none hidden md:block">
          📖 ✏️ 🌟
        </div>
      </div>

      {/* Alfabeto Interativo (presente na ficha original) */}
      <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Sparkles size={14} /> Alfabeto da Turma (Minúsculas & Maiúsculas)
          </span>
          <span className="text-xs text-slate-400">Toca para ouvir o nome da letra</span>
        </div>
        <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-1.5 text-center">
          {ALPHABET_LIST.map((pair, idx) => (
            <button
              key={idx}
              onClick={() => handleAlphabetClick(pair)}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 font-extrabold text-xs sm:text-sm text-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="text-amber-600 mr-0.5">{pair[0]}</span>
              <span className="text-slate-800">{pair[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Page Switcher */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => {
              sfx.playPop();
              setSelectedPage('all');
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedPage === 'all'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Todas (28)
          </button>
          <button
            onClick={() => {
              sfx.playPop();
              setSelectedPage(1);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedPage === 1
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Página 1 (1–15)
          </button>
          <button
            onClick={() => {
              sfx.playPop();
              setSelectedPage(2);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedPage === 2
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Página 2 (16–28)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar sílaba ou palavra..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Grelha de Palavras do Método das 28 Palavras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            onClick={() => {
              sfx.playPop();
              onSelectWord(word);
            }}
            className="group bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Top row: Word name, Illustration, Pronounce button */}
            <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <WordSvgIllustration wordId={word.id} size="md" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      #{word.number}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Pág. {word.page}
                    </span>
                  </div>
                  <h3
                    className={`text-xl sm:text-2xl font-black text-slate-800 group-hover:text-amber-600 transition-colors ${getFontClass(
                      fontMode
                    )}`}
                  >
                    {formatCase(word.word, fontMode)}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    {word.syllables.map((syl, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded"
                      >
                        {formatCase(syl, fontMode)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sfx.playPop();
                    speakSyllableSequence(word.syllables, word.word);
                  }}
                  className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-all cursor-pointer flex items-center gap-1"
                  title="Ouvir palavra e sílabas"
                >
                  <Volume2 size={18} />
                </button>
                <span className="text-[11px] font-bold text-amber-700 underline group-hover:no-underline">
                  Ver detalhes →
                </span>
              </div>
            </div>

            {/* Matriz Silábica com colunas a, e, i, o, u */}
            <div className="overflow-x-auto rounded-2xl bg-slate-50/70 p-2 border border-slate-200">
              <table className="w-full text-center border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold">
                    <th className="py-1 px-1 text-[11px]"></th>
                    {VOWEL_HEADERS.map((v) => (
                      <th key={v} className="py-1 px-1 font-black text-slate-600 uppercase">
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {word.syllableRows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b last:border-0 border-slate-100">
                      <td className="py-1 px-1 text-[10px] font-bold text-slate-400 text-left">
                        {row.rowLabel}
                      </td>
                      {row.syllables.map((syl, cIdx) => {
                        const isDash = syl === '–' || syl === '-';
                        const isHighlighted = highlightedSyllable === syl;
                        const isPartOfWord = word.syllables.includes(syl);

                        return (
                          <td key={cIdx} className="py-1 px-1">
                            {isDash ? (
                              <span className="text-slate-300 font-bold">—</span>
                            ) : (
                              <button
                                onClick={(e) => handleSyllableClick(syl, e)}
                                className={`w-full py-1 px-1.5 rounded-lg font-black transition-all cursor-pointer ${
                                  isHighlighted
                                    ? 'bg-rose-500 text-white scale-110 shadow-md ring-2 ring-rose-300'
                                    : isPartOfWord
                                    ? 'bg-amber-200 hover:bg-amber-300 text-amber-950 font-black ring-1 ring-amber-300'
                                    : 'bg-white hover:bg-amber-100 text-slate-700 border border-slate-200'
                                } ${getFontClass(fontMode)}`}
                                title={`Toca para ouvir: ${syl}`}
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

            {/* Rodapé com mini-regra fonológica */}
            <div className="mt-2.5 pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[80%]">💡 {word.ruleTitle}</span>
              <span className="font-extrabold text-amber-600">Abrir Estudo</span>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Flutuante de Apoio para Ver PDF */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => {
            sfx.playPop();
            onOpenPdf();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <BookOpen size={18} />
          <span>Ver o Quadro Silábico Oficial Supermiúdos em PDF</span>
        </button>
      </div>
    </div>
  );
};
