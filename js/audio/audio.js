import { state } from '../core/state.js';
import {
  initAudio, getBus, loadBuffer, playBuffer,
  unlockAudio as engineUnlock, suspendAudio, resumeAudio
} from './engine.js';

const SAMPLES = {
  click: 'assets/audio/ui/click.ogg',
  cash: 'assets/audio/ui/cash.ogg',
  firework_launch_1: 'assets/audio/sfx/firework_launch_1.ogg',
  firework_launch_2: 'assets/audio/sfx/firework_launch_2.ogg',
  firework_launch_3: 'assets/audio/sfx/firework_launch_3.ogg',
  firework_explode_1: 'assets/audio/sfx/firework_explode_1.ogg',
  firework_explode_2: 'assets/audio/sfx/firework_explode_2.ogg',
  firework_explode_3: 'assets/audio/sfx/firework_explode_3.ogg',
  firework_explode_4: 'assets/audio/sfx/firework_explode_4.ogg',
  firework_explode_5: 'assets/audio/sfx/firework_explode_5.ogg',
  firework_explode_6: 'assets/audio/sfx/firework_explode_6.ogg'
};

const SAMPLE_SFX = {
  preview: { name: 'click', vol: 0.45, rate: 1.05 },
  rotate: { name: 'click', vol: 0.55, rate: 0.85 },
  confirm: { name: 'click', vol: 0.7, rate: 1.2 },
  cancel: { name: 'click', vol: 0.45, rate: 0.75 },
  error: { name: 'click', vol: 0.5, rate: 0.55 },
  coin: { name: 'cash', vol: 0.45, rate: 1.0 },
  firework_launch: { list: ['firework_launch_1', 'firework_launch_2', 'firework_launch_3'], vol: 0.55, rate: 1.0 },
  firework_explode: { list: ['firework_explode_1', 'firework_explode_2', 'firework_explode_3', 'firework_explode_4', 'firework_explode_5', 'firework_explode_6'], vol: 0.5, rate: 1.0 }
};

export function unlockAudio() {
  engineUnlock();
}

function tone(opt) {
  const c = initAudio();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opt.type || 'sine';
  osc.connect(gain);
  gain.connect(getBus('sfx'));
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
  const s = SAMPLE_SFX[type];
  if (s) {
    const c = initAudio();
    if (!c) return;
    const name = s.list ? s.list[Math.floor(Math.random() * s.list.length)] : s.name;
    loadBuffer(name, SAMPLES[name]).then(() => {
      playBuffer(name, { vol: s.vol, rate: s.rate });
    });
    return;
  }
  try {
    switch (type) {
      case 'levelup':
        tone({ type: 'triangle', f0: 520, f1: 780, dur: 0.12, vol: 0.14 });
        setTimeout(() => tone({ type: 'triangle', f0: 780, f1: 1040, dur: 0.14, vol: 0.14 }), 100);
        break;
      case 'achievement':
        tone({ type: 'sine', f0: 660, dur: 0.12, vol: 0.13 });
        setTimeout(() => tone({ type: 'sine', f0: 880, dur: 0.14, vol: 0.13 }), 110);
        setTimeout(() => tone({ type: 'sine', f0: 1180, dur: 0.2, vol: 0.13 }), 230);
        break;
      case 'quest':
        tone({ type: 'sine', f0: 700, f1: 1000, dur: 0.16, vol: 0.13 });
        break;
    }
  } catch (e) {}
}

export function vibrate(pattern) {
  if (!state.settings.vibration) return;
  try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) {}
}

export { suspendAudio, resumeAudio };