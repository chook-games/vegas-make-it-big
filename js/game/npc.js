import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';

const DEFS = [
  { id: 'vega', name: 'Vega Corp', icon: '🏢', color: '#ff2a85', speed: 1.0 },
  { id: 'golden', name: 'Golden Resorts', icon: '🏨', color: '#ffd166', speed: 1.3 }
];

export function setupNpcs() {
  state.npcs = DEFS.map(d => ({
    id: d.id, name: d.name, icon: d.icon, color: d.color, speed: d.speed,
    cash: 6000, value: 4200, reputation: 12, buildings: 3, lots: 1, nextCost: 1500
  }));
}

function valueOf(cell) {
  const c = cell.item.cost;
  return Math.round(c + (cell.level - 1) * c * 0.8);
}

export function playerValue() {
  let v = 0;
  for (const lot of state.lots) {
    for (const k in lot.exteriorGrid) v += valueOf(lot.exteriorGrid[k]);
    for (const k in lot.interiorGrid) v += valueOf(lot.interiorGrid[k]);
  }
  return v;
}

export function playerBuildings() {
  let n = 0;
  for (const lot of state.lots) {
    n += Object.keys(lot.exteriorGrid).length + Object.keys(lot.interiorGrid).length;
  }
  return n;
}

export function ensureNpcs() {
  if (!Array.isArray(state.npcs) || !state.npcs.length) setupNpcs();
}

export function npcTick() {
  ensureNpcs();
  for (const n of state.npcs) {
    n.cash += n.value * 0.02 * n.speed;
    if (n.cash >= n.nextCost) {
      n.cash -= n.nextCost;
      n.buildings += 1;
      n.value += Math.round(n.nextCost * 0.72);
      n.reputation = Math.min(100, n.reputation + 0.4 * n.speed);
      n.nextCost = Math.round(n.nextCost * 1.24);
      if (Math.random() < 0.06) n.lots += 1;
    }
  }
}

export function competitionFactor() {
  ensureNpcs();
  const mine = playerValue();
  let factor = 1;
  for (const n of state.npcs) {
    if (n.value > mine) {
      const gap = Math.min(1, (n.value - mine) / Math.max(1, mine));
      factor -= gap * 0.12;
    }
  }
  return Math.max(0.6, factor);
}

export function leaderboard() {
  ensureNpcs();
  const list = [{
    name: 'You', icon: '⭐', color: '#06d6a0',
    value: playerValue(), reputation: Math.round(state.reputation),
    buildings: playerBuildings(), isPlayer: true
  }].concat(state.npcs.map(n => ({
    name: n.name, icon: n.icon, color: n.color,
    value: Math.round(n.value), reputation: Math.round(n.reputation),
    buildings: n.buildings, isPlayer: false
  })));
  list.sort((a, b) => b.value - a.value);
  return list;
}

export function playerRank() {
  const lb = leaderboard();
  const idx = lb.findIndex(e => e.isPlayer);
  return { rank: idx + 1, total: lb.length };
}

export function beatTarget() {
  ensureNpcs();
  return Math.max(...state.npcs.map(n => n.value));
}
