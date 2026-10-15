import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { PRESTIGE_BASE_GOAL, START_CASH, START_REPUTATION } from '../core/constants.js';
import { exteriorGroup, interiorGroup } from '../three/scene.js';
import { seedStarterResort, updatePlacementUI } from './placement.js';
import { clearWalkers } from './guests.js';
import { save } from '../core/save.js';
import { playSound, vibrate } from '../audio/audio.js';

export function prestigeGoal() {
  return Math.round(PRESTIGE_BASE_GOAL * Math.pow(1.8, state.prestigeLevel));
}

export function canPrestige() {
  return state.cash >= prestigeGoal();
}

export function previewPoints() {
  return Math.max(1, Math.floor(Math.sqrt(state.cash / 1000)));
}

function clearAllBuildings() {
  Object.values(state.exteriorGrid).forEach(c => exteriorGroup.remove(c.mesh));
  Object.values(state.interiorGrid).forEach(c => interiorGroup.remove(c.mesh));
  state.exteriorGrid = {};
  state.interiorGrid = {};
  clearWalkers();
  state.pendingPlacement = null;
  Bus.emit(EV.INSPECTOR_CLOSE);
  updatePlacementUI();
}

export function doPrestige() {
  if (!canPrestige()) return false;
  const pts = previewPoints();
  state.prestigePoints += pts;
  state.prestigeLevel += 1;
  state.cash = START_CASH;
  state.reputation = START_REPUTATION;
  state.happiness = 70;
  state.selectedTool = null;
  state.pendingPlacement = null;
  state.stats.prestiges += 1;

  clearAllBuildings();
  seedStarterResort();

  playSound('achievement');
  vibrate([20, 40, 20]);
  Bus.emit(EV.TOAST, { text: `💎 Prestige ${state.prestigeLevel}! +${pts} πόντοι. Μόνιμο bonus +${state.prestigeLevel * 15}%`, kind: 'good' });
  Bus.emit(EV.UI_REFRESH);
  save();
  return true;
}
