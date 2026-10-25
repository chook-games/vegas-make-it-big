import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { save } from '../core/save.js';
import { playSound } from '../audio/audio.js';

let pending = null;
let onDone = null;

export function startLotTutorial(price, done) {
  pending = { price };
  onDone = done || null;
  state.dockMode = 'lot';
  Bus.emit(EV.UI_REFRESH);
}

export function pendingLotPrice() {
  return pending ? pending.price : 0;
}

export function buyPendingLot() {
  if (!pending) return false;
  if (state.cash < pending.price) {
    playSound('error');
    Bus.emit(EV.TOAST, { text: 'Not enough cash to buy this Lot.', kind: 'bad' });
    return false;
  }
  state.cash -= pending.price;
  const done = onDone;
  pending = null;
  onDone = null;
  playSound('confirm');
  Bus.emit(EV.CASH_CHANGED);
  Bus.emit(EV.UI_REFRESH);
  save();
  if (done) done();
  return true;
}

export function cancelPendingLot() {
  pending = null;
  onDone = null;
  Bus.emit(EV.UI_REFRESH);
}
