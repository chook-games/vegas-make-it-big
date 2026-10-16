import { state, syncActiveGrids, makeLot } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { exteriorGroup, interiorGroup, pickableTilesExt, pickableTilesInt } from '../three/scene.js';
import { createBuildingMesh } from '../three/meshes.js';
import { applyRadius, applyThemeToTiles, findTile } from '../three/worlds.js';
import { themeById } from '../data/themes.js';
import { save } from '../core/save.js';
import { invalidateHeat, computeLotHeatmap } from './noise.js';
import { invalidatePaths } from './paths.js';
import { playSound, vibrate } from '../audio/audio.js';
import { focusOn } from '../three/controls.js';

export function activeLot() {
  return state.lots[state.activeLot];
}

export function maxLots() {
  return 8;
}

export function canBuyLot() {
  return state.lots.length < maxLots();
}

export function lotCost() {
  return Math.round(12000 * Math.pow(2.6, state.lots.length));
}

export function markLotDirty(lot) {
  const l = lot || activeLot();
  invalidateHeat(l);
  invalidatePaths(l);
}

export function currentTheme() {
  return themeById(activeLot().theme);
}

export function getLotHeat(lot) {
  const l = lot || activeLot();
  if (!l.__heat) l.__heat = computeLotHeatmap(l);
  return l.__heat;
}

function clearMeshes(lot) {
  ['exterior', 'interior'].forEach(world => {
    const grid = world === 'exterior' ? lot.exteriorGrid : lot.interiorGrid;
    const group = world === 'exterior' ? exteriorGroup : interiorGroup;
    for (const k in grid) {
      if (grid[k].mesh) group.remove(grid[k].mesh);
      grid[k].mesh = null;
      grid[k].tileMesh = null;
    }
  });
}

function buildMeshes(lot) {
  const theme = themeById(lot.theme);
  ['exterior', 'interior'].forEach(world => {
    const grid = world === 'exterior' ? lot.exteriorGrid : lot.interiorGrid;
    const group = world === 'exterior' ? exteriorGroup : interiorGroup;
    const tiles = world === 'exterior' ? pickableTilesExt : pickableTilesInt;
    for (const k in grid) {
      const cell = grid[k];
      const tile = findTile(tiles, cell.gx, cell.gz);
      if (!tile) continue;
      const mesh = createBuildingMesh(cell.item, cell.level, false, { theme });
      mesh.position.copy(tile.position);
      mesh.position.y = 0.08;
      mesh.rotation.y = (cell.rotation || 0) * (Math.PI / 2);
      group.add(mesh);
      cell.mesh = mesh;
      cell.tileMesh = tile;
    }
  });
}

export function switchLot(index, force = false) {
  if (index < 0 || index >= state.lots.length) return;
  if (index === state.activeLot && !force) return;
  const cur = state.lots[state.activeLot];
  if (cur) clearMeshes(cur);

  state.activeLot = index;
  syncActiveGrids();
  const lot = state.lots[index];

  applyRadius(lot.radius || 5);
  applyThemeToTiles(themeById(lot.theme));
  buildMeshes(lot);

  state.pendingPlacement = null;
  state.selectedTool = null;
  Bus.emit(EV.INSPECTOR_CLOSE);
  Bus.emit('lot:switch', lot);
  Bus.emit(EV.UI_REFRESH);
  focusOn(0, 0);
  playSound('preview');
  save();
}

export function buyLot(themeId) {
  if (!canBuyLot()) {
    Bus.emit(EV.TOAST, { text: 'You reached the maximum number of lots.', kind: 'info' });
    playSound('error');
    return false;
  }
  const cost = lotCost();
  if (state.cash < cost) {
    Bus.emit(EV.TOAST, { text: `You need $${cost.toLocaleString()}!`, kind: 'bad' });
    playSound('error');
    return false;
  }
  state.cash -= cost;
  const id = state.lots.length;
  const lot = makeLot(id, themeId || 'american', `Lot ${id + 1}`);
  state.lots.push(lot);
  playSound('levelup');
  vibrate(30);
  Bus.emit(EV.TOAST, { text: `🏗️ Bought a new lot with the ${themeById(lot.theme).name} theme!`, kind: 'good' });
  switchLot(id);
  Bus.emit(EV.CASH_CHANGED);
  return true;
}

export function rebuildActiveLot() {
  const lot = state.lots[state.activeLot];
  buildMeshes(lot);
}

export function registerNewBuilding(cell, world) {
  const lot = state.lots[state.activeLot];
  markLotDirty(lot);
  return lot;
}
