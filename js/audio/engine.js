import { state } from '../core/state.js';

let ctx = null;
let master = null;
let musicBus = null;
let sfxBus = null;
let ambBus = null;
let unlocked = false;

const buffers = new Map();

export function initAudio() {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 18;
    comp.ratio.value = 3;
    comp.attack.value = 0.004;
    comp.release.value = 0.25;
    comp.connect(ctx.destination);

    master = ctx.createGain();
    master.connect(comp);

    musicBus = ctx.createGain();
    sfxBus = ctx.createGain();
    ambBus = ctx.createGain();
    musicBus.connect(master);
    sfxBus.connect(master);
    ambBus.connect(master);

    applyVolumes();
  } catch (e) {
    ctx = null;
  }
  return ctx;
}

function vol(key, def) {
  const v = state.settings ? state.settings[key] : undefined;
  return typeof v === 'number' ? v : def;
}

export function applyVolumes() {
  if (!ctx) return;
  master.gain.value = vol('masterVol', 0.9);
  musicBus.gain.value = vol('musicVol', 0.6);
  sfxBus.gain.value = vol('sfxVol', 0.85);
  ambBus.gain.value = vol('ambVol', 0.7);
}

export function getBus(name) {
  initAudio();
  return name === 'music' ? musicBus : name === 'ambience' ? ambBus : sfxBus;
}

export function audioReady() {
  return !!ctx;
}

export function loadBuffer(name, url) {
  if (buffers.has(name)) return buffers.get(name);
  const c = initAudio();
  if (!c) return Promise.resolve(null);
  const p = fetch(url)
    .then(r => {
      if (!r.ok) throw new Error('audio ' + r.status);
      return r.arrayBuffer();
    })
    .then(ab => new Promise((resolve, reject) => c.decodeAudioData(ab, resolve, reject)))
    .then(buf => buf)
    .catch(() => null);
  buffers.set(name, p);
  return p;
}

export function bufferReady(name) {
  const b = buffers.get(name);
  return !!b && (typeof b.then !== 'function');
}

export function playBuffer(name, opt = {}) {
  const c = initAudio();
  if (!c) return;
  const raw = buffers.get(name);
  if (!raw) return;
  const go = (buf) => {
    if (!buf) return;
    try {
      const src = c.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = opt.rate || 1.0;
      const g = c.createGain();
      g.gain.value = opt.vol == null ? 1 : opt.vol;
      let node = src;
      if (opt.pan && c.createStereoPanner) {
        const p = c.createStereoPanner();
        p.pan.value = Math.max(-1, Math.min(1, opt.pan));
        src.connect(p);
        node = p;
      }
      node.connect(g);
      g.connect(opt.bus === 'music' ? musicBus : opt.bus === 'ambience' ? ambBus : sfxBus);
      src.start();
    } catch (e) {}
  };
  if (typeof raw.then === 'function') raw.then(go);
  else go(raw);
}

export function unlockAudio() {
  const c = initAudio();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  if (!unlocked) {
    unlocked = true;
    preloadCore();
  }
}

export function preloadCore() {
  loadBuffer('click', 'assets/audio/ui/click.ogg');
  loadBuffer('cash', 'assets/audio/ui/cash.ogg');
}

export function suspendAudio() {
  if (ctx && ctx.state === 'running') ctx.suspend();
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended' && state.settings && state.settings.sound) ctx.resume();
}
