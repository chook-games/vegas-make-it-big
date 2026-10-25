import { state, gridFor } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { initAudio, getBus, isUnlocked } from './engine.js';
import { camera } from '../three/scene.js';

const BASE = 'assets/audio/building/';

const RULES = [
  { re: /(casino|roulette|poker|blackjack|vip_bj|sicbo|craps|baccarat|keno|slots|videopoker|progressiveslots|wheeloffortune|carjackpot|texasholdem|paigow|caribbeanstud|highlimit|cage|cashier|vault)/, file: 'casino' },
  { re: /^bar$|lounge/, file: 'bar' },
  { re: /restaurant|buffet|foodcourt/, file: 'restaurant' },
  { re: /kitchen/, file: 'kitchen' },
  { re: /nightclub/, file: 'nightclub' },
  { re: /arcade/, file: 'arcade' },
  { re: /circus/, file: 'circus' },
  { re: /stadium|boxing|theatre|arena/, file: 'arena' },
  { re: /spa|marina|aquarium|titanic/, file: 'dolphinpool' },
  { re: /wavepool|waterride|^pool$/, file: 'wavepool' },
  { re: /fountain/, file: 'fountain' },
  { re: /rollercoaster|ferris/, file: 'rollercoaster' },
  { re: /chapel/, file: 'weddingchapel' },
  { re: /sportsbook/, file: 'sportsbook' },
  { re: /restroom|toilet/, file: 'toilet' },
  { re: /helipad/, file: 'helipad' },
  { re: /generator|powerplant|elechut|solar|waterpump|waterplant/, file: 'power' },
  { re: /mechhut|mechanic|security/, file: 'mechanic' },
  { re: /firstaid/, file: 'firstaid' },
  { re: /creche/, file: 'creche' },
  { re: /coffee/, file: 'coffeebar' }
];

const tracks = new Map();
let active = false;
let timer = null;

function ruleFor(id) {
  if (!id) return null;
  for (const r of RULES) if (r.re.test(id)) return r.file;
  return null;
}

function ensure(file) {
  const c = initAudio();
  if (!c) return null;
  let t = tracks.get(file);
  if (!t) {
    try {
      const el = new Audio(BASE + file + '.ogg');
      el.loop = true;
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      const src = c.createMediaElementSource(el);
      const gain = c.createGain();
      gain.gain.value = 0;
      const panner = c.createStereoPanner ? c.createStereoPanner() : null;
      if (panner) { src.connect(panner); panner.connect(gain); } else { src.connect(gain); }
      gain.connect(getBus('ambience'));
      t = { file, el, gain, panner };
      tracks.set(file, t);
    } catch (e) {
      return null;
    }
  }
  return t;
}

function fade(t, target, ms = 1300) {
  if (!t) return;
  const c = initAudio();
  if (!c) return;
  const now = c.currentTime;
  const g = t.gain.gain;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(target, now + ms / 1000);
  if (target > 0.001) {
    if (t.el.paused) t.el.play().catch(() => {});
  } else {
    setTimeout(() => {
      if (g.value < 0.02) { try { t.el.pause(); } catch (e) {} }
    }, ms + 100);
  }
}

function scan() {
  if (!active || !state.settings.sound || !isUnlocked()) {
    for (const t of tracks.values()) fade(t, 0, 500);
    return;
  }
  const world = state.mode === 'interior' ? 'interior' : 'exterior';
  const grid = (world === 'interior' && state.interiorLayer === 1) ? (state.interiorUpperGrid || {}) : (gridFor(world) || {});
  const cx = camera.position.x;
  const cz = camera.position.z;
  const radius = world === 'interior' ? 18 : 30;
  const best = new Map();

  for (const key in grid) {
    const cell = grid[key];
    if (!cell || !cell.item || !cell.mesh) continue;
    if (cell.layer && world === 'interior' && cell.layer !== state.interiorLayer) continue;
    const file = ruleFor(cell.item.id);
    if (!file) continue;
    const dx = cell.mesh.position.x - cx;
    const dz = cell.mesh.position.z - cz;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > radius) continue;
    const score = 1 - dist / radius;
    const prev = best.get(file);
    if (!prev || score > prev.score) best.set(file, { score, x: cell.mesh.position.x, z: cell.mesh.position.z });
  }

  const ranked = Array.from(best.entries()).sort((a, b) => b[1].score - a[1].score).slice(0, 2);
  const wanted = new Map(ranked);
  const ctx = initAudio();

  for (const [file, data] of wanted) {
    const t = ensure(file);
    fade(t, 0.05 + data.score * 0.22, 1400);
    if (t && t.panner && ctx) {
      const dx = data.x - cx;
      const dz = data.z - cz;
      const e = camera.matrixWorld.elements;
      let pan = (dx * e[0] + dz * e[2]) / 12;
      pan = Math.max(-0.7, Math.min(0.7, pan));
      t.panner.pan.setTargetAtTime(pan, ctx.currentTime, 0.35);
    }
  }
  for (const t of tracks.values()) {
    if (!wanted.has(t.file)) fade(t, 0, 1400);
  }
}

export function startVenues() {
  active = true;
  if (!timer) timer = setInterval(scan, 2200);
  scan();
}

export function stopVenues() {
  active = false;
  if (timer) { clearInterval(timer); timer = null; }
  for (const t of tracks.values()) fade(t, 0, 700);
}

export function refreshVenues() {
  scan();
}

if (typeof window !== 'undefined') {
  window.addEventListener('audio:unlocked', () => { if (active) scan(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      for (const t of tracks.values()) fade(t, 0, 300);
    } else if (active) {
      scan();
    }
  });
}

Bus.on(EV.VIEW_SWITCH, () => { if (active) scan(); });
Bus.on(EV.BUILDING_PLACED, () => { if (active) scan(); });
Bus.on(EV.BUILDING_SOLD, () => { if (active) scan(); });
