import { state } from '../core/state.js';
import { exteriorGroup } from './scene.js';
import { themeById } from '../data/themes.js';

const SPACING = 30;
const cityGroup = new THREE.Group();
exteriorGroup.add(cityGroup);

export const cityInteractives = [];

const matCache = {};
function mat(color, opts) {
  const key = color + '|' + (opts ? JSON.stringify(opts) : '');
  if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.75 }, opts || {}));
  return matCache[key];
}

function box(w, h, d, color, opts) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts));
}

const themeColorCache = {};
function themeColors(theme) {
  if (!themeColorCache[theme.id]) {
    themeColorCache[theme.id] = {
      ground: theme.groundB,
      shell: theme.shell,
      accent: theme.accent,
      roof: theme.roof
    };
  }
  return themeColorCache[theme.id];
}

function lotSlab(size, theme, borderColor) {
  const g = new THREE.Group();
  const slab = box(size, 0.12, size, theme ? theme.ground : 0x2b3b4a);
  slab.position.y = -0.02;
  g.add(slab);
  const t = 0.35;
  const half = size / 2;
  const edge = theme ? theme.accent : 0x22c55e;
  const b1 = box(size, 0.16, 0.28, edge); b1.position.set(0, 0.08, half); g.add(b1);
  const b2 = box(size, 0.16, 0.28, edge); b2.position.set(0, 0.08, -half); g.add(b2);
  const b3 = box(0.28, 0.16, size, edge); b3.position.set(half, 0.08, 0); g.add(b3);
  const b4 = box(0.28, 0.16, size, edge); b4.position.set(-half, 0.08, 0); g.add(b4);
  return g;
}

function simpleBuilding(item, level, theme) {
  const tier = item.tier || 1;
  const h = 0.8 + tier * 0.55 + (level - 1) * 0.28;
  const color = (tier % 2 === 0) ? theme.shell : theme.accent;
  const m = box(1.7, h, 1.5, color);
  m.position.y = h / 2;
  const roof = box(1.85, 0.14, 1.65, theme.roof);
  roof.position.y = h + 0.05;
  const g = new THREE.Group();
  g.add(m, roof);
  return g;
}

function addLotBuildings(group, lot, ts) {
  const theme = themeColors(themeById(lot.theme));
  const grids = [lot.exteriorGrid, lot.interiorGrid, lot.interiorUpperGrid || {}];
  for (const grid of grids) {
    for (const k in grid) {
      const cell = grid[k];
      if (cell.item.isPath) continue;
      const cx = cell.cx != null ? cell.cx : cell.gx;
      const cz = cell.cz != null ? cell.cz : cell.gz;
      const m = simpleBuilding(cell.item, cell.level, theme);
      m.position.set(cx * ts, 0, cz * ts);
      group.add(m);
    }
  }
}

function addRivalLot(group, npc, r, slot, size) {
  const color = parseColor(npc.color, 0x99aabb);
  const g = new THREE.Group();
  g.position.x = slot * SPACING;
  const slab = box(size, 0.12, size, 0x263238);
  slab.position.y = -0.02;
  g.add(slab);
  const count = Math.min(12, Math.max(2, npc.buildings || 3));
  for (let i = 0; i < count; i++) {
    const gx = ((i % 3) - 1) * (size / 4);
    const gz = ((Math.floor(i / 3) % 3) - 1) * (size / 4);
    const h = 1.2 + (i % 4) * 0.9;
    const b = box(2.0, h, 1.8, color);
    b.position.set(gx, h / 2, gz);
    g.add(b);
    const roof = box(2.15, 0.14, 1.95, 0xffd166);
    roof.position.set(gx, h + 0.05, gz);
    g.add(roof);
  }
  cityGroup.add(g);
}

function parseColor(hex, fallback) {
  if (typeof hex === 'number') return hex;
  if (typeof hex === 'string') {
    const s = hex.replace('#', '');
    const n = parseInt(s, 16);
    return isNaN(n) ? fallback : n;
  }
  return fallback;
}

export function rebuildCity() {
  while (cityGroup.children.length) cityGroup.remove(cityGroup.children[0]);
  cityInteractives.length = 0;

  const ts = state.tileSize;
  const size = state.gridSize * ts * 0.95;
  const active = state.activeLot;
  const lots = state.lots || [];

  lots.forEach((lot, i) => {
    if (i === active) return;
    const th = themeColors(themeById(lot.theme));
    const g = lotSlab(size, th);
    g.position.x = (i - active) * SPACING;
    addLotBuildings(g, lot, ts);
    cityGroup.add(g);

    const hit = box(size, 1.4, size, th.accent, { transparent: true, opacity: 0.001 });
    hit.position.set((i - active) * SPACING, 0.7, 0);
    hit.userData = { kind: 'lot', index: i };
    cityGroup.add(hit);
    cityInteractives.push(hit);
  });

  const npcs = state.npcs || [];
  npcs.forEach((npc, r) => {
    const slot = -1 - r;
    addRivalLot(cityGroup, npc, r, slot - active, size);
  });

  const nextSlot = lots.length;
  for (let k = 0; k < 2; k++) {
    const slot = nextSlot + k;
    const x = (slot - active) * SPACING;
    const g = lotSlab(size, null, 0x22c55e);
    g.position.x = x;
    const sign = box(6, 2.2, 0.35, 0x22c55e);
    sign.position.set(x, 1.2, size / 2 + 1.2);
    cityGroup.add(g, sign);
    const panel = box(1.6, 0.5, 0.1, 0xffd166);
    panel.position.set(x, 2.4, size / 2 + 1.2);
    cityGroup.add(panel);
    const hit = box(size, 1.4, size, 0x22c55e, { transparent: true, opacity: 0.001 });
    hit.position.set(x, 0.7, 0);
    hit.userData = { kind: 'buyPlot' };
    cityGroup.add(hit);
    cityInteractives.push(hit);
  }

}
