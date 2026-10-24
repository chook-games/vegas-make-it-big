import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { SCENARIOS } from '../data/campaign.js';
import { SCENARIO_EVENTS } from '../data/scenarioEvents.js';
import { forceWeather } from './weather.js';
import { startEvent } from './randomEvents.js';
import { triggerLightning } from '../three/particles.js';
import { spawnSpecialGuest } from './guests.js';

export function checkScenarioEvents() {
  if (state.gameMode !== 'campaign') return;
  const sc = SCENARIOS[state.campaignIndex];
  if (!sc) return;
  if (!state.scenarioEventsDone) state.scenarioEventsDone = {};

  const list = SCENARIO_EVENTS[sc.id] || [];
  for (const ev of list) {
    const key = `${sc.id}:${ev.day}:${ev.kind}`;
    if (state.scenarioEventsDone[key]) continue;
    if (state.clock.day >= ev.day) {
      state.scenarioEventsDone[key] = true;
      fire(ev);
    }
  }
}

function fire(ev) {
  if (ev.kind === 'duststorm') {
    forceWeather('duststorm', 24000);
    Bus.emit(EV.TOAST, { text: `${ev.icon} ${ev.name}: ${ev.desc}`, kind: 'bad' });
  } else if (ev.kind === 'highrollers') {
    state.highrollerBoostDay = state.clock.day + 1;
    startEvent({ id: 'ev_highroller', name: ev.name, icon: ev.icon, desc: ev.desc, effects: { incomeMul: 1.5 }, durationMs: 24000 });
  } else if (ev.kind === 'lightning') {
    triggerLightning();
    state.condition = Math.max(0, state.condition - 10);
    Bus.emit(EV.TOAST, { text: `${ev.icon} ${ev.name}: ${ev.desc}`, kind: 'bad' });
  } else if (ev.kind === 'guests') {
    startEvent({ id: 'ev_convention', name: ev.name, icon: ev.icon, desc: ev.desc, effects: { guestMul: 1.4 }, durationMs: 24000 });
  } else if (ev.kind === 'whale') {
    for (let i = 0; i < 2; i++) spawnSpecialGuest('whale', 'interior');
    Bus.emit(EV.TOAST, { text: `${ev.icon} ${ev.name}: ${ev.desc}`, kind: 'good' });
  } else if (ev.kind === 'celeb') {
    spawnSpecialGuest('celebrity', 'interior');
    spawnSpecialGuest('business', 'interior');
    Bus.emit(EV.TOAST, { text: `${ev.icon} ${ev.name}: ${ev.desc}`, kind: 'good' });
  }
}
