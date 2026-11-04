import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { sfx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pdfUrl = '/assets/aistudio/quadro_sila_bico_texto_f109e36b.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border-4 border-amber-400">
        {/* Top Bar */}
        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                Quadro Silábico Original • Supermiúdos 1.º e 2.º Ano
              </h2>
              <p className="text-xs text-amber-100">
                Ficha oficial do Método das 28 Palavras (Páginas 1 e 2)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">Nova Janela</span>
            </a>
            <a
              href={pdfUrl}
              download="quadro_silabico_supermiudos.pdf"
              className="px-3 py-1.5 rounded-xl bg-white text-amber-800 hover:bg-amber-50 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Descarregar PDF</span>
            </a>
            <button
              onClick={() => {
                sfx.playPop();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Frame */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title="Quadro Silábico Supermiúdos"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
