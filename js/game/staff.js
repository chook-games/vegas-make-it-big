import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { STAFF, findStaff, staffUnlocked, staffMax, staffLockLabel } from '../data/staff.js';
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
  return w;
}

export function hire(id) {
  const def = findStaff(id);
  if (!def) return false;
  if (!staffUnlocked(def, state)) {
    Bus.emit(EV.TOAST, { text: `🔒 Απαιτεί ${staffLockLabel(def)}.`, kind: 'bad' });
    playSound('error');
    return false;
  }
  if (countOf(id) >= staffMax(def, state)) {
    Bus.emit(EV.TOAST, { text: 'Έφτασες το μέγιστο για αυτή τη θέση.', kind: 'info' });
    playSound('error');
    return false;
  }
  if (state.cash < def.cost) {
    Bus.emit(EV.TOAST, { text: 'Δεν φτάνουν τα χρήματα!', kind: 'bad' });
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
  const eff = { incomePct: 0, guestPct: 0, happiness: 0, crime: 0 };
  for (const def of STAFF) {
    const n = countOf(def.id);
    if (!n) continue;
    if (def.effect.incomePct) eff.incomePct += def.effect.incomePct * n;
    if (def.effect.guestPct) eff.guestPct += def.effect.guestPct * n;
    if (def.effect.happiness) eff.happiness += def.effect.happiness * n;
    if (def.effect.crime) eff.crime += def.effect.crime * n;
  }
  eff.incomePct = Math.min(eff.incomePct, 3.0);
  eff.guestPct = Math.min(eff.guestPct, 2.0);
  eff.happiness = Math.min(eff.happiness, 40);
  eff.crime = Math.min(eff.crime, 0.9);
  return eff;
}
