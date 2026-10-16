import { state, activeLot } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { MOVE_ROTATE_COST } from '../core/constants.js';
import { CATALOG, findItem, isUnlocked } from '../data/buildings.js';
import { effSize } from '../data/sizes.js';
import { exteriorGroup, interiorGroup, pickableTilesExt, pickableTilesInt } from '../three/scene.js';
import { createBuildingMesh } from '../three/meshes.js';
import { screenRay } from '../three/controls.js';
import { spawnFloatingText } from '../ui/toast.js';
import { playSound, vibrate } from '../audio/audio.js';
import { addXP } from './leveling.js';
import { XP, xpForCost } from '../data/levels.js';
import { markLotDirty, currentTheme } from './lots.js';
import { getOccupancy, getUpperOccupancy, upperSupport } from './paths.js';
import { isGambling, defaultBetIndex } from '../data/betting.js';
import { t } from '../i18n/i18n.js';

export const FLOOR_H = 1.15;

function groupFor(world) {
  return world === 'exterior' ? exteriorGroup : interiorGroup;
}
function radius() {
  return Math.floor(state.gridSize / 2);
}
function yFor(layer) {
  return 0.08 + (layer ? FLOOR_H : 0);
}
function gridForLayer(world, layer) {
  if (world === 'exterior') return state.exteriorGrid;
  return layer ? state.interiorUpperGrid : state.interiorGrid;
}
function occFor(world, layer) {
  const lot = activeLot();
  if (world === 'exterior') return getOccupancy(lot, 'exterior');
  return layer ? getUpperOccupancy(lot) : getOccupancy(lot, 'interior');
}
function centerPos(cx, cz) {
  const ts = state.tileSize;
  return { x: cx * ts, z: cz * ts };
}
function footprintFree(grid, occ, support, ox, oz, w, h) {
  const r = radius();
  for (let dx = 0; dx < w; dx++) {
    for (let dz = 0; dz < h; dz++) {
      const gx = ox + dx, gz = oz + dz;
      if (Math.abs(gx) > r || Math.abs(gz) > r) return false;
      const k = `${gx},${gz}`;
      if (occ.has(k)) return false;
      if (support && !support.has(k)) return false;
    }
  }
  return true;
}
function supportFor(layer) {
  return layer ? upperSupport(activeLot()) : null;
}

function setGhostColor(p, valid) {
  const outline = p.mesh && p.mesh.userData && p.mesh.userData.outline;
  if (outline && outline.material) outline.material.color.setHex(valid ? 0x00f5d4 : 0xff4d4d);
}

function validateGhost(p) {
  const grid = gridForLayer(p.world, p.layer);
  const occ = occFor(p.world, p.layer);
  const cur = grid[p.originKey];
  if (cur && (!p.originalData || cur !== p.originalData)) {
    setGhostColor(p, false);
    return false;
  }
  const valid = footprintFree(grid, occ, supportFor(p.layer), p.ox, p.oz, p.w, p.h);
  setGhostColor(p, valid);
  return valid;
}

function applyCellParams(cell, world, item) {
  if (isGambling(world, item.id)) {
    cell.edge = state.houseEdge;
    cell.betIndex = defaultBetIndex(item.tier);
  }
}

export function startPendingPlacement(tileMesh, item, mode = 'new', existingData = null, silent = false) {
  Bus.emit(EV.INSPECTOR_CLOSE);
  const world = existingData ? existingData.world : tileMesh.userData.world;
  const layer = existingData ? (existingData.layer || 0)
    : (world === 'interior' ? (state.interiorLayer === 1 ? 1 : 0) : 0);

  if (state.pendingPlacement) {
    const p = state.pendingPlacement;
    if (tileMesh && tileMesh.userData && p.layer === layer) {
      moveGhostTo(p, tileMesh.userData.gx, tileMesh.userData.gz);
    }
    if (!silent) playSound('preview');
    updatePlacementUI();
    return;
  }

  const rotation = existingData ? existingData.rotation : 0;
  const level = existingData ? existingData.level : 1;
  const cost = existingData ? MOVE_ROTATE_COST : item.cost;

  const hover = tileMesh && tileMesh.userData ? tileMesh.userData : { gx: 0, gz: 0 };
  let cgx, cgz;
  if (existingData && existingData.cx != null) { cgx = existingData.cx; cgz = existingData.cz; }
  else { cgx = hover.gx; cgz = hover.gz; }

  const [w, h] = effSize(item.id, rotation);
  const ox = Math.round(cgx - Math.floor((w - 1) / 2));
  const oz = Math.round(cgz - Math.floor((h - 1) / 2));
  const cx = ox + (w - 1) / 2;
  const cz = oz + (h - 1) / 2;

  const ghost = createBuildingMesh(item, level, true, { theme: currentTheme(), footprint: { w, h, ts: state.tileSize }, elevated: layer });
  const pos = centerPos(cx, cz);
  ghost.position.set(pos.x, yFor(layer), pos.z);
  ghost.rotation.y = rotation * (Math.PI / 2);
  groupFor(world).add(ghost);

  state.pendingPlacement = {
    mode, item, world, layer,
    rotation, level, cost,
    cgx, cgz, ox, oz, w, h, cx, cz,
    originKey: `${ox},${oz}`,
    mesh: ghost, originalData: existingData
  };

  validateGhost(state.pendingPlacement);
  if (!silent) playSound('preview');
  updatePlacementUI();
}

