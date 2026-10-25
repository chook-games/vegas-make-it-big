import { state } from '../core/state.js';
import { initAudio, getBus, isUnlocked } from './engine.js';

const BASE = 'assets/audio/music/';

const THEME_TRACK = {
  american: 'theme_american',
  ocean: 'theme_ocean',
  space: 'theme_space',
  prehistoric: 'theme_prehistoric',
  oriental: 'theme_oriental',
  egyptian: 'theme_egyptian',
  western: 'theme_western',
  tropical: 'theme_tropical',
  medieval: 'theme_medieval',
  futuristic: 'theme_futuristic'
};

const tracks = new Map();
let intent = { mode: 'off', theme: 'american' };
let base = null;
let overlay = null;
let dayVariant = 1;
let lastPhase = null;
let poll = null;
let ducked = false;

function startTrack(name, target, ms) {
  const c = initAudio();
  if (!c) return null;
  let t = tracks.get(name);
  if (!t) {
    try {
      const el = new Audio(BASE + name + '.ogg');
      el.loop = true;
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      const src = c.createMediaElementSource(el);
      const gain = c.createGain();
      gain.gain.value = 0;
      src.connect(gain);
      gain.connect(getBus('music'));
      t = { name, el, gain, loop: true };
      tracks.set(name, t);
    } catch (e) {
      return null;
    }
  }
  if (t.el.paused) t.el.play().catch(() => {});
  fade(t, target, ms);
  return t;
}

function fade(t, target, ms) {
  if (!t) return;
  const c = initAudio();
  if (!c) return;
  const now = c.currentTime;
  const g = t.gain.gain;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(target, now + Math.max(40, ms) / 1000);
  if (target > 0.001) {
    if (t.el.paused) t.el.play().catch(() => {});
  } else {
    setTimeout(() => {
      if (g.value < 0.02) {
        try { t.el.pause(); } catch (e) {}
      }
    }, Math.max(80, ms) + 80);
  }
}

function phase() {
  const h = state.clock ? state.clock.hour : 12;
  return (h >= 6 && h < 19) ? 'day' : 'night';
}

function overlayName() {
  return phase() === 'day' ? 'day' + dayVariant : 'night' + dayVariant;
}

function applyIntent() {
  if (!state.settings.music) { stopAll(600); return; }
  if (!isUnlocked()) return;
  if (intent.mode === 'off') { stopAll(600); return; }

  let baseName;
  let ovName = null;
  if (intent.mode === 'menu') {
    baseName = 'title';
  } else {
    baseName = THEME_TRACK[intent.theme] || THEME_TRACK.american;
    const p = phase();
    if (lastPhase && p !== lastPhase) dayVariant = dayVariant === 1 ? 2 : 1;
    lastPhase = p;
    ovName = overlayName();
  }

  if (!base || base.name !== baseName) {
    if (base) fade(base, 0, 1100);
    base = startTrack(baseName, ducked ? 0.25 : 0.9, 1100);
  }
  if ((overlay ? overlay.name : null) !== ovName) {
    if (overlay) fade(overlay, 0, 1200);
    overlay = ovName ? startTrack(ovName, 0.2, 1200) : null;
  }
  if (base && base.el.paused) base.el.play().catch(() => {});
  if (overlay && overlay.el.paused) overlay.el.play().catch(() => {});
}

function stopAll(ms) {
  if (base) fade(base, 0, ms || 600);
  if (overlay) fade(overlay, 0, ms || 600);
  base = null;
  overlay = null;
  ducked = false;
  if (poll) { clearInterval(poll); poll = null; }
}

function startPoll() {
  if (poll) return;
  poll = setInterval(() => {
    if (!state.settings.music || intent.mode !== 'game') return;
    applyIntent();
  }, 20000);
}

export function playMenuMusic() {
  intent = { mode: 'menu', theme: intent.theme };
  if (poll) { clearInterval(poll); poll = null; }
  applyIntent();
}

export function playGameMusic(themeId) {
  intent = { mode: 'game', theme: themeId || 'american' };
  lastPhase = null;
  applyIntent();
  startPoll();
}

export function refreshMusic() {
  if (!state.settings.music) {
    stopAll(500);
  } else {
    applyIntent();
    if (intent.mode === 'game') startPoll();
  }
}

export function playSting(kind) {
  if (!state.settings.music || !isUnlocked()) return;
  const c = initAudio();
  if (!c) return;
  let t = tracks.get('sting_' + kind);
  if (!t) {
    const el = new Audio(BASE + 'sting_' + kind + '.ogg');
    el.loop = false;
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    const src = c.createMediaElementSource(el);
    const gain = c.createGain();
    gain.gain.value = 0;
    src.connect(gain);
    gain.connect(getBus('music'));
    t = { name: 'sting_' + kind, el, gain, loop: false, sting: true };
    tracks.set(t.name, t);
  }
  try { t.el.currentTime = 0; } catch (e) {}
  fade(t, 0.85, 120);
  if (base) { ducked = true; fade(base, 0.3, 160); }
  if (overlay) fade(overlay, 0.06, 160);
  const done = () => {
    fade(t, 0, 400);
    if (base && ducked) { ducked = false; fade(base, 0.9, 700); }
    if (overlay) fade(overlay, 0.2, 700);
    t.el.removeEventListener('ended', done);
  };
  t.el.addEventListener('ended', done);
}

if (typeof window !== 'undefined') {
  window.addEventListener('audio:unlocked', () => {
    applyIntent();
    if (intent.mode === 'game') startPoll();
  });
}
