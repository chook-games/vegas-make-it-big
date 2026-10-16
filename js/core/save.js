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
    v: 3,
    cash: state.cash,
    houseEdge: state.houseEdge,
    reputation: state.reputation,
    happiness: state.happiness,
    level: state.level,
    xp: state.xp,
    gold: state.gold,
    staff: state.staff,
    plots: state.plots,
    activeLot: state.activeLot,
    gameMode: state.gameMode,
    campaignIndex: state.campaignIndex,
    campaignStars: state.campaignStars,
    scenarioStartDay: state.scenarioStartDay,
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
    lots: state.lots.map(lot => ({
      id: lot.id,
      name: lot.name,
      theme: lot.theme,
      radius: lot.radius || 5,
      exteriorGrid: serializeGrid(lot.exteriorGrid),
      interiorGrid: serializeGrid(lot.interiorGrid)
    })),
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

  if (raw.lots && raw.lots.length) {
    data.lots = raw.lots.map(lot => ({
      id: lot.id,
      name: lot.name,
      theme: lot.theme || 'american',
      radius: lot.radius || 5,
      exteriorGrid: hydrateGrid(lot.exteriorGrid, 'exterior'),
      interiorGrid: hydrateGrid(lot.interiorGrid, 'interior')
    }));
    data.activeLot = Math.min(raw.activeLot || 0, data.lots.length - 1);
  } else {
    data.lots = [{
      id: 0, name: 'Lot 1', theme: 'american', radius: 3,
      exteriorGrid: hydrateGrid(raw.exteriorGrid, 'exterior'),
      interiorGrid: hydrateGrid(raw.interiorGrid, 'interior')
    }];
    data.activeLot = 0;
  }

  applyLoadedState(data);
  return raw;
}

export function resetToNew() {
  const fresh = freshState();
  applyLoadedState(fresh);
  clearSave();
}
