import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { MOVE_ROTATE_COST } from '../core/constants.js';
import { CATALOG, findItem, isUnlocked } from '../data/buildings.js';
import { exteriorGroup, interiorGroup, pickableTilesExt, pickableTilesInt } from '../three/scene.js';
import { createBuildingMesh } from '../three/meshes.js';
import { findTile } from '../three/worlds.js';
import { screenRay } from '../three/controls.js';
import { spawnFloatingText } from '../ui/toast.js';
import { playSound, vibrate } from '../audio/audio.js';
import { addXP } from './leveling.js';
import { XP, xpForCost } from '../data/levels.js';
import { markLotDirty, currentTheme } from './lots.js';
import { t } from '../i18n/i18n.js';

function groupFor(world) {
  return world === 'exterior' ? exteriorGroup : interiorGroup;
}
function gridFor(world) {
  return world === 'exterior' ? state.exteriorGrid : state.interiorGrid;
}

export function startPendingPlacement(tileMesh, item, mode = 'new', existingData = null) {
  Bus.emit(EV.INSPECTOR_CLOSE);

  const { gx, gz, key, world } = tileMesh.userData;

  if (state.pendingPlacement) {
    state.pendingPlacement.gx = gx;
    state.pendingPlacement.gz = gz;
    state.pendingPlacement.key = key;
    state.pendingPlacement.tileMesh = tileMesh;
    state.pendingPlacement.mesh.position.copy(tileMesh.position);
    state.pendingPlacement.mesh.position.y = 0.08;
    playSound('preview');
    return;
  }

  const rotation = existingData ? existingData.rotation : 0;
  const level = existingData ? existingData.level : 1;
  const cost = existingData ? MOVE_ROTATE_COST : item.cost;

  const ghost = createBuildingMesh(item, level, true);
  ghost.position.copy(tileMesh.position);
  ghost.position.y = 0.08;
  ghost.rotation.y = rotation * (Math.PI / 2);
  groupFor(world).add(ghost);

  state.pendingPlacement = {
    mode, item, gx, gz, key, world, tileMesh,
    rotation, level, cost, mesh: ghost, originalData: existingData
  };

  playSound('preview');
  updatePlacementUI();
}

export function updatePlacementUI() {
  const bar = document.getElementById('placement-bar');
  if (!state.pendingPlacement) {
    bar.style.display = 'none';
    return;
  }
  const p = state.pendingPlacement;
  bar.style.display = 'flex';
  if (p.mode === 'new') {
    document.getElementById('place-title').textContent = `${p.item.icon} ${t(p.item.name)}`;
    document.getElementById('place-sub').textContent = t('Tap another tile to move, or Rotate');
    document.getElementById('btn-place-confirm').textContent = `Build ($${p.cost})`;
  } else {
    document.getElementById('place-title').textContent = `Move: ${t(p.item.name)}`;
    document.getElementById('place-sub').textContent = t('Tap an empty tile or rotate it');
    document.getElementById('btn-place-confirm').textContent = `Confirm ($${p.cost})`;
  }
}

export function rotatePendingPlacement() {
  if (!state.pendingPlacement) return;
  const p = state.pendingPlacement;
  p.rotation = (p.rotation + 1) % 4;
  p.mesh.rotation.y = p.rotation * (Math.PI / 2);
  playSound('rotate');
  vibrate(12);
}

export function confirmPendingPlacement() {
  if (!state.pendingPlacement) return;
  const p = state.pendingPlacement;
  const grid = gridFor(p.world);

  if (state.cash < p.cost) {
    spawnFloatingText(p.tileMesh.position, 'Not enough cash!', '#ff4d4d');
    playSound('error');
    return;
  }

  state.cash -= p.cost;

  groupFor(p.world).remove(p.mesh);
  const finalMesh = createBuildingMesh(p.item, p.level, false, { theme: currentTheme() });
  finalMesh.position.copy(p.tileMesh.position);
  finalMesh.position.y = 0.08;
  finalMesh.rotation.y = p.rotation * (Math.PI / 2);
  groupFor(p.world).add(finalMesh);

  grid[p.key] = {
    gx: p.gx, gz: p.gz, key: p.key, world: p.world,
    item: p.item, level: p.level, rotation: p.rotation,
    mesh: finalMesh, tileMesh: p.tileMesh
  };

  if (p.mode === 'new') state.stats.buildingsBuilt++;
  markLotDirty();

  addXP(xpForCost(p.cost, p.mode === 'new' ? XP.build : XP.upgrade));

  spawnFloatingText(p.tileMesh.position, p.mode === 'new' ? `-$${p.cost}` : `Moved (-$${p.cost})`, '#06d6a0');
  playSound('confirm');
  vibrate(20);

  state.pendingPlacement = null;
  state.selectedTool = null;
  updatePlacementUI();
  Bus.emit(EV.CASH_CHANGED);
  Bus.emit(EV.BUILDING_PLACED, { world: p.world, item: p.item });
  Bus.emit(EV.UI_REFRESH);
  document.getElementById('ui-hint').innerHTML = '✅ <b>Placed!</b> Tap a building to Upgrade or Move it.';
}

