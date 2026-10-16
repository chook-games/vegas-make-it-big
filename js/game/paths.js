import { state } from '../core/state.js';

const FRONT = [ { x: 0, z: 1 }, { x: 1, z: 0 }, { x: 0, z: -1 }, { x: -1, z: 0 } ];

export function frontOffset(rotation) {
  return FRONT[(((rotation || 0) % 4) + 4) % 4];
}

export function entranceKey(cell) {
  const f = frontOffset(cell.rotation || 0);
  return `${cell.gx + f.x},${cell.gz + f.z}`;
}

function gridFor(lot, world) {
  return world === 'exterior' ? lot.exteriorGrid : lot.interiorGrid;
}

function compute(lot, world) {
  const grid = gridFor(lot, world);
  const walkable = new Map();
  let maxGz = -99;
  for (const k in grid) {
    const c = grid[k];
    maxGz = Math.max(maxGz, c.gz);
    if (c.item.isPath && c.tileMesh) {
      walkable.set(k, { x: c.tileMesh.position.x, z: c.tileMesh.position.z });
    }
  }

  const connected = new Set();
  const q = [];
  for (const [k] of walkable) {
    if (grid[k].gz === maxGz) { connected.add(k); q.push(k); }
  }
  while (q.length) {
    const k = q.shift();
    const c = grid[k];
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nk = `${c.gx + dx},${c.gz + dz}`;
      if (walkable.has(nk) && !connected.has(nk)) { connected.add(nk); q.push(nk); }
    }
  }

  const open = new Set();
  for (const k in grid) {
    const c = grid[k];
    if (c.item.isPath) { open.add(k); continue; }
    const ek = entranceKey(c);
    if (walkable.has(ek) && connected.has(ek)) open.add(k);
  }

  return { walkable, connected, open, maxGz };
}

export function getPaths(lot, world) {
  if (!lot) return { walkable: new Map(), connected: new Set(), open: new Set(), maxGz: 0 };
  if (!lot.__paths) lot.__paths = {};
  if (!lot.__paths[world]) lot.__paths[world] = compute(lot, world);
  return lot.__paths[world];
}

export function isOpen(lot, world, cell) {
  if (cell.item.isPath) return true;
  return getPaths(lot, world).open.has(cell.key);
}

export function invalidatePaths(lot) {
  if (lot) lot.__paths = null;
}

export function keyAt(x, z) {
  const ts = state.tileSize;
  return `${Math.round(x / ts)},${Math.round(z / ts)}`;
}

export function nearestWalkable(lot, world, x, z) {
  const p = getPaths(lot, world);
  let bestKey = null, bestPos = null, bd = Infinity;
  for (const [k, pos] of p.walkable) {
    const d = (pos.x - x) ** 2 + (pos.z - z) ** 2;
    if (d < bd) { bd = d; bestKey = k; bestPos = pos; }
  }
  if (!bestKey) return null;
  return { key: bestKey, pos: bestPos };
}

export function bfsPath(lot, world, startKey, goalKey) {
  const p = getPaths(lot, world);
  if (!p.walkable.has(startKey) || !p.walkable.has(goalKey)) return [];
  const prev = new Map();
  const q = [startKey];
  prev.set(startKey, null);
  while (q.length) {
    const k = q.shift();
    if (k === goalKey) break;
    const parts = k.split(',');
    const gx = parseInt(parts[0], 10), gz = parseInt(parts[1], 10);
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nk = `${gx + dx},${gz + dz}`;
      if (p.walkable.has(nk) && !prev.has(nk)) { prev.set(nk, k); q.push(nk); }
    }
  }
  if (!prev.has(goalKey)) return [];
  const path = [];
  let cur = goalKey;
  while (cur) {
    const pos = p.walkable.get(cur);
    if (pos) path.push(pos);
    cur = prev.get(cur);
  }
  return path.reverse();
}

export function connectedCount(lot, world) {
  return getPaths(lot, world).connected.size;
}
