export const MAX_LEVEL = 50;
export const BASE_XP = 120;

export function xpForLevel(level) {
  return Math.round(BASE_XP * Math.pow(level, 1.5));
}

export function levelReward(level) {
  const cash = Math.round(250 * Math.pow(level, 1.65));
  const gold = level % 5 === 0 ? 1 + Math.floor(level / 10) : 0;
  return { cash, gold };
}

export const RANKS = [
  { min: 1, name: 'Νέος Επενδυτής' },
  { min: 4, name: 'Ξενοδόχος' },
  { min: 8, name: 'Ιδιοκτήτης Καζίνο' },
  { min: 13, name: 'Μεγιστάνας' },
  { min: 19, name: 'Βαρόνος του Strip' },
  { min: 26, name: 'Πρίγκιπας της Vegas' },
  { min: 34, name: 'Θρύλος του Χρυσού' },
  { min: 43, name: 'Αυτοκράτορας της Vegas' }
];

export function rankFor(level) {
  let name = RANKS[0].name;
  for (const r of RANKS) if (level >= r.min) name = r.name;
  return name;
}

export const XP = {
  build: 0.02,
  upgrade: 0.015,
  income: 0.00002,
  quest: 60,
  achievement: 40,
  guestServed: 0.5,
  prestige: 200
};

export function xpForCost(cost, factor) {
  return Math.max(1, Math.round(cost * factor));
}
