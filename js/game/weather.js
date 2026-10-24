import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';

export const WEATHER = {
  clear: { name: 'Clear', icon: '☀️', guestMul: 1, incomeMul: 1, casinoMul: 1, light: 1 },
  rain: { name: 'Rain', icon: '🌧️', guestMul: 0.8, incomeMul: 1.0, casinoMul: 1.2, light: 0.82 },
  storm: { name: 'Storm', icon: '⛈️', guestMul: 0.65, incomeMul: 0.92, casinoMul: 1.3, light: 0.66 },
  heatwave: { name: 'Heatwave', icon: '🔥', guestMul: 0.9, incomeMul: 1.15, casinoMul: 1.05, light: 1.12 },
  snow: { name: 'Snow', icon: '❄️', guestMul: 0.78, incomeMul: 1.0, casinoMul: 1.15, light: 0.9 },
  duststorm: { name: 'Dust Storm', icon: '🌪️', guestMul: 0.72, incomeMul: 0.9, casinoMul: 1.2, light: 0.8 }
};

function pickType() {
  const winter = state.clock && state.clock.season === 'winter';
  const pool = winter ? ['rain', 'snow', 'snow', 'storm'] : ['rain', 'storm', 'heatwave'];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function ensureWeather() {
  if (!state.weather) state.weather = { id: 'clear', remaining: 25000 };
}

export function updateWeather(dtMs) {
  ensureWeather();
  state.weather.remaining -= dtMs;
  if (state.weather.remaining > 0) return;

  const freq = state.disastersFreq != null ? state.disastersFreq : 1;
  if (freq <= 0 || Math.random() > 0.45 * freq) {
    state.weather = { id: 'clear', remaining: 25000 + Math.random() * 25000 };
    return;
  }
  const id = pickType();
  state.weather = { id, remaining: 14000 + Math.random() * 14000 };
  const w = WEATHER[id] || WEATHER.clear;
  Bus.emit(EV.TOAST, { text: `${w.icon} Weather: ${w.name}`, kind: id === 'heatwave' ? 'info' : 'bad' });
}

export function currentWeather() {
  ensureWeather();
  return WEATHER[state.weather.id] || WEATHER.clear;
}

export function weatherId() {
  ensureWeather();
  return state.weather.id;
}

export function weatherGuestMul() { return currentWeather().guestMul; }
export function weatherIncomeMul() { return currentWeather().incomeMul; }
export function weatherCasinoMul() { return currentWeather().casinoMul; }
export function weatherLight() { return currentWeather().light; }

export function weatherTint() {
  const id = weatherId();
  if (id === 'rain') return 0x8fa8c8;
  if (id === 'storm') return 0x59637a;
  if (id === 'snow') return 0xd8e2f0;
  if (id === 'heatwave') return 0xffb060;
  if (id === 'duststorm') return 0xb08a5a;
  return null;
}

export function forceWeather(id, ms) {
  ensureWeather();
  state.weather = { id, remaining: ms || 20000 };
}
