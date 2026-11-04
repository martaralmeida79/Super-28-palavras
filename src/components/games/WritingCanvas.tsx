import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WORDS_28, WordData } from '../../data/words28';
import { WordSvgIllustration } from '../WordSvgIllustration';
import { formatCase, getFontClass } from '../../utils/textFormat';
import { FontMode } from '../Header';
import { speakPortuguese, speakSyllable, speakSyllableSequence, sfx } from '../../utils/audio';
import {
  PenTool,
  RotateCcw,
  Eraser,
  Volume2,
  Sparkles,
  CheckCircle2,
  Type,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Props {
  fontMode: FontMode;
  initialWord?: WordData | null;
  onAddStars: (amount: number) => void;
}

type PenColor = '#1e293b' | '#2563eb' | '#dc2626' | '#16a34a' | 'rainbow';

export const WritingCanvas: React.FC<Props> = ({
  fontMode,
  initialWord,
  onAddStars,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [penColor, setPenColor] = useState<PenColor>('#1e293b');
  const [lineWidth, setLineWidth] = useState<number>(6);
  const [isEraser, setIsEraser] = useState(false);
  const [showGhostGuide, setShowGhostGuide] = useState(true);
  const [typedInput, setTypedInput] = useState('');
  const [typingFeedback, setTypingFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const activeWord = initialWord || WORDS_28[currentWordIndex];

  useEffect(() => {
    if (initialWord) {
      const idx = WORDS_28.findIndex((w) => w.id === initialWord.id);
      if (idx !== -1) setCurrentWordIndex(idx);
    }
  }, [initialWord]);

  // Limpa o canvas ao trocar de palavra
  useEffect(() => {
    clearCanvas();
    setTypedInput('');
    setTypingFeedback('idle');
  }, [currentWordIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Coordenadas relativas ao canvas com suporte para toque e rato
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCoordinates(e);
    if (!pos) return;
    isDrawingRef.current = true;
    lastPosRef.current = pos;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPos = getCoordinates(e);
    if (!currentPos || !lastPosRef.current) return;

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);

    if (isEraser) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = lineWidth * 3;
    } else if (penColor === 'rainbow') {
      const hue = (Date.now() / 8) % 360;
      ctx.strokeStyle = `hsl(${hue}, 90%, 50%)`;
      ctx.lineWidth = lineWidth;
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = currentPos;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  // Avaliação da escrita no teclado
  const handleCheckTyping = () => {
    const cleanTyped = typedInput.trim().toLowerCase();
    const target = activeWord.word.toLowerCase();

    if (cleanTyped === target) {
      sfx.playCorrect();
      setTypingFeedback('correct');
      onAddStars(3);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      speakPortuguese(`Excelente! Escreveste ${activeWord.word} na perfeição!`);
    } else {
      sfx.playTryAgain();
      setTypingFeedback('wrong');
      speakPortuguese(`Verifica as letras de ${activeWord.word}.`);
    }
  };

  const handleFinishDrawing = () => {
    sfx.playCorrect();
    onAddStars(2);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
    speakPortuguese(`Muito bem! Belo treino de caligrafia!`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Placar Superior */}
      <div className="bg-white rounded-3xl p-4 border-2 border-rose-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black">
            <PenTool size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              Caderno de Escrita e Caligrafia
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Pratica o traçado das letras na pauta de duas linhas
            </p>
          </div>
        </div>

        {/* Escolher Palavra */}
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
        </div>
      </div>

      {/* Caixa do Caderno de Escrita */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-4 border-rose-300 shadow-lg space-y-5">
        {/* Cabeçalho da Palavra Modelo */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
          <div className="flex items-center gap-3">
            <WordSvgIllustration wordId={activeWord.id} size="md" />
            <div>
              <span className="text-xs font-black text-rose-600 uppercase tracking-wider block">
                Palavra a treinar #{activeWord.number}
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-black text-slate-800 ${getFontClass(
                  fontMode
                )}`}
              >
                {formatCase(activeWord.word, fontMode)}
              </h2>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {activeWord.syllables.map((syl, i) => (
                  <button
                    key={i}
                    onClick={() => speakSyllable(syl)}
                    className="text-xs font-extrabold text-slate-700 hover:text-rose-700 bg-white hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-200 shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    title={`Toca para ouvir a sílaba: ${syl}`}
                  >
                    <span>{formatCase(syl, fontMode)}</span>
                    <Volume2 size={12} className="text-rose-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sfx.playPop();
                speakSyllableSequence(activeWord.syllables, activeWord.word);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Ouvir palavra sílaba a sílaba"
            >
              <Volume2 size={16} /> Ouvir Palavra
            </button>
            <button
              onClick={() => {
                sfx.playPop();
                setShowGhostGuide(!showGhostGuide);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
            >
              {showGhostGuide ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showGhostGuide ? 'Ocultar Guia' : 'Mostrar Guia'}</span>
            </button>
          </div>
        </div>

        {/* Barra de Ferramentas de Desenho / Lápis */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          {/* Cores de Lápis */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Lápis:</span>
            <button
              onClick={() => {
                setPenColor('#1e293b');
                setIsEraser(false);
              }}
              className={`w-7 h-7 rounded-full bg-slate-800 border-2 transition-all ${
                penColor === '#1e293b' && !isEraser
                  ? 'ring-2 ring-rose-400 scale-110 border-white'
                  : 'border-transparent'
              }`}
              title="Lápis de Carvão"
            />
            <button
              onClick={() => {
                setPenColor('#2563eb');
                setIsEraser(false);
              }}
              className={`w-7 h-7 rounded-full bg-blue-600 border-2 transition-all ${
                penColor === '#2563eb' && !isEraser
                  ? 'ring-2 ring-rose-400 scale-110 border-white'
                  : 'border-transparent'
              }`}
              title="Caneta Azul"
            />
            <button
              onClick={() => {
                setPenColor('#dc2626');
                setIsEraser(false);
              }}
              className={`w-7 h-7 rounded-full bg-red-600 border-2 transition-all ${
                penColor === '#dc2626' && !isEraser
                  ? 'ring-2 ring-rose-400 scale-110 border-white'
                  : 'border-transparent'
              }`}
              title="Caneta Vermelha"
            />
            <button
              onClick={() => {
                setPenColor('rainbow');
                setIsEraser(false);
              }}
              className={`w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 via-amber-400 to-cyan-500 border-2 transition-all ${
                penColor === 'rainbow' && !isEraser
                  ? 'ring-2 ring-rose-400 scale-110 border-white'
                  : 'border-transparent'
              }`}
              title="Pincel Arco-Íris Mágico"
            />
            <button
              onClick={() => setIsEraser(true)}
              className={`p-1.5 rounded-xl border-2 flex items-center gap-1 text-xs font-bold transition-all ${
                isEraser
                  ? 'bg-rose-100 text-rose-800 border-rose-400'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
              title="Borracha"
            >
              <Eraser size={16} />
              <span>Borracha</span>
            </button>
          </div>

          {/* Espessura do Traço e Limpar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-bold">Traço:</span>
              <button
                onClick={() => setLineWidth(4)}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  lineWidth === 4 ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'
                }`}
              >
                Fino
              </button>
              <button
                onClick={() => setLineWidth(7)}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  lineWidth === 7 ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'
                }`}
              >
                Médio
              </button>
              <button
                onClick={() => setLineWidth(11)}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  lineWidth === 11 ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'
                }`}
              >
                Grosso
              </button>
            </div>

            <button
              onClick={() => {
                sfx.playPop();
                clearCanvas();
              }}
              className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer"
              title="Limpar quadro"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Quadro / Pauta de Caligrafia Interativa */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-slate-300 shadow-inner pauta-caligrafia h-64 sm:h-72 touch-none bg-white">
          {/* Guia Fantasma Ponteada para Caligrafia */}
          {showGhostGuide && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <span
                className={`text-6xl sm:text-7xl font-bold tracking-widest text-slate-200/90 font-mono border-b-2 border-dashed border-blue-300 pb-2 ${getFontClass(
                  fontMode
                )}`}
              >
                {formatCase(activeWord.word, fontMode)}
              </span>
            </div>
          )}

          {/* Canvas de Escrita com Caneta/Rato/Toque */}
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full relative z-10 cursor-crosshair"
          />
        </div>

        {/* Botão de Auto-Avaliação / Conclusão do Traçado */}
        <div className="flex justify-end">
          <button
            onClick={handleFinishDrawing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Terminei de Escrever! Ganhar ⭐</span>
          </button>
        </div>

        {/* Exercício de Escrita no Teclado (Ortografia & Digitação) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type size={18} className="text-amber-700" />
              <h4 className="font-black text-slate-800 text-sm">
                Desafio de Digitação: Escreve a palavra no teclado
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={typedInput}
              onChange={(e) => {
                setTypedInput(e.target.value);
                setTypingFeedback('idle');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheckTyping();
              }}
              placeholder={`Escreve aqui "${activeWord.word}"`}
              className={`flex-1 px-4 py-2.5 rounded-xl bg-white border-2 text-base font-black text-slate-800 focus:outline-none ${
                typingFeedback === 'correct'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : typingFeedback === 'wrong'
                  ? 'border-rose-400 bg-rose-50'
                  : 'border-amber-300 focus:border-amber-500'
              } ${getFontClass(fontMode)}`}
            />
            <button
              onClick={handleCheckTyping}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Verificar
            </button>
          </div>

          {typingFeedback === 'correct' && (
            <div className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={16} />
              <span>Fantástico! Escreveste a palavra corretamente! (+3 estrelas ⭐)</span>
            </div>
          )}

          {typingFeedback === 'wrong' && (
            <div className="text-xs font-bold text-rose-600 animate-in fade-in">
              <span>Ainda não está igual. Revê as letras com atenção e tenta outra vez!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
