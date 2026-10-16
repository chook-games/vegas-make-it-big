import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { RANDOM_EVENT_INTERVAL_MS } from '../core/constants.js';
import { pickRandomEvent, RANDOM_EVENTS } from '../data/randomEvents.js';

let eventTimer = 0;

function isDisaster(def) {
  const e = def.effects || {};
  return (e.incomeMul != null && e.incomeMul < 1) || (e.guestMul != null && e.guestMul < 1);
}

export function startEvent(def) {
  state.event = {
    id: def.id,
    name: def.name,
    icon: def.icon,
    desc: def.desc,
    effects: def.effects,
    remaining: def.durationMs
  };
  playSound();
  Bus.emit(EV.EVENT_ACTIVE, state.event);
  Bus.emit(EV.TOAST, { text: `${def.icon} ${def.name}: ${def.desc}`, kind: 'info' });
}

function playSound() {
  Bus.emit('sfx', 'quest');
}

function pickFiltered(excludeId) {
  const disasters = state.disastersFreq;
  const pool = RANDOM_EVENTS.filter(e => e.id !== excludeId && (!isDisaster(e) || Math.random() < disasters));
  if (!pool.length) return pickRandomEvent(excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function updateEvents(dtMs) {
  const freq = state.eventsFreq;
  if (state.event) {
    state.event.remaining -= dtMs;
    if (state.event.remaining <= 0) {
      state.event = null;
      Bus.emit(EV.EVENT_ACTIVE, null);
    }
  }

  if (!freq) return;

  eventTimer += dtMs * freq;
  if (eventTimer >= RANDOM_EVENT_INTERVAL_MS) {
    eventTimer = 0;
    if (!state.event && Math.random() < 0.7) {
      startEvent(pickFiltered(state.event ? state.event.id : null));
    }
  }
}