function moveGhostTo(p, cgx, cgz) {
  const [w, h] = effSize(p.item.id, p.rotation);
  const ox = Math.round(cgx - Math.floor((w - 1) / 2));
  const oz = Math.round(cgz - Math.floor((h - 1) / 2));
  p.w = w; p.h = h; p.ox = ox; p.oz = oz;
  p.cx = ox + (w - 1) / 2;
  p.cz = oz + (h - 1) / 2;
  p.originKey = `${ox},${oz}`;
  const pos = centerPos(p.cx, p.cz);
  p.mesh.position.set(pos.x, yFor(p.layer), pos.z);
  validateGhost(p);
}

export function updatePlacementUI() {
  const bar = document.getElementById('placement-bar');
  if (!state.pendingPlacement) {
    bar.style.display = 'none';
    return;
  }
  const p = state.pendingPlacement;
  bar.style.display = 'flex';
  const floorTag = p.layer ? ' · Upper floor' : '';
  if (p.mode === 'new') {
    document.getElementById('place-title').textContent = `${p.item.icon} ${t(p.item.name)} (${p.w}×${p.h})${floorTag}`;
    document.getElementById('place-sub').textContent = t('Hover/move the tile, R to rotate, click to place');
    document.getElementById('btn-place-confirm').textContent = `Build ($${p.cost})`;
  } else {
    document.getElementById('place-title').textContent = `Move: ${t(p.item.name)}${floorTag}`;
    document.getElementById('place-sub').textContent = t('Move it and confirm');
    document.getElementById('btn-place-confirm').textContent = `Confirm ($${p.cost})`;
  }
}

export function rotatePendingPlacement() {
  if (!state.pendingPlacement) return;
  const p = state.pendingPlacement;
  p.rotation = (p.rotation + 1) % 4;
  p.mesh.rotation.y = p.rotation * (Math.PI / 2);
  moveGhostTo(p, p.cgx, p.cgz);
  playSound('rotate');
  vibrate(12);
}

