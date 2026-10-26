import { state } from '../core/state.js';
import { exteriorGroup } from './scene.js';
import { themeById } from '../data/themes.js';
import { textSprite } from './icons.js';

const SPACING = 34;
const cityGroup = new THREE.Group();
exteriorGroup.add(cityGroup);

export const cityInteractives = [];

const buyRing = new THREE.Group();
{
  const gold = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.95, depthWrite: false });
  const sides = [];
  for (let s = 0; s < 4; s++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(1, 0.18, 0.035), gold);
    const a = s * Math.PI / 2;
    m.position.set(Math.sin(a) * 0.5, 0, Math.cos(a) * 0.5);
    m.rotation.y = a;
    sides.push(m);
  }
  buyRing.add(...sides);
  buyRing.position.y = 0.16;
  buyRing.visible = false;
  exteriorGroup.add(buyRing);
}

export function setBuyHighlight(on) {
  const size = state.gridSize * state.tileSize * 0.95;
  buyRing.scale.set(size, 1, size);
  buyRing.visible = !!on;
}

const hoverRing = new THREE.Mesh(
  new THREE.RingGeometry(0.92, 1.0, 40),
  new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false })
);
hoverRing.rotation.x = -Math.PI / 2;
hoverRing.position.y = 0.25;
hoverRing.visible = false;
exteriorGroup.add(hoverRing);

const OWNED_CELLS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
const RIVAL_CELLS = [[2, 0], [-2, 0]];
const SALE_CELLS = [[0, 2], [0, -2], [2, 1], [-2, 1]];

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

function lotSlab(size, theme) {
  const g = new THREE.Group();
  const slab = box(size, 0.12, size, theme ? theme.ground : 0x2b3b4a);
  slab.position.y = -0.02;
  g.add(slab);
  const edge = theme ? theme.accent : 0x22c55e;
  const half = size / 2;
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
  const g = new THREE.Group();
  const body = box(1.7, h, 1.5, color);
  body.position.y = h / 2;
  const roof = box(1.85, 0.14, 1.65, theme.roof);
  roof.position.y = h + 0.05;
  g.add(body, roof);
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

function addRivalLot(npc, slot, size) {
  const color = parseColor(npc.color, 0x99aabb);
  const g = new THREE.Group();
  const jx = jitter(slot[0] * 7 + slot[1] * 13, 1) * 5;
  const jz = jitter(slot[0] * 7 + slot[1] * 13, 2) * 5;
  const jr = jitter(slot[0] * 7 + slot[1] * 13, 3) * 0.14;
  g.position.set(slot[0] * SPACING + jx, 0, slot[1] * SPACING + jz);
  g.rotation.y = jr;
  const slab = box(size, 0.12, size, 0x263238);
  slab.position.y = -0.02;
  g.add(slab);
  const count = Math.min(12, Math.max(2, npc.buildings || 3));
  for (let i = 0; i < count; i++) {
    const gx = ((i % 3) - 1) * (size / 4);
    const gz = ((Math.floor(i / 3) % 3) - 1) * (size / 4);
    const h = 1.2 + (i % 4) * 0.9;
    const b = box(2.0, h, 1.8, i % 3 === 0 ? color : 0x3a4658);
    b.position.set(gx, h / 2, gz);
    g.add(b);
    const roof = box(2.15, 0.14, 1.95, 0xffd166);
    roof.position.set(gx, h + 0.05, gz);
    g.add(roof);
  }
  const label = textSprite(npc.name, npc.color || '#9fb3d9', 10);
  label.position.set(0, 6.2, size / 2 + 1.6);
  g.add(label);
  cityGroup.add(g);
}

function jitter(i, salt) {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (v - Math.floor(v)) - 0.5;
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

export function updateCityHover(ray) {
  if (!ray || !cityInteractives.length) { hoverRing.visible = false; return false; }
  const hits = ray.intersectObjects(cityInteractives, false);
  if (!hits.length) { hoverRing.visible = false; return false; }
  const d = hits[0].object.userData;
  hoverRing.position.set(d.x, 0.25, d.z);
  hoverRing.scale.setScalar((d.size || 20) / 2);
  hoverRing.material.color.setHex(d.kind === 'buyPlot' ? 0x22c55e : 0xffd166);
  hoverRing.visible = true;
  return true;
}

export function rebuildCity() {
  while (cityGroup.children.length) cityGroup.remove(cityGroup.children[0]);
  cityInteractives.length = 0;

  const ts = state.tileSize;
  const size = state.gridSize * ts * 0.95;
  const active = state.activeLot;
  const lots = state.lots || [];
  const npcs = state.npcs || [];

  let ownedIdx = 0;
  lots.forEach((lot, i) => {
    if (i === active) return;
    const cell = OWNED_CELLS[ownedIdx % OWNED_CELLS.length];
    ownedIdx++;
    const x = cell[0] * SPACING + jitter(i + 11, 1) * 5;
    const z = cell[1] * SPACING + jitter(i + 11, 2) * 5;
    const rot = jitter(i + 11, 3) * 0.14;
    const th = themeColors(themeById(lot.theme));
    const g = lotSlab(size, th);
    g.position.set(x, 0, z);
    g.rotation.y = rot;
    addLotBuildings(g, lot, ts);
    const label = textSprite(lot.name, '#ffd166', 10);
    label.position.set(0, 6.2, size / 2 + 1.6);
    g.add(label);
    cityGroup.add(g);

    const hit = box(size, 8, size, th.accent, { transparent: true, opacity: 0.001 });
    hit.position.set(x, 4, z);
    hit.rotation.y = rot;
    hit.userData = { kind: 'lot', index: i, x, z, size };
    cityGroup.add(hit);
    cityInteractives.push(hit);
  });

  npcs.forEach((npc, r) => {
    addRivalLot(npc, RIVAL_CELLS[r % RIVAL_CELLS.length], size);
  });

  for (let k = 0; k < 2; k++) {
    const cell = SALE_CELLS[k % SALE_CELLS.length];
    const x = cell[0] * SPACING + jitter(k + 41, 1) * 5;
    const z = cell[1] * SPACING + jitter(k + 41, 2) * 5;
    const rot = jitter(k + 41, 3) * 0.14;
    const g = lotSlab(size, null);
    g.position.set(x, 0, z);
    g.rotation.y = rot;
    const sign = box(6, 2.2, 0.35, 0x22c55e);
    sign.position.set(0, 1.2, size / 2 + 1.2);
    g.add(sign);
    const panel = box(1.6, 0.5, 0.1, 0xffd166);
    panel.position.set(0, 2.4, size / 2 + 1.2);
    g.add(panel);
    const lbl = textSprite('FOR SALE', '#22c55e', 8);
    lbl.position.set(0, 4.6, size / 2 + 2.0);
    g.add(lbl);
    cityGroup.add(g);

    const hit = box(size, 8, size, 0x22c55e, { transparent: true, opacity: 0.001 });
    hit.position.set(x, 4, z);
    hit.rotation.y = rot;
    hit.userData = { kind: 'buyPlot', x, z, size };
    cityGroup.add(hit);
    cityInteractives.push(hit);
  }
}
