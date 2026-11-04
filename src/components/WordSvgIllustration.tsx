import React from 'react';

interface Props {
  wordId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const WordSvgIllustration: React.FC<Props> = ({ wordId, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-16 h-16 text-4xl',
    lg: 'w-24 h-24 text-6xl',
    xl: 'w-32 h-32 text-7xl',
  };

  // Ícones e fundos temáticos específicos com alto contraste para crianças
  const renderArt = () => {
    switch (wordId) {
      case 'menina':
        return (
          <div className="relative flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-200 border-2 border-pink-300 shadow-inner">
            <span className="filter drop-shadow-sm">👧</span>
            <span className="absolute -top-1 -right-1 text-xs">🌸</span>
          </div>
        );
      case 'menino':
        return (
          <div className="relative flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-blue-100 to-cyan-200 border-2 border-blue-300 shadow-inner">
            <span className="filter drop-shadow-sm">👦</span>
            <span className="absolute -top-1 -right-1 text-xs">⚽</span>
          </div>
        );
      case 'sapato':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-teal-100 to-emerald-200 border-2 border-teal-300 shadow-inner">
            <span className="filter drop-shadow-sm">👞</span>
          </div>
        );
      case 'bota':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-200 border-2 border-amber-300 shadow-inner">
            <span className="filter drop-shadow-sm">👢</span>
          </div>
        );
      case 'uva':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-200 border-2 border-purple-300 shadow-inner">
            <span className="filter drop-shadow-sm">🍇</span>
          </div>
        );
      case 'dedo':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-sky-100 to-blue-200 border-2 border-sky-300 shadow-inner">
            <span className="filter drop-shadow-sm">☝️</span>
          </div>
        );
      case 'leque':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-rose-100 to-red-200 border-2 border-rose-300 shadow-inner">
            <span className="filter drop-shadow-sm">🪭</span>
          </div>
        );
      case 'casa':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-amber-100 to-yellow-200 border-2 border-amber-300 shadow-inner">
            <span className="filter drop-shadow-sm">🏠</span>
          </div>
        );
      case 'janela':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-cyan-100 to-blue-200 border-2 border-cyan-300 shadow-inner">
            <span className="filter drop-shadow-sm">🪟</span>
          </div>
        );
      case 'telhado':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-orange-100 to-amber-200 border-2 border-orange-300 shadow-inner">
            <span className="filter drop-shadow-sm">🧱</span>
          </div>
        );
      case 'escada':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-stone-100 to-zinc-200 border-2 border-stone-300 shadow-inner">
            <span className="filter drop-shadow-sm">🪜</span>
          </div>
        );
      case 'chave':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-yellow-100 to-amber-200 border-2 border-yellow-300 shadow-inner">
            <span className="filter drop-shadow-sm">🔑</span>
          </div>
        );
      case 'galinha':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-200 border-2 border-amber-300 shadow-inner">
            <span className="filter drop-shadow-sm">🐔</span>
          </div>
        );
      case 'gema':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-yellow-100 to-amber-200 border-2 border-yellow-300 shadow-inner">
            <span className="filter drop-shadow-sm">🍳</span>
          </div>
        );
      case 'rato':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-zinc-100 to-neutral-200 border-2 border-zinc-300 shadow-inner">
            <span className="filter drop-shadow-sm">🐭</span>
          </div>
        );
      case 'cenoura':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-orange-100 to-amber-200 border-2 border-orange-300 shadow-inner">
            <span className="filter drop-shadow-sm">🥕</span>
          </div>
        );
      case 'girafa':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-amber-100 to-yellow-200 border-2 border-amber-300 shadow-inner">
            <span className="filter drop-shadow-sm">🦒</span>
          </div>
        );
      case 'palhaco':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-pink-100 to-purple-200 border-2 border-pink-300 shadow-inner">
            <span className="filter drop-shadow-sm">🤡</span>
          </div>
        );
      case 'zebra':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-slate-100 to-zinc-200 border-2 border-slate-300 shadow-inner">
            <span className="filter drop-shadow-sm">🦓</span>
          </div>
        );
      case 'bandeira':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-emerald-100 to-red-100 border-2 border-emerald-300 shadow-inner">
            <span className="filter drop-shadow-sm">🇵🇹</span>
          </div>
        );
      case 'funil':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-blue-100 to-cyan-200 border-2 border-blue-300 shadow-inner">
            <span className="filter drop-shadow-sm">🌪️</span>
          </div>
        );
      case 'arvore':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-green-100 to-emerald-200 border-2 border-green-300 shadow-inner">
            <span className="filter drop-shadow-sm">🌳</span>
          </div>
        );
      case 'quadro':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-sky-100 to-indigo-200 border-2 border-sky-300 shadow-inner">
            <span className="filter drop-shadow-sm">🖼️</span>
          </div>
        );
      case 'passarinho':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-blue-100 to-amber-100 border-2 border-blue-300 shadow-inner">
            <span className="filter drop-shadow-sm">🐦</span>
          </div>
        );
      case 'peixe':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-indigo-100 to-blue-200 border-2 border-indigo-300 shadow-inner">
            <span className="filter drop-shadow-sm">🐟</span>
          </div>
        );
      case 'cigarra':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-lime-100 to-green-200 border-2 border-lime-300 shadow-inner">
            <span className="filter drop-shadow-sm">🦗</span>
          </div>
        );
      case 'fogueira':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-orange-100 to-red-200 border-2 border-orange-300 shadow-inner">
            <span className="filter drop-shadow-sm">🔥</span>
          </div>
        );
      case 'flor':
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-200 border-2 border-pink-300 shadow-inner">
            <span className="filter drop-shadow-sm">🌸</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-full h-full rounded-2xl bg-amber-100 border-2 border-amber-300">
            <span>✨</span>
          </div>
        );
    }
  };

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      {renderArt()}
    </div>
  );
};