export function confirmPendingPlacement() {
  if (!state.pendingPlacement) return;
  const p = state.pendingPlacement;
  const grid = gridForLayer(p.world, p.layer);
  const occ = occFor(p.world, p.layer);
  const support = supportFor(p.layer);

  if (!footprintFree(grid, occ, support, p.ox, p.oz, p.w, p.h)) {
    const pos = centerPos(p.cx, p.cz);
    spawnFloatingText(new THREE.Vector3(pos.x, yFor(p.layer), pos.z), p.layer ? 'Needs stairs support!' : 'Blocked!', '#ff4d4d');
    playSound('error');
    return;
  }
  if (state.cash < p.cost) {
    const pos = centerPos(p.cx, p.cz);
    spawnFloatingText(new THREE.Vector3(pos.x, yFor(p.layer), pos.z), 'Not enough cash!', '#ff4d4d');
    playSound('error');
    return;
  }

  state.cash -= p.cost;
  groupFor(p.world).remove(p.mesh);

  const finalMesh = createBuildingMesh(p.item, p.level, false, { theme: currentTheme(), footprint: { w: p.w, h: p.h, ts: state.tileSize }, elevated: p.layer });
  const pos = centerPos(p.cx, p.cz);
  finalMesh.position.set(pos.x, yFor(p.layer), pos.z);
  finalMesh.rotation.y = p.rotation * (Math.PI / 2);
  groupFor(p.world).add(finalMesh);

  const cell = {
    gx: p.ox, gz: p.oz, key: p.originKey, world: p.world, layer: p.layer,
    item: p.item, level: p.level, rotation: p.rotation,
    w: p.w, h: p.h, cx: p.cx, cz: p.cz,
    mesh: finalMesh, tileMesh: null
  };
  applyCellParams(cell, p.world, p.item);
  grid[p.originKey] = cell;

  if (p.mode === 'new') state.stats.buildingsBuilt++;
  markLotDirty();

  addXP(xpForCost(p.cost, p.mode === 'new' ? XP.build : XP.upgrade));

  spawnFloatingText(new THREE.Vector3(pos.x, yFor(p.layer), pos.z), p.mode === 'new' ? `-$${p.cost}` : `Moved (-$${p.cost})`, '#06d6a0');
  playSound('confirm');
  vibrate(20);

  state.pendingPlacement = null;
  const keepTool = p.mode === 'new' && p.item.isPath;
  state.selectedTool = keepTool ? p.item.id : null;
  updatePlacementUI();
  Bus.emit(EV.CASH_CHANGED);
  Bus.emit(EV.BUILDING_PLACED, { world: p.world, item: p.item });
  Bus.emit(EV.UI_REFRESH);
  document.getElementById('ui-hint').innerHTML = keepTool
    ? '⬜ <b>Path placed.</b> Keep placing, or pick another category.'
    : '✅ <b>Placed!</b> Tap a building to Upgrade or Move it.';
}

export function cancelPendingPlacement() {
  if (!state.pendingPlacement) return;
  const p = state.pendingPlacement;
  const grid = gridForLayer(p.world, p.layer);

  groupFor(p.world).remove(p.mesh);

  if (p.mode === 'edit' && p.originalData) {
    const orig = p.originalData;
    const restored = createBuildingMesh(orig.item, orig.level, false, { theme: currentTheme(), footprint: { w: orig.w, h: orig.h, ts: state.tileSize }, elevated: orig.layer || 0 });
    const pos = centerPos(orig.cx, orig.cz);
    restored.position.set(pos.x, yFor(orig.layer || 0), pos.z);
    restored.rotation.y = (orig.rotation || 0) * (Math.PI / 2);
    groupFor(p.world).add(restored);
    grid[orig.key] = Object.assign({}, orig, { mesh: restored });
  }

  playSound('cancel');
  state.pendingPlacement = null;
  updatePlacementUI();
  markLotDirty();
  Bus.emit(EV.UI_REFRESH);
}

export function placeBuildingAt(world, itemId, ox, oz, rotation = 0, layer = 0) {
  const item = findItem(world, itemId);
  if (!item) return;
  const grid = gridForLayer(world, layer);
  const [w, h] = effSize(itemId, rotation);
  const cx = ox + (w - 1) / 2;
  const cz = oz + (h - 1) / 2;
  const mesh = createBuildingMesh(item, 1, false, { theme: currentTheme(), footprint: { w, h, ts: state.tileSize }, elevated: layer });
  const pos = centerPos(cx, cz);
  mesh.position.set(pos.x, yFor(layer), pos.z);
  mesh.rotation.y = rotation * (Math.PI / 2);
  groupFor(world).add(mesh);
  const key = `${ox},${oz}`;
  const cell = { gx: ox, gz: oz, key, world, layer, item, level: 1, rotation, w, h, cx, cz, mesh, tileMesh: null };
  applyCellParams(cell, world, item);
  grid[key] = cell;
}

