import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { RANDOM_EVENT_INTERVAL_MS } from '../core/constants.js';
import { pickRandomEvent } from '../data/randomEvents.js';

let eventTimer = 0;

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

export function updateEvents(dtMs) {
  if (state.event) {
    state.event.remaining -= dtMs;
    if (state.event.remaining <= 0) {
      state.event = null;
      Bus.emit(EV.EVENT_ACTIVE, null);
    }
  }

  eventTimer += dtMs;
  if (eventTimer >= RANDOM_EVENT_INTERVAL_MS) {
    eventTimer = 0;
    if (!state.event && Math.random() < 0.7) {
      const def = pickRandomEvent(state.event ? state.event.id : null);
      startEvent(def);
    }
  }
}
