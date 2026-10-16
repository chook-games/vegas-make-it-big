export const GRID_SIZE = 15;
export const TILE_SIZE = 1.6;
export const MOVE_ROTATE_COST = 100;
export const TICK_MS = 2000;
export const DAY_LENGTH_MS = 96000;
export const BASE_POWER_CAP = 10;
export const BASE_GUESTS = 10;
export const OFFLINE_CAP_HOURS = 8;
export const OFFLINE_EFFICIENCY = 0.5;
export const SAVE_KEY = 'vegas_mib_save_v2';
export const SAVE_INTERVAL_MS = 8000;
export const RANDOM_EVENT_INTERVAL_MS = 45000;
export const PRESTIGE_BASE_GOAL = 100000;

export const START_CASH = 5000;
export const START_HOUSE_EDGE = 12;
export const START_REPUTATION = 10;

export const SEASONS = [
  { id: 'spring', name: 'Spring', icon: '🌸', guestMul: 1.0, incomeMul: 1.0 },
  { id: 'summer', name: 'Summer', icon: '☀️', guestMul: 1.2, incomeMul: 1.05 },
  { id: 'autumn', name: 'Autumn', icon: '🍂', guestMul: 0.95, incomeMul: 1.0 },
  { id: 'winter', name: 'Winter', icon: '❄️', guestMul: 0.85, incomeMul: 1.1 }
];

export const TIME_BANDS = [
  { from: 6, to: 12, id: 'morning', name: 'Morning', nightFactor: 0.85, dayFactor: 1.15 },
  { from: 12, to: 18, id: 'day', name: 'Day', nightFactor: 0.8, dayFactor: 1.2 },
  { from: 18, to: 22, id: 'evening', name: 'Evening', nightFactor: 1.15, dayFactor: 0.95 },
  { from: 22, to: 30, id: 'night', name: 'Night', nightFactor: 1.35, dayFactor: 0.8 }
];
