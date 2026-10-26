/**
 * Feedback del minijuego: vibración donde el dispositivo la soporta y sonido opcional, apagado por defecto.
 * Los tonos se sintetizan con Web Audio, sin archivos. Nunca son la única señal: el resultado siempre se muestra en pantalla.
 */
import { haptics } from './merchant/haptics';

const SOUND_KEY = 'navidad-sound';

export function readSoundPreference() {
  try { return window.localStorage.getItem(SOUND_KEY) === 'on'; } catch { return false; }
}

export function saveSoundPreference(enabled: boolean) {
  try { window.localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off'); } catch { /* sin almacenamiento: vale solo para esta visita */ }
}

let audioContext: AudioContext | null = null;

/** Cada nota es [frecuencia en Hz, inicio en s, duración en s]. */
function playNotes(notes: Array<[number, number, number]>) {
  if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') return;
  try {
    audioContext ??= new window.AudioContext();
    const context = audioContext;
    if (context.state === 'suspended') void context.resume();
    for (const [frequency, start, duration] of notes) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const at = context.currentTime + start;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.08, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + duration + 0.02);
    }
  } catch { /* sin audio disponible */ }
}

export const playFeedback = {
  spinStart(sound: boolean) {
    haptics.scan();
    if (sound) playNotes([[520, 0, 0.09]]);
  },
  win(sound: boolean) {
    haptics.success();
    if (sound) playNotes([[523, 0, 0.16], [659, 0.13, 0.16], [784, 0.26, 0.32]]);
  },
  noPrize(sound: boolean) {
    haptics.scan();
    if (sound) playNotes([[440, 0, 0.14], [392, 0.12, 0.22]]);
  },
  error() {
    haptics.error();
  },
};
