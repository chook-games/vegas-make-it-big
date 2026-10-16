import { state, activeLot, syncActiveGrids } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { applyRadius } from '../three/worlds.js';
import { playSound, vibrate } from '../audio/audio.js';
import { save } from '../core/save.js';
import { markLotDirty } from './lots.js';

export const MAX_RADIUS = 8;
export const MAX_PLOTS = MAX_RADIUS - 3;

export function currentRadius() {
  return activeLot().radius || 5;
}

export function plotCost() {
  return Math.round(6000 * Math.pow(2.4, currentRadius() - 5));
}

export function canExpand() {
  return currentRadius() < MAX_RADIUS;
}

export function buyPlot() {
  if (!canExpand()) {
    Bus.emit(EV.TOAST, { text: 'You reached the maximum size for this lot.', kind: 'info' });
    playSound('error');
    return false;
  }
  const cost = plotCost();
  if (state.cash < cost) {
    Bus.emit(EV.TOAST, { text: `You need $${cost.toLocaleString()}!`, kind: 'bad' });
    playSound('error');
    return false;
  }
  state.cash -= cost;
  const lot = activeLot();
  lot.radius = currentRadius() + 1;
  state.plots += 1;
  syncActiveGrids();
  applyRadius(lot.radius);
  markLotDirty(lot);
  playSound('levelup');
  vibrate(30);
  Bus.emit(EV.TOAST, { text: `🗺️ Lot expanded! New size ${lot.radius * 2 + 1}×${lot.radius * 2 + 1}.`, kind: 'good' });
  Bus.emit(EV.UI_REFRESH);
  Bus.emit(EV.CASH_CHANGED);
  save();
  return true;
}
