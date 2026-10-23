export const LOT_NAMES = [
  'Flamingo Road',
  'Sahara Avenue',
  'Tropicana Avenue',
  'Harmon Avenue',
  'Desert Inn Road',
  'Sands Avenue',
  'St Louis Avenue',
  'Hacienda Avenue',
  'Circus Circus Drive',
  'Convention Center Drive',
  'Westchester Drive',
  'Rue De Monte Carlo'
];

export function randomLotName(usedNames) {
  const used = new Set(usedNames || []);
  const free = LOT_NAMES.filter(n => !used.has(n));
  const pool = free.length ? free : LOT_NAMES;
  return pool[Math.floor(Math.random() * pool.length)];
}
