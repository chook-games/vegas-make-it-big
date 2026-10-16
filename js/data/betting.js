import { state } from '../core/state.js';
import { categoryOf } from './categories.js';

export const BET_STEPS = [1, 5, 25, 100, 500];

export function betLabel(bi) {
  const b = BET_STEPS[clampIndex(bi)];
  return `$${b} - $${b * 5}`;
}

function clampIndex(bi) {
  return Math.max(0, Math.min(BET_STEPS.length - 1, bi || 0));
}

export function defaultBetIndex(tier) {
  const map = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 3 };
  return map[tier] != null ? map[tier] : 1;
}

export function isGambling(world, id) {
  if (id === 'casino') return true;
  const cat = categoryOf(world, id);
  return cat === 'table' || cat === 'slots';
}

export function edgeFactor(edge) {
  return edge <= 15
    ? 0.75 + (edge / 15) * 0.45
    : Math.max(0.35, 1.2 - (edge - 15) * 0.06);
}

export function betFactor(bi) {
  const table = [0.8, 1.0, 1.35, 1.8, 2.4];
  return table[clampIndex(bi)];
}

export function edgeLabel(edge) {
  if (edge <= 8) return 'Loose';
  if (edge <= 15) return 'Balanced';
  if (edge <= 22) return 'Tight';
  return 'Rigged';
}

export function stationIncomeFactor(world, cell) {
  if (!isGambling(world, cell.item.id)) return 1;
  const edge = cell.edge != null ? cell.edge : state.houseEdge;
  const bi = cell.betIndex != null ? cell.betIndex : 0;
  return edgeFactor(edge) * betFactor(bi);
}

export function setAllEdges(v) {
  for (const lot of state.lots) {
    for (const k in lot.interiorGrid) {
      const c = lot.interiorGrid[k];
      if (isGambling('interior', c.item.id)) c.edge = v;
    }
    for (const k in lot.exteriorGrid) {
      const c = lot.exteriorGrid[k];
      if (isGambling('exterior', c.item.id)) c.edge = v;
    }
    lot.__heat = null;
  }
}
