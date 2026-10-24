import {
  GRID_SIZE, TILE_SIZE, START_CASH, START_HOUSE_EDGE, START_REPUTATION
} from './constants.js';
import { defaultPrices } from '../data/goods.js';

export function makeLot(id, theme, name) {
  return {
    id,
    name: name || `Lot ${id + 1}`,
    theme,
    radius: 7,
    exteriorGrid: {},
    interiorGrid: {},
    interiorUpperGrid: {}
  };
}

export function freshState() {
  return {
    cash: START_CASH,
    houseEdge: START_HOUSE_EDGE,
    prices: defaultPrices(),
    mode: 'exterior',
    selectedTool: null,
    dockCategory: { exterior: 'casino', interior: 'slots' },
    dockMajor: { exterior: 'entertainment', interior: 'gambling' },
    dockMode: 'lot',
    gridSize: GRID_SIZE,
    tileSize: TILE_SIZE,
    exteriorGrid: {},
    interiorGrid: {},
    interiorUpperGrid: {},
    lots: [makeLot(0, 'american', 'Lot 1')],
    activeLot: 0,
    interiorLayer: 0,
    campaignIndex: 0,
    campaignStars: {},
    scenarioStartDay: 1,
    dailies: [],
    dailyDay: 1,
    gameMode: 'freeplay',
    npcs: [],
    timeScale: 1,
    wander: false,
    maxPopulation: 0,
    eventsFreq: 1,
    disastersFreq: 1,
    unlockAll: false,
    weather: null,
    history: [],
    viewFilter: { needs: true, heat: false, utilities: false },
    heatmap: false,
    inspectedKey: null,
    pendingPlacement: null,
    reputation: START_REPUTATION,
    happiness: 70,
    condition: 100,
    level: 1,
    xp: 0,
    gold: 0,
    staff: {},
    staffUpkeep: 0,
    staffWageIndex: 1,
    boosts: [],
    plots: 0,
    prestigeLevel: 0,
    prestigePoints: 0,
    questIndex: 0,
    achievements: {},
    settings: {
      lang: 'en',
      sound: true,
      music: true,
      vibration: true,
      shadows: true,
      bloom: true,
      autoQuality: true,
      quality: 'high'
    },
    clock: { day: 1, hour: 8, season: 'summer', seasonIndex: 1 },
    event: null,
    tutorial: 0,
    tutorialDone: false,
    stats: { totalEarned: 0, buildingsBuilt: 0, viewedInterior: false, prestiges: 0, guestsServed: 0, tipsEarned: 0, upgrades: 0, cashierVisits: 0, pokerAdjusted: 0 },
    seenWelcome: false,
    lastSavedAt: Date.now()
  };
}

export const state = freshState();

export function activeLot() {
  return state.lots[state.activeLot] || state.lots[0];
}

export function syncActiveGrids() {
  const lot = activeLot();
  if (!lot) return;
  if (!lot.interiorUpperGrid) lot.interiorUpperGrid = {};
  state.exteriorGrid = lot.exteriorGrid;
  state.interiorGrid = lot.interiorGrid;
  state.interiorUpperGrid = lot.interiorUpperGrid;
  state.gridSize = (lot.radius || 7) * 2 + 1;
}

syncActiveGrids();

export function applyLoadedState(data) {
  const fresh = freshState();
  for (const key in fresh) {
    if (data[key] !== undefined) {
      if (typeof fresh[key] === 'object' && fresh[key] !== null && !Array.isArray(fresh[key])) {
        state[key] = Object.assign({}, fresh[key], data[key]);
      } else {
        state[key] = data[key];
      }
    } else {
      state[key] = fresh[key];
    }
  }
  state.pendingPlacement = null;
  state.inspectedKey = null;
  if (!Array.isArray(state.lots) || !state.lots.length) {
    state.lots = [makeLot(0, 'american', 'Lot 1')];
    state.activeLot = 0;
  }
  if (state.activeLot == null || state.activeLot >= state.lots.length) state.activeLot = 0;
  for (const lot of state.lots) {
    if (!lot.exteriorGrid) lot.exteriorGrid = {};
    if (!lot.interiorGrid) lot.interiorGrid = {};
    if (!lot.interiorUpperGrid) lot.interiorUpperGrid = {};
  }
  syncActiveGrids();
}

export function gridFor(world) {
  return world === 'exterior' ? state.exteriorGrid : state.interiorGrid;
}
