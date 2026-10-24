const NOISE_SRC = {
  slots: 0.55, craps: 0.8, sicbo: 0.7, nightclub: 0.9, boxing: 1.0,
  generator: 0.65, powerplant: 0.85, rollercoaster: 0.9, stadium: 0.8, helipad: 0.7,
  circus: 0.7, theatre: 0.5, carjackpot: 0.7, progressiveslots: 0.6
};

const SMELL_SRC = {
  buffet: 0.7, foodcourt: 0.8, generator: 0.5, powerplant: 0.6,
  restaurant: 0.4, restroom: 1.0, stadium: 0.3, kitchen: 0.6
};

const CLEANERS = {
  gardens: 0.55, lounge: 0.25, spa: 0.35, fountain: 0.4, pool: 0.3
};

const RADIUS = 3;

function neighbors(grid, gx, gz) {
  return [[gx + 1, gz], [gx - 1, gz], [gx, gz + 1], [gx, gz - 1]];
}

function propagate(grid, sources, radius) {
  const map = {};
  const visited = {};
  const queue = [];
  for (const key in sources) {
    const s = sources[key];
    map[key] = Math.max(map[key] || 0, s.v);
    queue.push({ key, gx: s.gx, gz: s.gz, dist: 0, val: s.v });
  }

  while (queue.length) {
    const cur = queue.shift();
    if (visited[cur.key] !== undefined && visited[cur.key] <= cur.dist) continue;
    visited[cur.key] = cur.dist;
    map[cur.key] = Math.max(map[cur.key] || 0, cur.val);
    if (cur.dist >= radius) continue;
    for (const [nx, nz] of neighbors(grid, cur.gx, cur.gz)) {
      const nk = `${nx},${nz}`;
      const cell = grid[nk];
      if (cell && cell.item.isWall) continue;
      const nv = cur.val * (1 - 1 / (radius + 1.5));
      queue.push({ key: nk, gx: nx, gz: nz, dist: cur.dist + 1, val: nv });
    }
  }
  return map;
}

function buildSources(grid, table) {
  const src = {};
  for (const key in grid) {
    const cell = grid[key];
    const base = table[cell.item.id];
    if (!base) continue;
    src[key] = { gx: cell.gx, gz: cell.gz, v: Math.min(1, base * (1 + (cell.level - 1) * 0.1)) };
  }
  return src;
}

function applyCleaners(grid, map) {
  for (const key in grid) {
    const item = grid[key].item;
    const c = CLEANERS[item.id];
    if (c && map[key]) map[key] = map[key] * (1 - c);
  }
}

export function computeGridHeat(grid) {
  const noise = propagate(grid, buildSources(grid, NOISE_SRC), RADIUS);
  const smell = propagate(grid, buildSources(grid, SMELL_SRC), RADIUS);
  applyCleaners(grid, smell);
  applyCleaners(grid, noise);
  return { noise, smell };
}

export function computeLotHeatmap(lot) {
  return {
    exterior: computeGridHeat(lot.exteriorGrid),
    interior: computeGridHeat(lot.interiorGrid)
  };
}

export function heatAt(lot, world, gx, gz) {
  if (!lot.__heat) lot.__heat = computeLotHeatmap(lot);
  const h = lot.__heat[world];
  if (!h) return { noise: 0, smell: 0 };
  const key = `${gx},${gz}`;
  return { noise: h.noise[key] || 0, smell: h.smell[key] || 0 };
}

export function invalidateHeat(lot) {
  if (lot) lot.__heat = null;
}

export const HEAT_RADIUS = RADIUS;
