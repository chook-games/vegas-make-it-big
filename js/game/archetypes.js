export const ARCHETYPES = [
  {
    id: 'tourist', name: 'Tourist', icon: '🧳', color: 0x00bbf9,
    visits: 5, tipMul: 1, activities: ['gambling', 'food', 'drink', 'activity', 'toilet']
  },
  {
    id: 'family', name: 'Family', icon: '👪', color: 0xff9ebb,
    visits: 4, tipMul: 0.8, activities: ['activity', 'food', 'toilet', 'shopping']
  },
  {
    id: 'highroller', name: 'High Roller', icon: '🎩', color: 0xffd166,
    visits: 6, tipMul: 5, noiseSensitive: true, activities: ['gambling', 'drink', 'gambling', 'food', 'activity']
  },
  {
    id: 'cheater', name: 'Cheater', icon: '🕵️', color: 0x8d99ae,
    visits: 3, tipMul: 0.5, cheater: true, activities: ['gambling', 'gambling', 'drink']
  }
];

export const CATEGORY = {
  gamble: new Set(['slots', 'roulette', 'craps', 'sicbo', 'keno', 'baccarat', 'poker', 'sportsbook', 'vip_bj', 'highlimit', 'casino']),
  food: new Set(['restaurant', 'buffet', 'foodcourt']),
  drink: new Set(['bar', 'lounge', 'nightclub']),
  restroom: new Set(['restroom']),
  rest: new Set(['hotel']),
  fun: new Set(['pool', 'cinema', 'aquarium', 'ferris', 'rollercoaster', 'gardens', 'stadium', 'mall', 'spa', 'volcano', 'pagoda', 'robot', 'pyramid', 'castle', 'saloon', 'trex', 'rocket', 'titanic', 'statue'])
};

export const SPECIALS = [
  {
    id: 'celebrity', name: 'Celebrity', icon: '⭐', color: 0xffd166,
    visits: 6, tipMul: 8, isSpecial: true,
    activities: ['gambling', 'drink', 'food', 'shopping']
  },
  {
    id: 'whale', name: 'Whale', icon: '💎', color: 0x9b5de5,
    visits: 7, tipMul: 12, isSpecial: true,
    activities: ['gambling', 'drink', 'gambling', 'food']
  },
  {
    id: 'business', name: 'Business Exec', icon: '💼', color: 0x00bbf9,
    visits: 5, tipMul: 2.5, isSpecial: true,
    activities: ['gambling', 'food', 'drink']
  }
];

export function findArchetype(id) {
  return ARCHETYPES.find(a => a.id === id) || SPECIALS.find(a => a.id === id) || null;
}

export function archetypeWeights(state) {
  const rep = state.reputation / 100;
  const edge = state.houseEdge;
  const cashPressure = Math.min(1, state.cash / 200000);
  let highrollerW = 0.15 + rep * 0.9 + cashPressure * 0.4;
  if (state.highrollerBoostDay && state.clock && state.clock.day <= state.highrollerBoostDay) {
    highrollerW += 1.5;
  }
  return [
    { def: ARCHETYPES[0], w: 1.0 },
    { def: ARCHETYPES[1], w: 0.6 + rep * 0.3 },
    { def: ARCHETYPES[2], w: highrollerW },
    { def: ARCHETYPES[3], w: 0.2 + (edge > 15 ? 0.4 : 0.15) }
  ];
}

export function pickArchetype(state) {
  const weights = archetypeWeights(state);
  let total = weights.reduce((a, b) => a + b.w, 0);
  let r = Math.random() * total;
  for (const entry of weights) {
    if (r < entry.w) return entry.def;
    r -= entry.w;
  }
  return ARCHETYPES[0];
}