export function seedStarterResort() {
  placeBuildingAt('exterior', 'casino', -1, 0, 0);
  placeBuildingAt('exterior', 'fountain', -4, 2, 0);
  placeBuildingAt('exterior', 'generator', 3, -3, 0);
  placeBuildingAt('interior', 'slots', -3, 0, 0);
  placeBuildingAt('interior', 'wall', 0, 0, 1);
  placeBuildingAt('interior', 'vip_bj', 2, 2, 0);
  placeBuildingAt('interior', 'stairs', 0, 3, 0);

  const half = radius();
  for (let gz = 4; gz <= half; gz++) {
    placeBuildingAt('exterior', 'path_concrete', 0, gz, 0);
  }
  for (let gz = 4; gz <= half; gz++) {
    placeBuildingAt('exterior', 'path_concrete', -4, gz, 0);
  }
  for (let gz = 4; gz <= half; gz++) {
    placeBuildingAt('exterior', 'path_concrete', -3, gz, 0);
  }
  placeBuildingAt('exterior', 'path_concrete', -2, 3, 0);
  placeBuildingAt('exterior', 'path_concrete', -1, 3, 0);
  placeBuildingAt('exterior', 'path_concrete', 0, 3, 0);

  const th = currentTheme();
  const grid = state.exteriorGrid;
  if (th && th.decor) {
    [[2, 4], [3, 3], [-2, 5]].forEach(([x, z]) => {
      if (Math.abs(x) <= half && Math.abs(z) <= half && !grid[`${x},${z}`]) {
        placeBuildingAt('exterior', th.decor, x, z, 0);
      }
    });
  }
  markLotDirty();
}

export function rebuildBuildingsFromState() {
  const theme = currentTheme();
  const rebuild = (grid, world) => {
    for (const k in grid) {
      const cell = grid[k];
      const layer = cell.layer || 0;
      const w = cell.w || 1, h = cell.h || 1;
      const cx = cell.cx != null ? cell.cx : cell.gx;
      const cz = cell.cz != null ? cell.cz : cell.gz;
      const mesh = createBuildingMesh(cell.item, cell.level, false, { theme, footprint: { w, h, ts: state.tileSize }, elevated: layer });
      const pos = centerPos(cx, cz);
      mesh.position.set(pos.x, yFor(layer), pos.z);
      mesh.rotation.y = (cell.rotation || 0) * (Math.PI / 2);
      groupFor(world).add(mesh);
      cell.mesh = mesh;
      cell.w = w; cell.h = h; cell.cx = cx; cell.cz = cz;
      cell.layer = layer;
      cell.tileMesh = null;
    }
  };
  rebuild(state.exteriorGrid, 'exterior');
  rebuild(state.interiorGrid, 'interior');
  rebuild(state.interiorUpperGrid, 'interior');
  markLotDirty();
}

function resolveCell(world, layer, tileKey) {
  const grid = gridForLayer(world, layer);
  if (grid[tileKey]) return tileKey;
  const occ = occFor(world, layer);
  return occ.get(tileKey) || null;
}

export function handleTileTap(clientX, clientY) {
  const ray = screenRay(clientX, clientY);
  const targets = state.mode === 'exterior' ? pickableTilesExt : pickableTilesInt;
  const hits = ray.intersectObjects(targets, false);
  if (hits.length === 0) return;

  const tile = hits[0].object;
  const { key, world } = tile.userData;
  const layer = (world === 'interior' && state.interiorLayer === 1) ? 1 : 0;
  const originKey = resolveCell(world, layer, key);
  const grid = gridForLayer(world, layer);
  const existing = originKey ? grid[originKey] : null;

  if (state.pendingPlacement) {
    if (!existing) {
      moveGhostTo(state.pendingPlacement, tile.userData.gx, tile.userData.gz);
    } else {
      spawnFloatingText(tile.position, 'Occupied!', '#ff4d4d');
      playSound('error');
    }
    return;
  }

  if (existing) {
    Bus.emit(EV.INSPECTOR_OPEN, { world, key: originKey, layer });
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

export function hoverPlacement(clientX, clientY) {
  const ray = screenRay(clientX, clientY);
  const targets = state.mode === 'exterior' ? pickableTilesExt : pickableTilesInt;
  const hits = ray.intersectObjects(targets, false);
  if (!hits.length) return;
  const tile = hits[0].object;
  const { key, world } = tile.userData;
  const layer = (world === 'interior' && state.interiorLayer === 1) ? 1 : 0;
  const originKey = resolveCell(world, layer, key);

  if (state.pendingPlacement) {
    if (!originKey && state.pendingPlacement.layer === layer) {
      moveGhostTo(state.pendingPlacement, tile.userData.gx, tile.userData.gz);
    }
    return;
  }
  if (state.selectedTool && !originKey) {
    const item = CATALOG[world].find(x => x.id === state.selectedTool);
    if (item && isUnlocked(item, state)) {
      startPendingPlacement(tile, item, 'new', null, true);
    }
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
