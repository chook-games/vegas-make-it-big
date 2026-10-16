export const EXT_CATEGORIES = [
  { id: 'casino', name: 'Casinos', icon: '🎰' },
  { id: 'hotel', name: 'Hotels', icon: '🏨' },
  { id: 'attraction', name: 'Attractions', icon: '🎡' },
  { id: 'food', name: 'Food & Shops', icon: '🍽️' },
  { id: 'utility', name: 'Utilities', icon: '⚡' },
  { id: 'transport', name: 'Transport', icon: '🅿️' },
  { id: 'paths', name: 'Paths', icon: '⬜' },
  { id: 'decor', name: 'Decor', icon: '🌳' }
];

export const INT_CATEGORIES = [
  { id: 'slots', name: 'Slots', icon: '🍒' },
  { id: 'table', name: 'Tables', icon: '🎲' },
  { id: 'food', name: 'Food & Bar', icon: '🍸' },
  { id: 'support', name: 'Support', icon: '💵' },
  { id: 'security', name: 'Security', icon: '🛡️' },
  { id: 'decor', name: 'Decor', icon: '🌿' }
];

const EXT_MAP = {
  casino: 'casino',
  hotel: 'hotel',
  chapel: 'attraction',
  fountain: 'decor',
  generator: 'utility',
  solar: 'utility',
  powerplant: 'utility',
  waterpump: 'utility',
  waterplant: 'utility',
  parking: 'transport',
  tramstop: 'transport',
  helipad: 'transport',
  restaurant: 'food',
  mall: 'food',
  cinema: 'attraction',
  aquarium: 'attraction',
  marina: 'attraction',
  golf: 'attraction',
  ferris: 'attraction',
  rollercoaster: 'attraction',
  convention: 'attraction',
  stadium: 'attraction',
  pool: 'attraction',
  gardens: 'decor',
  observatory: 'attraction',
  statue: 'attraction',
  titanic: 'attraction',
  rocket: 'attraction',
  trex: 'attraction',
  pagoda: 'attraction',
  pyramid: 'attraction',
  saloon: 'attraction',
  volcano: 'attraction',
  castle: 'attraction',
  robot: 'attraction',
  path_concrete: 'paths',
  path_pavement: 'paths',
  decor_flag: 'decor',
  decor_wave: 'decor',
  decor_ufo: 'decor',
  decor_fern: 'decor',
  decor_lantern: 'decor',
  decor_obelisk: 'decor',
  decor_cactus: 'decor',
  decor_palm: 'decor',
  decor_banner: 'decor',
  decor_pillar: 'decor'
};

const INT_MAP = {
  slots: 'slots',
  keno: 'slots',
  roulette: 'table',
  vip_bj: 'table',
  poker: 'table',
  sicbo: 'table',
  craps: 'table',
  baccarat: 'table',
  sportsbook: 'table',
  highlimit: 'table',
  boxing: 'table',
  bar: 'food',
  lounge: 'food',
  buffet: 'food',
  foodcourt: 'food',
  spa: 'food',
  nightclub: 'food',
  giftshop: 'food',
  cashier: 'support',
  cage: 'support',
  vault: 'support',
  restroom: 'support',
  security: 'security',
  wall: 'decor',
  plants: 'decor'
};

export function categoriesFor(world) {
  return world === 'exterior' ? EXT_CATEGORIES : INT_CATEGORIES;
}

export function categoryOf(world, id) {
  const map = world === 'exterior' ? EXT_MAP : INT_MAP;
  return map[id] || 'decor';
}
