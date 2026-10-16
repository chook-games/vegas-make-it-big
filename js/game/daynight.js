import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { DAY_LENGTH_MS, SEASONS } from '../core/constants.js';
import { ambientLight, dirLight, neonPointLight, scene } from '../three/scene.js';
import { updateSky } from '../three/sky.js';

function bandFor(hour) {
  if (hour >= 22 || hour < 6) return { id: 'night', name: 'Night', nightFactor: 1.35, dayFactor: 0.8 };
  if (hour < 12) return { id: 'morning', name: 'Morning', nightFactor: 0.85, dayFactor: 1.15 };
  if (hour < 18) return { id: 'day', name: 'Day', nightFactor: 0.8, dayFactor: 1.2 };
  return { id: 'evening', name: 'Evening', nightFactor: 1.15, dayFactor: 0.95 };
}

export function getTimeFactors() {
  const band = bandFor(state.clock.hour);
  return band;
}

export function isNight() {
  const h = state.clock.hour;
  return h >= 20 || h < 6;
}

export function updateDayNight(dtMs) {
  const clock = state.clock;
  clock.hour += (dtMs / DAY_LENGTH_MS) * 24;

  while (clock.hour >= 24) {
    clock.hour -= 24;
    clock.day += 1;
    if ((clock.day - 1) % 7 === 0) {
      clock.seasonIndex = (clock.seasonIndex + 1) % SEASONS.length;
      clock.season = SEASONS[clock.seasonIndex].id;
      Bus.emit(EV.TOAST, { text: `${SEASONS[clock.seasonIndex].icon} New season: ${SEASONS[clock.seasonIndex].name}!`, kind: 'info' });
    }
    Bus.emit(EV.DAY_PASSED, clock.day);
  }

  applyLighting();
}

let lastBg = -1;
function applyLighting() {
  const h = state.clock.hour;
  const dayLight = Math.max(0, Math.sin(((h - 6) / 12) * Math.PI));
  const nightAmount = 1 - dayLight;

  dirLight.intensity = 0.5 + dayLight * 0.9;
  ambientLight.intensity = 0.65 + dayLight * 0.5;
  neonPointLight.intensity = 0.4 + nightAmount * 0.9;

  updateSky(state.clock.hour, nightAmount);

  if (state.mode === 'exterior') {
    const r = Math.round(30 + dayLight * 130);
    const gch = Math.round(34 + dayLight * 150);
    const b = Math.round(55 + dayLight * 160);
    const hex = (r << 16) | (gch << 8) | b;
    if (hex !== lastBg) {
      scene.background.setHex(hex);
      scene.fog.color.setHex(hex);
      lastBg = hex;
    }
  }
}

export function seasonInfo() {
  return SEASONS[state.clock.seasonIndex] || SEASONS[0];
}

export function formatClock() {
  const h = Math.floor(state.clock.hour);
  const m = Math.floor((state.clock.hour - h) * 60);
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const icon = isNight() ? '🌙' : '☀️';
  return `${icon} Day ${state.clock.day} • ${hh}:${mm}`;
}
