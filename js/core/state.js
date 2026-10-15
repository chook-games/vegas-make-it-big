import {
  GRID_SIZE, TILE_SIZE, START_CASH, START_HOUSE_EDGE, START_REPUTATION
} from './constants.js';

export function freshState() {
  return {
    cash: START_CASH,
    houseEdge: START_HOUSE_EDGE,
    mode: 'exterior',
    selectedTool: null,
    gridSize: GRID_SIZE,
    tileSize: TILE_SIZE,
    exteriorGrid: {},
    interiorGrid: {},
    inspectedKey: null,
    pendingPlacement: null,
    reputation: START_REPUTATION,
    happiness: 70,
    prestigeLevel: 0,
    prestigePoints: 0,
    questIndex: 0,
    achievements: {},
    settings: {
      sound: true,
      music: true,
      vibration: true,
      shadows: true,
      quality: 'high'
    },
    clock: { day: 1, hour: 8, season: 'summer', seasonIndex: 1 },
    event: null,
    tutorial: 0,
    tutorialDone: false,
    stats: { totalEarned: 0, buildingsBuilt: 0, viewedInterior: false, prestiges: 0 },
    seenWelcome: false,
    lastSavedAt: Date.now()
  };
}

export const state = freshState();

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
}

export function gridFor(world) {
  return world === 'exterior' ? state.exteriorGrid : state.interiorGrid;
}
