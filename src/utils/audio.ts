/**
 * Utilitário Avançado de Áudio e Consciência Fonológica
 * Especialmente concebido para o Método das 28 Palavras (2.º ano de escolaridade)
 * Suporta Web Speech API com vozes em Português (pt-PT / pt-BR) e efeitos sonoros ricos em Web Audio API.
 */

let globalSoundEnabled = true;

export function setGlobalSoundEnabled(enabled: boolean) {
  globalSoundEnabled = enabled;
  if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isGlobalSoundEnabled(): boolean {
  return globalSoundEnabled;
}

// Cache de vozes em Português
let cachedPtVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const updateVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // Prioridade: Português de Portugal (pt-PT) -> Português do Brasil (pt-BR) -> qualquer pt
    cachedPtVoice =
      voices.find((v) => v.lang.toLowerCase() === 'pt-pt') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('pt-pt')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('pt')) ||
      null;

    voicesLoaded = true;
  };

  updateVoices();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

if (typeof window !== 'undefined') {
  initVoices();
}

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Toque suave e alegre ao clicar numa sílaba
  playSyllableTap() {
    if (!globalSoundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // safe
    }
  }

  // Som suave de clique geral
  playPop() {
    if (!globalSoundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // safe
    }
  }

  // Som de acerto / correspondência correta de sílaba
  playCorrect() {
    if (!globalSoundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.22, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.2);
      });
    } catch {
      // safe
    }
  }

  // Som amigável para tentar novamente
  playTryAgain() {
    if (!globalSoundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // safe
    }
  }

  // Fanfarra triunfal ao completar palavra ou ronda
  playFanfare() {
    if (!globalSoundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.11 }, // C5
        { f: 523.25, d: 0.11 }, // C5
        { f: 523.25, d: 0.11 }, // C5
        { f: 659.25, d: 0.22 }, // E5
        { f: 783.99, d: 0.22 }, // G5
        { f: 1046.5, d: 0.4 },  // C6
      ];
      let t = now;
      melody.forEach((item) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0.24, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + item.d + 0.02);
        t += item.d;
      });
    } catch {
      // safe
    }
  }
}

export const sfx = new SoundEffects();

/**
 * Pronuncia uma palavra, frase ou instrução em Português
 */
export function speakPortuguese(
  text: string,
  rate = 0.85,
  pitch = 1.05,
  onEnd?: () => void
) {
  if (!globalSoundEnabled) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/–|-/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate; // Ritmo calmo e compreensível para 2.º ano
    utterance.pitch = pitch;

    if (!cachedPtVoice) {
      initVoices();
    }

    if (cachedPtVoice) {
      utterance.voice = cachedPtVoice;
    }
    utterance.lang = 'pt-PT';

    if (onEnd) {
      utterance.onend = () => {
        onEnd();
      };
      utterance.onerror = () => {
        onEnd();
      };
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // safe
  }
}

/**
 * Pronúncia refinada de sílaba isolada para treino fonológico.
 * Algumas sílabas precisam de formatação para que o sintetizador vocal
 * as pronuncie com a tonicidade e clareza certas em português europeu.
 */
export function speakSyllable(syllable: string, onEnd?: () => void) {
  if (!globalSoundEnabled) return;
  const s = syllable.trim().toLowerCase();
  if (!s || s === '–' || s === '-') return;

  // Ajustes fonéticos suaves para sílabas isoladas não soarem apressadas
  let textToSpeak = s;

  // Ex: dígrafos e sílabas especiais em português
  if (s === 'ar' || s === 'as' || s === 'al') {
    textToSpeak = `${s}.`;
  } else if (s === 'lha' || s === 'lho' || s === 'lhe' || s === 'lhi' || s === 'lhu') {
    textToSpeak = `${s}!`;
  } else if (s === 'nha' || s === 'nho' || s === 'nhe' || s === 'nhi' || s === 'nhu') {
    textToSpeak = `${s}!`;
  } else if (s === 'cha' || s === 'che' || s === 'chi' || s === 'cho' || s === 'chu') {
    textToSpeak = `${s}!`;
  } else if (s === 'bra' || s === 'bre' || s === 'bri' || s === 'bro' || s === 'bru') {
    textToSpeak = `${s}!`;
  } else if (s === 'dra' || s === 'dre' || s === 'dri' || s === 'dro' || s === 'dru') {
    textToSpeak = `${s}!`;
  } else if (s === 'fla' || s === 'fle' || s === 'fli' || s === 'flo' || s === 'flu') {
    textToSpeak = `${s}!`;
  } else {
    textToSpeak = `${s}!`;
  }

  sfx.playSyllableTap();
  speakPortuguese(textToSpeak, 0.8, 1.1, onEnd);
}

/**
 * Análise e Síntese Silábica:
 * Pronuncia cada sílaba pausadamente (ex: "sa... pa... to...")
 * seguida da palavra completa ("sapato!").
 * Fundamental no Método das 28 Palavras para consolidar a consciência fonológica.
 */
export function speakSyllableSequence(
  syllables: string[],
  fullWord?: string,
  onComplete?: () => void
) {
  if (!globalSoundEnabled) {
    onComplete?.();
    return;
  }

  const validSyllables = syllables.filter((s) => s && s !== '–' && s !== '-');
  if (validSyllables.length === 0) {
    if (fullWord) speakPortuguese(fullWord, 0.85, 1.05, onComplete);
    return;
  }

  let index = 0;

  function speakNext() {
    if (index < validSyllables.length) {
      const syl = validSyllables[index];
      index++;
      speakSyllable(syl, () => {
        setTimeout(speakNext, 250);
      });
    } else if (fullWord) {
      setTimeout(() => {
        sfx.playCorrect();
        speakPortuguese(fullWord, 0.85, 1.05, onComplete);
      }, 350);
    } else {
      onComplete?.();
    }
  }

  speakNext();
}
