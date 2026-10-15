import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { expandWorld } from '../three/worlds.js';
import { playSound, vibrate } from '../audio/audio.js';
import { save } from '../core/save.js';

export const MAX_PLOTS = 3;

export function nextGridSize() {
  return state.gridSize + 2;
}

export function plotCost() {
  return Math.round(6000 * Math.pow(2.4, state.plots));
}

export function canExpand() {
  return state.plots < MAX_PLOTS;
}

export function buyPlot() {
  if (!canExpand()) {
    Bus.emit(EV.TOAST, { text: 'Έφτασες τη μέγιστη έκταση του Resort.', kind: 'info' });
    playSound('error');
    return false;
  }
  const cost = plotCost();
  if (state.cash < cost) {
    Bus.emit(EV.TOAST, { text: `Χρειάζεσαι $${cost.toLocaleString()}!`, kind: 'bad' });
    playSound('error');
    return false;
  }
  state.cash -= cost;
  state.plots += 1;
  state.gridSize += 2;
  expandWorld();
  playSound('levelup');
  vibrate(30);
  Bus.emit(EV.TOAST, { text: `🗺️ Το Resort επεκτάθηκε! Νέα έκταση ${state.gridSize}×${state.gridSize}.`, kind: 'good' });
  Bus.emit(EV.UI_REFRESH);
  Bus.emit(EV.CASH_CHANGED);
  save();
  return true;
}
