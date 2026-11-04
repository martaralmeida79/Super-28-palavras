/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, FontMode, TabType } from './components/Header';
import { QuadroSilabicoView } from './components/QuadroSilabicoView';
import { GuessSyllableGame } from './components/games/GuessSyllableGame';
import { MatchSyllablesGame } from './components/games/MatchSyllablesGame';
import { WordBuilderGame } from './components/games/WordBuilderGame';
import { WritingCanvas } from './components/games/WritingCanvas';
import { DictationGame } from './components/games/DictationGame';
import { WordDetailModal } from './components/WordDetailModal';
import { PdfModal } from './components/PdfModal';
import { WordData } from './data/words28';
import { setGlobalSoundEnabled } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('quadro');
  const [fontMode, setFontMode] = useState<FontMode>('lower');
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('superpalavras_stars');
      return saved ? parseInt(saved, 10) : 10;
    } catch {
      return 10;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [practiceWord, setPracticeWord] = useState<WordData | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    setGlobalSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const addStars = (amount: number) => {
    setStars((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('superpalavras_stars', next.toString());
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handlePracticeWriting = (word: WordData) => {
    setPracticeWord(word);
    setActiveTab('writing');
  };

  const handlePracticeBuilder = (word: WordData) => {
    setPracticeWord(word);
    setActiveTab('builder');
  };

  return (
    <div className="min-h-screen flex flex-col school-grid-bg text-slate-800">
      {/* Header Principal */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fontMode={fontMode}
        setFontMode={setFontMode}
        stars={stars}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenPdf={() => setIsPdfModalOpen(true)}
      />

      {/* Área Principal de Conteúdo e Jogos */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'quadro' && (
          <QuadroSilabicoView
            fontMode={fontMode}
            onSelectWord={(word) => setSelectedWord(word)}
            onOpenPdf={() => setIsPdfModalOpen(true)}
          />
        )}

        {activeTab === 'guess' && (
          <GuessSyllableGame fontMode={fontMode} onAddStars={addStars} />
        )}

        {activeTab === 'match' && (
          <MatchSyllablesGame fontMode={fontMode} onAddStars={addStars} />
        )}

        {activeTab === 'builder' && (
          <WordBuilderGame
            fontMode={fontMode}
            initialWord={practiceWord}
            onAddStars={addStars}
          />
        )}

        {activeTab === 'writing' && (
          <WritingCanvas
            fontMode={fontMode}
            initialWord={practiceWord}
            onAddStars={addStars}
          />
        )}

        {activeTab === 'dictation' && (
          <DictationGame fontMode={fontMode} onAddStars={addStars} />
        )}
      </main>

      {/* Modal de Detalhe da Palavra */}
      <WordDetailModal
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
        fontMode={fontMode}
        onPracticeWriting={handlePracticeWriting}
        onPracticeBuilder={handlePracticeBuilder}
      />

      {/* Modal para Visualização do PDF Original */}
      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* Rodapé Pedagógico */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <p className="font-bold text-slate-700">
          SuperPalavras • Método das 28 Palavras (Supermiúdos 1.º e 2.º Ano)
        </p>
        <p className="text-slate-400">
          Criado para aprendizagem e consolidação da leitura, escrita, divisão silábica e consciência fonológica.
        </p>
      </footer>
    </div>
  );
}
