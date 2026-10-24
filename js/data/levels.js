export const MAX_LEVEL = 50;
export const BASE_XP = 80;

export function xpForLevel(level) {
  return Math.round(BASE_XP * Math.pow(level, 1.4));
}

export function levelReward(level) {
  const cash = Math.round(250 * Math.pow(level, 1.65));
  const gold = level % 5 === 0 ? 1 + Math.floor(level / 10) : 0;
  return { cash, gold };
}

export const RANKS = [
  { min: 1, name: 'New Investor' },
  { min: 4, name: 'Hotelier' },
  { min: 8, name: 'Casino Owner' },
  { min: 13, name: 'Tycoon' },
  { min: 19, name: 'Strip Baron' },
  { min: 26, name: 'Prince of Vegas' },
  { min: 34, name: 'Gold Legend' },
  { min: 43, name: 'Emperor of Vegas' }
];

export function rankFor(level) {
  let name = RANKS[0].name;
  for (const r of RANKS) if (level >= r.min) name = r.name;
  return name;
}

export const XP = {
  build: 0.03,
  upgrade: 0.02,
  income: 0.00001,
  quest: 60,
  achievement: 40,
  guestServed: 0.5,
  prestige: 200
};

export function xpForCost(cost, factor) {
  return Math.max(1, Math.round(cost * factor));
}
