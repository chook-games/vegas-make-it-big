import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { STAFF, WAGE_LEVELS, findStaff, staffUnlocked, staffMax, staffLockLabel } from '../data/staff.js';
import { playSound, vibrate } from '../audio/audio.js';
import { save } from '../core/save.js';

export function countOf(id) {
  return state.staff[id] || 0;
}

export function totalStaff() {
  let n = 0;
  for (const id in state.staff) n += state.staff[id];
  return n;
}

export function totalWages() {
  let w = 0;
  for (const def of STAFF) w += countOf(def.id) * def.wage;
  const level = WAGE_LEVELS[state.staffWageIndex || 1] || WAGE_LEVELS[1];
  return Math.round(w * level.mul);
}

export function hire(id) {
  const def = findStaff(id);
  if (!def) return false;
  if (!staffUnlocked(def, state)) {
    Bus.emit(EV.TOAST, { text: `🔒 Requires ${staffLockLabel(def)}.`, kind: 'bad' });
    playSound('error');
    return false;
  }
  if (countOf(id) >= staffMax(def, state)) {
    Bus.emit(EV.TOAST, { text: 'You reached the max for this role.', kind: 'info' });
    playSound('error');
    return false;
  }
  if (state.cash < def.cost) {
    Bus.emit(EV.TOAST, { text: 'Not enough cash!', kind: 'bad' });
    playSound('error');
    return false;
  }
  state.cash -= def.cost;
  state.staff[id] = countOf(id) + 1;
  playSound('confirm');
  vibrate(18);
  Bus.emit(EV.UI_REFRESH);
  save();
  return true;
}

export function fire(id) {
  const def = findStaff(id);
  if (!def || countOf(id) <= 0) return false;
  state.staff[id] = countOf(id) - 1;
  if (state.staff[id] <= 0) delete state.staff[id];
  playSound('cancel');
  Bus.emit(EV.UI_REFRESH);
  save();
  return true;
}

export function staffEffects() {
  const eff = { incomePct: 0, guestPct: 0, happiness: 0, crime: 0, repair: 0 };
  for (const def of STAFF) {
    const n = countOf(def.id);
    if (!n) continue;
    if (def.effect.incomePct) eff.incomePct += def.effect.incomePct * n;
    if (def.effect.guestPct) eff.guestPct += def.effect.guestPct * n;
    if (def.effect.happiness) eff.happiness += def.effect.happiness * n;
    if (def.effect.crime) eff.crime += def.effect.crime * n;
    if (def.effect.repair) eff.repair += def.effect.repair * n;
  }
  eff.incomePct = Math.min(eff.incomePct, 3.0);
  eff.guestPct = Math.min(eff.guestPct, 2.0);
  eff.happiness = Math.min(eff.happiness, 40);
  eff.crime = Math.min(eff.crime, 0.9);
  eff.repair = Math.min(eff.repair, 40);
  const level = WAGE_LEVELS[state.staffWageIndex || 1] || WAGE_LEVELS[1];
  eff.incomePct *= level.skill;
  return eff;
}
