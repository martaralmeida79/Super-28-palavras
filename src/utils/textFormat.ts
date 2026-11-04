import { FontMode } from '../components/Header';

export function formatCase(text: string, mode: FontMode): string {
  if (!text) return '';
  if (mode === 'upper') {
    return text.toUpperCase();
  }
  return text.toLowerCase();
}

export function getFontClass(mode: FontMode): string {
  if (mode === 'cursive') {
    // Estilo que simula a caligrafia escolar redonda
    return 'italic font-serif tracking-wide';
  }
  return 'tracking-normal';
}
