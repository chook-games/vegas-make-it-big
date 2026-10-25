import { state } from '../core/state.js';
import { goodForVenue } from '../data/goods.js';
import { isGambling, betFactor } from '../data/betting.js';

const TURNS = { drinks: 4, food: 2, rooms: 1, shows: 0.75, shops: 3 };
const GAMBLE_VISITS = 5;
const GAMBLE_WAGER = 10;
const ADMISSION = 8;
const ATTRACTION_TURNS = 1.0;
const PAID = new Set(['pool', 'wavepool', 'aquarium', 'arcade', 'rollercoaster', 'ferris', 'waterride', 'golf', 'marina', 'tennisclub', 'convention', 'observatory', 'helipad']);

// Daily revenue a venue can generate at full occupancy, in original-game dollars.
// Guests are the only source of income: rooms, food, drinks, tickets, shopping and gambling.
export function dailyBuildingRevenue(world, cell) {
  const item = cell.item;
  if (!item) return 0;
  const level = cell.level || 1;
  const cap = (item.guests || 0) * level;
  if (cap <= 0) return 0;
  if (item.isPath || item.isWall || item.isGenerator || item.isMaintenance || item.isSecurity) return 0;
  if (item.income <= 0) return 0;

  if (item.id === 'jewelrystore') return Math.round(cap * 2400);
  if (item.id === 'pool') return Math.round(cap * 25);
  if (item.id === 'arcade') return Math.round(cap * 25);
  if (item.id === 'aquarium') return Math.round(cap * 20);
  if (item.id === 'wavepool') return Math.round(cap * 25);
  if (item.id === 'spa') return Math.round(cap * 120);
  if (item.id === 'chapel') return Math.round(cap * 90);

  const good = goodForVenue(item.id);
  if (good) {
    const price = (state.prices && state.prices[good.id] != null) ? state.prices[good.id] : good.def;
    const turns = TURNS[good.id] || 2;
    return Math.round(cap * turns * price);
  }

  if (isGambling(world, item.id)) {
    const edge = cell.edge != null ? cell.edge : state.houseEdge;
    const bi = cell.betIndex != null ? cell.betIndex : 0;
    return Math.round(cap * GAMBLE_VISITS * GAMBLE_WAGER * (edge / 100) * betFactor(bi));
  }

  const paid = PAID.has(item.id);
  if (!paid) return 0;
  return Math.round(cap * ATTRACTION_TURNS * ADMISSION);
}
