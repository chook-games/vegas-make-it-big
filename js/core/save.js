import { SAVE_KEY } from './constants.js';
import { state, applyLoadedState, freshState } from './state.js';
import { findItem } from '../data/buildings.js';

function serializeGrid(grid) {
  const out = {};
  for (const key in grid) {
    const c = grid[key];
    out[key] = {
      gx: c.gx, gz: c.gz, key: c.key, world: c.world,
      itemId: c.item.id, level: c.level, rotation: c.rotation || 0
    };
  }
  return out;
}

export function serialize() {
  return {
    v: 2,
    cash: state.cash,
    houseEdge: state.houseEdge,
    reputation: state.reputation,
    happiness: state.happiness,
    level: state.level,
    xp: state.xp,
    gold: state.gold,
    staff: state.staff,
    plots: state.plots,
    prestigeLevel: state.prestigeLevel,
    prestigePoints: state.prestigePoints,
    questIndex: state.questIndex,
    achievements: state.achievements,
    settings: state.settings,
    clock: state.clock,
    stats: state.stats,
    tutorial: state.tutorial,
    tutorialDone: state.tutorialDone,
    seenWelcome: state.seenWelcome,
    exteriorGrid: serializeGrid(state.exteriorGrid),
    interiorGrid: serializeGrid(state.interiorGrid),
    lastSavedAt: Date.now()
  };
}

export function save() {
  try {
    state.lastSavedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(serialize()));
    return true;
  } catch (e) {
    console.warn('Save failed', e);
    return false;
  }
}

export function hasSave() {
  try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
}

export function loadRaw() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) { return null; }
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}

function hydrateGrid(raw, world) {
  const grid = {};
  if (!raw) return grid;
  for (const key in raw) {
    const c = raw[key];
    const item = findItem(world, c.itemId);
    if (!item) continue;
    grid[key] = {
      gx: c.gx, gz: c.gz, key: c.key, world,
      item, level: c.level || 1, rotation: c.rotation || 0,
      mesh: null, tileMesh: null
    };
  }
  return grid;
}

export function load() {
  const raw = loadRaw();
  if (!raw) return null;
  const data = Object.assign({}, raw);
  data.exteriorGrid = hydrateGrid(raw.exteriorGrid, 'exterior');
  data.interiorGrid = hydrateGrid(raw.interiorGrid, 'interior');
  applyLoadedState(data);
  return raw;
}

export function resetToNew() {
  const fresh = freshState();
  applyLoadedState(fresh);
  clearSave();
}
