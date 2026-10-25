import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { initAudio, getBus, isUnlocked } from './engine.js';
import { guestCount } from '../game/guests.js';
import { weatherId } from '../game/weather.js';

const BASE = 'assets/audio/ambience/';

const FILES = {
  outside_quiet: 'outside_quiet',
  outside_people: 'outside_people',
  outside_traffic: 'outside_traffic',
  inside: 'inside',
  inside_machines: 'inside_machines',
  storm: 'storm',
  duststorm: 'duststorm',
  thunder: 'thunder',
  earthquake: 'earthquake'
};

const tracks = new Map();
let active = false;
let timer = null;

function ensure(name) {
  const c = initAudio();
  if (!c) return null;
  let t = tracks.get(name);
  if (!t) {
    try {
      const el = new Audio(BASE + FILES[name] + '.ogg');
      el.loop = name !== 'thunder' && name !== 'earthquake';
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      const src = c.createMediaElementSource(el);
      const gain = c.createGain();
      gain.gain.value = 0;
      src.connect(gain);
      gain.connect(getBus('ambience'));
      t = { name, el, gain };
      tracks.set(name, t);
    } catch (e) {
      return null;
    }
  }
  if (t.el.loop && t.el.paused) t.el.play().catch(() => {});
  return t;
}

function fade(name, target, ms = 1600) {
  if (target <= 0.001 && !tracks.has(name)) return;
  const t = ensure(name);
  if (!t) return;
  const c = initAudio();
  if (!c) return;
  const now = c.currentTime;
  const g = t.gain.gain;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(target, now + Math.max(50, ms) / 1000);
  if (target > 0.001 && t.el.loop && t.el.paused) t.el.play().catch(() => {});
  if (target <= 0.001 && t.el.loop) {
    setTimeout(() => {
      if (g.value < 0.02) { try { t.el.pause(); } catch (e) {} }
    }, Math.max(80, ms) + 100);
  }
}

function once(name, vol) {
  const c = initAudio();
  if (!c) return;
  ensure(name);
  const t = tracks.get(name);
  if (!t) return;
  try { t.el.currentTime = 0; } catch (e) {}
  const now = c.currentTime;
  t.gain.gain.cancelScheduledValues(now);
  t.gain.gain.setValueAtTime(vol, now);
  t.gain.gain.linearRampToValueAtTime(0, now + 0.25 + (t.el.duration || 3));
  t.el.play().catch(() => {});
}

function weatherLayer() {
  const w = weatherId();
  if (w === 'storm') return { name: 'storm', vol: 0.5 };
  if (w === 'snow') return { name: 'storm', vol: 0.3 };
  if (w === 'rain') return { name: 'storm', vol: 0.22 };
  if (w === 'duststorm') return { name: 'duststorm', vol: 0.5 };
  return { name: null, vol: 0 };
}

function effective() {
  return active && state.settings.sound && isUnlocked() && (state.settings.ambVol == null || state.settings.ambVol > 0);
}

function update() {
  if (!effective()) {
    for (const name of tracks.keys()) {
      if (name !== 'thunder' && name !== 'earthquake') fade(name, 0, 800);
    }
    return;
  }

  const inside = state.mode === 'interior';
  const guests = Math.max(0, guestCount());
  const crowd = Math.min(1, guests / 28);
  const w = weatherLayer();

  fade('outside_quiet', inside ? 0 : 0.45, 1600);
  fade('outside_people', inside ? 0 : 0.1 + crowd * 0.5, 2000);
  fade('outside_traffic', inside ? 0 : 0.18, 1800);
  fade('inside', inside ? 0.55 : 0, 1400);
  fade('inside_machines', inside ? 0.25 : 0, 1400);

  const stormOn = !inside && w.name === 'storm';
  const dustOn = !inside && w.name === 'duststorm';
  fade('storm', stormOn ? w.vol : 0, 2200);
  fade('duststorm', dustOn ? w.vol : 0, 2200);

  if (stormOn && w.vol >= 0.3 && Math.random() < 0.3) once('thunder', 0.4);
}

export function startAmbience() {
  active = true;
  if (!timer) timer = setInterval(update, 4500);
  update();
}

export function stopAmbience() {
  active = false;
  if (timer) { clearInterval(timer); timer = null; }
  for (const name of tracks.keys()) {
    if (name !== 'thunder' && name !== 'earthquake') fade(name, 0, 700);
  }
}

export function refreshAmbience() {
  update();
}

if (typeof window !== 'undefined') {
  window.addEventListener('audio:unlocked', () => { if (active) update(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      for (const name of tracks.keys()) {
        if (name !== 'thunder' && name !== 'earthquake') fade(name, 0, 300);
      }
    } else if (active) {
      update();
    }
  });
}

if (typeof Bus !== 'undefined') {
  Bus.on(EV.VIEW_SWITCH, () => { if (active) update(); });
  Bus.on(EV.SHAKE, () => { if (effective()) once('earthquake', 0.8); });
}
