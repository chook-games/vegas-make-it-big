import { state, makeLot, syncActiveGrids } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { PRESTIGE_BASE_GOAL, START_CASH, START_REPUTATION } from '../core/constants.js';
import { exteriorGroup, interiorGroup } from '../three/scene.js';
import { applyRadius, applyThemeToTiles } from '../three/worlds.js';
import { themeById } from '../data/themes.js';
import { seedStarterResort, updatePlacementUI, } from './placement.js';
import { clearWalkers } from './guests.js';
import { markLotDirty } from './lots.js';
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
  state.lots.forEach(lot => {
    Object.values(lot.exteriorGrid).forEach(c => { if (c.mesh) exteriorGroup.remove(c.mesh); });
    Object.values(lot.interiorGrid).forEach(c => { if (c.mesh) interiorGroup.remove(c.mesh); });
  });
  const theme = state.lots[0] ? state.lots[0].theme : 'american';
  state.lots = [makeLot(0, theme, 'Lot 1')];
  state.activeLot = 0;
  syncActiveGrids();
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
  state.plots = 0;

  clearAllBuildings();
  const lot = state.lots[0];
  applyRadius(lot.radius || 3);
  applyThemeToTiles(themeById(lot.theme));
  markLotDirty(lot);
  seedStarterResort();

  playSound('achievement');
  vibrate([20, 40, 20]);
  Bus.emit(EV.TOAST, { text: `💎 Prestige ${state.prestigeLevel}! +${pts} πόντοι. Μόνιμο bonus +${state.prestigeLevel * 15}%`, kind: 'good' });
  Bus.emit(EV.UI_REFRESH);
  save();
  return true;
}
