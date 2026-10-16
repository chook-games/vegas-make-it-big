import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { MOVE_ROTATE_COST } from '../core/constants.js';
import { exteriorGroup, interiorGroup, inspectRing } from '../three/scene.js';
import { createBuildingMesh } from '../three/meshes.js';
import { evaluateTileStats, upgradeCost, sellRefund } from './economy.js';
import { startPendingPlacement } from './placement.js';
import { spawnFloatingText } from '../ui/toast.js';
import { playSound, vibrate } from '../audio/audio.js';
import { addXP } from './leveling.js';
import { XP, xpForCost } from '../data/levels.js';
import { markLotDirty, currentTheme, activeLot, getLotHeat } from './lots.js';
import { getPaths } from './paths.js';
import { t } from '../i18n/i18n.js';

function groupFor(world) {
  return world === 'exterior' ? exteriorGroup : interiorGroup;
}
function gridFor(world) {
  return world === 'exterior' ? state.exteriorGrid : state.interiorGrid;
}

export function openInspector(world, key) {
  if (state.pendingPlacement) return;
  const grid = gridFor(world);
  const cell = grid[key];
  if (!cell) return;

  state.inspectedKey = { world, key };
  const lot = activeLot();
  const heat = getLotHeat(lot)[world];
  const open = cell.item.isPath ? null : getPaths(lot, world).open;
  const stats = evaluateTileStats(world, cell, grid, heat, open);
  const upg = upgradeCost(cell);
  const refund = sellRefund(cell);

  inspectRing.position.set(cell.tileMesh.position.x, 0.12, cell.tileMesh.position.z);
  inspectRing.visible = true;

  document.getElementById('insp-title').textContent = `${cell.item.icon} ${t(cell.item.name)} (Lv.${cell.level})`;
  let html = `<div>${t(cell.item.desc)}</div>`;
  html += `<div style="margin-top:6px; color:#06d6a0; font-weight:700;">Income: $${stats.income} / cycle</div>`;
  if (stats.notes.length) html += `<div style="margin-top:4px; color:#ffd166;">${stats.notes.join('<br>')}</div>`;
  document.getElementById('insp-body').innerHTML = html;
  document.getElementById('insp-upgrade').textContent = `⬆️ Upgrade ($${upg})`;
  document.getElementById('insp-move').textContent = `🔄 Move ($${MOVE_ROTATE_COST})`;
  document.getElementById('insp-sell').textContent = `🗑️ Sell (+$${refund})`;
  document.getElementById('inspector').style.display = 'block';
}

export function closeInspector() {
  document.getElementById('inspector').style.display = 'none';
  inspectRing.visible = false;
  state.inspectedKey = null;
}

function onUpgrade() {
  if (!state.inspectedKey) return;
  const { world, key } = state.inspectedKey;
  const grid = gridFor(world);
  const cell = grid[key];
  if (!cell) return;

  const cost = upgradeCost(cell);
  if (state.cash < cost) {
    spawnFloatingText(cell.mesh.position, 'Not enough cash!', '#ff4d4d');
    playSound('error');
    return;
  }

  state.cash -= cost;
  cell.level += 1;
  groupFor(world).remove(cell.mesh);
  cell.mesh = createBuildingMesh(cell.item, cell.level, false, { theme: currentTheme() });
  cell.mesh.position.copy(cell.tileMesh.position);
  cell.mesh.position.y = 0.08;
  cell.mesh.rotation.y = (cell.rotation || 0) * (Math.PI / 2);
  groupFor(world).add(cell.mesh);
  markLotDirty();

  playSound('levelup');
  vibrate(25);
  addXP(xpForCost(cost, XP.upgrade));
  spawnFloatingText(cell.mesh.position, `Level ${cell.level}!`, '#00f5d4');
  openInspector(world, key);
  Bus.emit(EV.CASH_CHANGED);
  Bus.emit(EV.UI_REFRESH);
}

function onMove() {
  if (!state.inspectedKey) return;
  const { world, key } = state.inspectedKey;
  const grid = gridFor(world);
  const cell = grid[key];
  if (!cell) return;

  if (state.cash < MOVE_ROTATE_COST) {
    spawnFloatingText(cell.mesh.position, `You need $${MOVE_ROTATE_COST}!`, '#ff4d4d');
    playSound('error');
    return;
  }

  const snapshot = Object.assign({}, cell);
  groupFor(world).remove(cell.mesh);
  delete grid[key];
  closeInspector();
  startPendingPlacement(snapshot.tileMesh, snapshot.item, 'edit', snapshot);
}

function onSell() {
  if (!state.inspectedKey) return;
  const { world, key } = state.inspectedKey;
  const grid = gridFor(world);
  const cell = grid[key];
  if (!cell) return;

  const refund = sellRefund(cell);
  state.cash += refund;
  groupFor(world).remove(cell.mesh);
  delete grid[key];
  markLotDirty();

  playSound('confirm');
  spawnFloatingText(cell.tileMesh.position, `+$${refund}`, '#ffd166');
  closeInspector();
  Bus.emit(EV.CASH_CHANGED);
  Bus.emit(EV.BUILDING_SOLD, { world, item: cell.item });
  Bus.emit(EV.UI_REFRESH);
}

export function initInspector() {
  document.getElementById('insp-close').addEventListener('click', closeInspector);
  document.getElementById('insp-upgrade').addEventListener('click', onUpgrade);
  document.getElementById('insp-move').addEventListener('click', onMove);
  document.getElementById('insp-sell').addEventListener('click', onSell);
  Bus.on(EV.INSPECTOR_OPEN, ({ world, key }) => openInspector(world, key));
  Bus.on(EV.INSPECTOR_CLOSE, () => closeInspector());
}
