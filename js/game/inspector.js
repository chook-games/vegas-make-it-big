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
import { utilOf } from '../data/utilities.js';
import { isGambling, BET_STEPS, betLabel, edgeLabel } from '../data/betting.js';
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
  const open = (world === 'exterior' && !cell.item.isPath) ? getPaths(lot, world).open : null;
  const stats = evaluateTileStats(world, cell, grid, heat, open);
  const upg = upgradeCost(cell);
  const refund = sellRefund(cell);

  inspectRing.position.set(cell.mesh.position.x, 0.12, cell.mesh.position.z);
  inspectRing.visible = true;

  document.getElementById('insp-title').textContent = `${cell.item.icon} ${t(cell.item.name)} (Lv.${cell.level})`;
  const u = utilOf(cell.item.id);
  let html = `<div>${t(cell.item.desc)}</div>`;
  html += `<div style="margin-top:6px; color:#06d6a0; font-weight:700;">Income: $${stats.income} / cycle</div>`;
  const utilParts = [];
  if (u.gp) utilParts.push(`+${u.gp} kW`);
  else if (u.p) utilParts.push(`⚡ ${u.p} kW`);
  if (u.gw) utilParts.push(`+${u.gw} water`);
  else if (u.w) utilParts.push(`💧 ${u.w}`);
  if (utilParts.length) html += `<div style="margin-top:2px; color:#8fd0ff;">${utilParts.join(' · ')}</div>`;
  if (stats.notes.length) html += `<div style="margin-top:4px; color:#ffd166;">${stats.notes.join('<br>')}</div>`;

  const gambling = isGambling(world, cell.item.id);
  if (gambling) {
    const edge = cell.edge != null ? cell.edge : 12;
    const bi = cell.betIndex != null ? cell.betIndex : 0;
    html += `<div class="bet-box">
      <div class="bet-row"><span>Bet Range</span>
        <div class="bet-stepper">
          <button id="insp-bet-dec">−</button>
          <span id="insp-bet">${betLabel(bi)}</span>
          <button id="insp-bet-inc">+</button>
        </div>
      </div>
      <div class="bet-row"><span>House Edge</span><span id="insp-edge" style="color:var(--neon-cyan)">${edge}% · ${edgeLabel(edge)}</span></div>
      <input type="range" class="odds-slider" id="insp-edge-slider" min="4" max="28" value="${edge}">
    </div>`;
  }

  document.getElementById('insp-body').innerHTML = html;
  document.getElementById('insp-upgrade').textContent = `⬆️ Upgrade ($${upg})`;
  document.getElementById('insp-move').textContent = `🔄 Move ($${MOVE_ROTATE_COST})`;
  document.getElementById('insp-sell').textContent = `🗑️ Sell (+$${refund})`;
  document.getElementById('inspector').style.display = 'block';

  if (gambling) {
    const dec = document.getElementById('insp-bet-dec');
    const inc = document.getElementById('insp-bet-inc');
    const slider = document.getElementById('insp-edge-slider');
    if (dec) dec.addEventListener('click', () => {
      cell.betIndex = Math.max(0, (cell.betIndex || 0) - 1);
      markLotDirty(); playSound('rotate'); openInspector(world, key); Bus.emit(EV.UI_REFRESH);
    });
    if (inc) inc.addEventListener('click', () => {
      cell.betIndex = Math.min(BET_STEPS.length - 1, (cell.betIndex || 0) + 1);
      markLotDirty(); playSound('rotate'); openInspector(world, key); Bus.emit(EV.UI_REFRESH);
    });
    if (slider) slider.addEventListener('input', (e) => {
      cell.edge = parseInt(e.target.value, 10);
      const el = document.getElementById('insp-edge');
      if (el) el.textContent = `${cell.edge}% · ${edgeLabel(cell.edge)}`;
      markLotDirty();
      Bus.emit(EV.UI_REFRESH);
    });
  }
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
  state.stats.upgrades = (state.stats.upgrades || 0) + 1;
  groupFor(world).remove(cell.mesh);
  const w = cell.w || 1, h = cell.h || 1;
  const cx = cell.cx != null ? cell.cx : cell.gx;
  const cz = cell.cz != null ? cell.cz : cell.gz;
  cell.mesh = createBuildingMesh(cell.item, cell.level, false, { theme: currentTheme(), footprint: { w, h, ts: state.tileSize } });
  cell.mesh.position.set(cx * state.tileSize, 0.08, cz * state.tileSize);
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
  spawnFloatingText(cell.mesh.position, `+$${refund}`, '#ffd166');
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