export function cancelPendingPlacement() {
  if (!state.pendingPlacement) return;
  const p = state.pendingPlacement;
  const grid = gridFor(p.world);

  groupFor(p.world).remove(p.mesh);

  if (p.mode === 'edit' && p.originalData) {
    const orig = p.originalData;
    const restored = createBuildingMesh(orig.item, orig.level, false, { theme: currentTheme() });
    restored.position.copy(orig.tileMesh.position);
    restored.position.y = 0.08;
    restored.rotation.y = orig.rotation * (Math.PI / 2);
    groupFor(p.world).add(restored);
    grid[orig.key] = Object.assign({}, orig, { mesh: restored });
  }

  playSound('cancel');
  state.pendingPlacement = null;
  updatePlacementUI();
  markLotDirty();
  Bus.emit(EV.UI_REFRESH);
}

export function placeStarterBuilding(tileMesh, itemId, rotation = 0) {
  const { gx, gz, key, world } = tileMesh.userData;
  const grid = gridFor(world);
  const item = findItem(world, itemId);
  if (!item) return;

  const mesh = createBuildingMesh(item, 1, false, { theme: currentTheme() });
  mesh.position.copy(tileMesh.position);
  mesh.position.y = 0.08;
  mesh.rotation.y = rotation * (Math.PI / 2);
  groupFor(world).add(mesh);
  grid[key] = { gx, gz, key, world, item, level: 1, rotation, mesh, tileMesh };
}

export function seedStarterResort() {
  placeStarterBuilding(findTile(pickableTilesExt, 0, 1), 'casino', 0);
  placeStarterBuilding(findTile(pickableTilesExt, -2, 1), 'fountain', 0);
  placeStarterBuilding(findTile(pickableTilesExt, 2, -2), 'generator', 0);
  placeStarterBuilding(findTile(pickableTilesInt, -1, 0), 'slots', 0);
  placeStarterBuilding(findTile(pickableTilesInt, 0, 0), 'wall', 1);
  placeStarterBuilding(findTile(pickableTilesInt, 1, 0), 'vip_bj', 0);
}

export function rebuildBuildingsFromState() {
  const theme = currentTheme();
  const rebuild = (grid, tiles, world) => {
    Object.values(grid).forEach(cell => {
      const tile = findTile(tiles, cell.gx, cell.gz);
      if (!tile) return;
      const mesh = createBuildingMesh(cell.item, cell.level, false, { theme });
      mesh.position.copy(tile.position);
      mesh.position.y = 0.08;
      mesh.rotation.y = (cell.rotation || 0) * (Math.PI / 2);
      groupFor(world).add(mesh);
      cell.mesh = mesh;
      cell.tileMesh = tile;
    });
  };
  rebuild(state.exteriorGrid, pickableTilesExt, 'exterior');
  rebuild(state.interiorGrid, pickableTilesInt, 'interior');
  markLotDirty();
}

export function handleTileTap(clientX, clientY) {
  const ray = screenRay(clientX, clientY);
  const targets = state.mode === 'exterior' ? pickableTilesExt : pickableTilesInt;
  const hits = ray.intersectObjects(targets, false);
  if (hits.length === 0) return;

  const tile = hits[0].object;
  const { key, world } = tile.userData;
  const grid = gridFor(world);
  const existing = grid[key];

  if (state.pendingPlacement) {
    if (!existing) {
      startPendingPlacement(tile, state.pendingPlacement.item, state.pendingPlacement.mode, state.pendingPlacement.originalData);
    } else {
      spawnFloatingText(tile.position, 'Tile is occupied!', '#ff4d4d');
      playSound('error');
    }
    return;
  }

  if (existing) {
    Bus.emit(EV.INSPECTOR_OPEN, { world, key });
    return;
  }

  if (state.selectedTool) {
    const item = CATALOG[world].find(x => x.id === state.selectedTool);
    if (item) {
      if (!isUnlocked(item, state)) {
        spawnFloatingText(tile.position, 'It is locked!', '#ff4d4d');
        playSound('error');
        return;
      }
      startPendingPlacement(tile, item, 'new', null);
    }
  } else {
    Bus.emit(EV.INSPECTOR_CLOSE);
  }
}

export function initPlacement() {
  document.getElementById('btn-place-rotate').addEventListener('click', rotatePendingPlacement);
  document.getElementById('btn-place-confirm').addEventListener('click', confirmPendingPlacement);
  document.getElementById('btn-place-cancel').addEventListener('click', cancelPendingPlacement);

  Bus.on('placement:start', (payload) => {
    startPendingPlacement(payload.tileMesh, payload.item, payload.mode, payload.existingData);
  });
}
