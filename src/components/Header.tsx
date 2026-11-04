import React from 'react';
import { Sparkles, Volume2, VolumeX, BookOpen, Target, Puzzle, Blocks, PenTool, Headphones, FileText } from 'lucide-react';
import { sfx } from '../utils/audio';

export type FontMode = 'lower' | 'upper' | 'cursive';
export type TabType = 'quadro' | 'guess' | 'match' | 'builder' | 'writing' | 'dictation';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  fontMode: FontMode;
  setFontMode: (mode: FontMode) => void;
  stars: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenPdf: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  fontMode,
  setFontMode,
  stars,
  soundEnabled,
  setSoundEnabled,
  onOpenPdf,
}) => {
  const tabs = [
    { id: 'quadro', label: 'Quadro Silábico', icon: BookOpen, color: 'bg-emerald-500' },
    { id: 'guess', label: 'Qual é a Sílaba?', icon: Target, color: 'bg-amber-500' },
    { id: 'match', label: 'Liga Sílaba-Imagem', icon: Puzzle, color: 'bg-purple-500' },
    { id: 'builder', label: 'Monta Palavras', icon: Blocks, color: 'bg-blue-500' },
    { id: 'writing', label: 'Caderno de Escrita', icon: PenTool, color: 'bg-rose-500' },
    { id: 'dictation', label: 'Ditado Silábico', icon: Headphones, color: 'bg-cyan-500' },
  ] as const;

  const handleTabClick = (tabId: TabType) => {
    sfx.playPop();
    setActiveTab(tabId);
  };

  const handleFontChange = (mode: FontMode) => {
    sfx.playPop();
    setFontMode(mode);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-2 border-amber-200 sticky top-0 z-40 shadow-sm">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & School Badge */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-md text-2xl font-black shrink-0">
            28
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
                Super<span className="text-amber-500">Palavras</span>
              </h1>
              <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-rose-200">
                2.º Ano
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Método das 28 Palavras • Leitura e Escrita
            </p>
          </div>
        </div>

        {/* Controls: Letter Case, Sound, Stars, PDF */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Tipo de Letra */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => handleFontChange('lower')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                fontMode === 'lower'
                  ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Letra minúscula de imprensa (ex: sapato)"
            >
              abc
            </button>
            <button
              onClick={() => handleFontChange('upper')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                fontMode === 'upper'
                  ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Letra MAIÚSCULA de imprensa (ex: SAPATO)"
            >
              ABC
            </button>
            <button
              onClick={() => handleFontChange('cursive')}
              className={`px-2.5 py-1 rounded-lg transition-all italic ${
                fontMode === 'cursive'
                  ? 'bg-amber-400 text-amber-950 shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Letra manuscrita / cursiva escolar"
            >
              ✍️ Cursiva
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sfx.playPop();
              setSoundEnabled(!soundEnabled);
            }}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={soundEnabled ? 'Som ativado' : 'Som desativado'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Botão PDF Supermiúdos Original */}
          <button
            onClick={() => {
              sfx.playPop();
              onOpenPdf();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition-all shadow-xs"
            title="Ver o Quadro Silábico original em PDF"
          >
            <FileText size={15} />
            <span className="hidden md:inline">Ver Quadro</span> PDF
          </button>

          {/* Estrelas / Pontos */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 font-black text-sm shadow-xs">
            <Sparkles size={16} className="text-amber-500 fill-amber-400 animate-pulse" />
            <span>{stars}</span>
            <span className="text-xs font-semibold text-amber-600 hidden sm:inline">estrelas</span>
          </div>
        </div>
      </div>

      {/* Navegação por Abas para Crianças */}
      <div className="max-w-7xl mx-auto px-2 overflow-x-auto scrollbar-none pb-1.5">
        <div className="flex items-center gap-1.5 min-w-max px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md scale-102 ring-2 ring-amber-400'
                    : 'bg-slate-100/90 hover:bg-slate-200/90 text-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${
                    isActive ? tab.color : 'bg-slate-400'
                  }`}
                >
                  <Icon size={14} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
