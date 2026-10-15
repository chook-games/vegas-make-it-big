import { state } from '../core/state.js';

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function unlockAudio() {
  try { getCtx(); } catch (e) {}
}

function tone(opt) {
  const c = getCtx();
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opt.type || 'sine';
  osc.connect(gain);
  gain.connect(c.destination);
  const start = opt.f0 || 440;
  osc.frequency.setValueAtTime(start, now);
  if (opt.f1) osc.frequency.exponentialRampToValueAtTime(opt.f1, now + (opt.dur || 0.1));
  gain.gain.setValueAtTime(opt.vol || 0.12, now);
  gain.gain.linearRampToValueAtTime(0.001, now + (opt.dur || 0.1));
  osc.start(now);
  osc.stop(now + (opt.dur || 0.1) + 0.02);
}

export function playSound(type) {
  if (!state.settings.sound) return;
  try {
    switch (type) {
      case 'preview': tone({ type: 'sine', f0: 420, f1: 580, dur: 0.09, vol: 0.11 }); break;
      case 'rotate': tone({ type: 'triangle', f0: 520, f1: 700, dur: 0.08, vol: 0.13 }); break;
      case 'confirm': tone({ type: 'triangle', f0: 440, f1: 680, dur: 0.2, vol: 0.16 }); break;
      case 'cancel': tone({ type: 'sawtooth', f0: 300, f1: 180, dur: 0.13, vol: 0.1 }); break;
      case 'coin': tone({ type: 'square', f0: 900, f1: 1400, dur: 0.09, vol: 0.07 }); break;
      case 'levelup':
        tone({ type: 'triangle', f0: 520, f1: 780, dur: 0.12, vol: 0.14 });
        setTimeout(() => tone({ type: 'triangle', f0: 780, f1: 1040, dur: 0.14, vol: 0.14 }), 100);
        break;
      case 'achievement':
        tone({ type: 'sine', f0: 660, dur: 0.12, vol: 0.13 });
        setTimeout(() => tone({ type: 'sine', f0: 880, dur: 0.14, vol: 0.13 }), 110);
        setTimeout(() => tone({ type: 'sine', f0: 1180, dur: 0.2, vol: 0.13 }), 230);
        break;
      case 'error': tone({ type: 'sawtooth', f0: 220, f1: 120, dur: 0.18, vol: 0.12 }); break;
      case 'quest': tone({ type: 'sine', f0: 700, f1: 1000, dur: 0.16, vol: 0.13 }); break;
    }
  } catch (e) {}
}

let musicNodes = null;

export function startMusic() {
  if (!state.settings.music || musicNodes) return;
  try {
    const c = getCtx();
    const master = c.createGain();
    master.gain.value = 0.045;
    master.connect(c.destination);
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.connect(master);

    const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23];
    let i = 0;
    const osc = c.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = notes[0];
    osc.connect(filter);
    osc.start();

    const scheduler = setInterval(() => {
      i = (i + 1) % notes.length;
      const t = c.currentTime;
      osc.frequency.linearRampToValueAtTime(notes[i], t + 0.9);
    }, 950);

    musicNodes = { master, osc, scheduler };
  } catch (e) {}
}

export function stopMusic() {
  if (!musicNodes) return;
  try {
    clearInterval(musicNodes.scheduler);
    musicNodes.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => { try { musicNodes.osc.stop(); } catch (e) {} }, 500);
  } catch (e) {}
  musicNodes = null;
}

export function refreshMusic() {
  if (state.settings.music) startMusic();
  else stopMusic();
}

export function vibrate(pattern) {
  if (!state.settings.vibration) return;
  try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) {}
}
