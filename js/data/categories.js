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
  motel: 'hotel',
  headoffice: 'utility',
  mechhut: 'utility',
  elechut: 'utility',
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
  stairs: 'support',
  plants: 'decor'
};

export function categoriesFor(world) {
  return world === 'exterior' ? EXT_CATEGORIES : INT_CATEGORIES;
}

export const EXT_MAJOR = [
  { id: 'facilities', name: 'Hotels & Facilities', icon: '🏨', subgroups: ['hotel', 'utility'] },
  { id: 'entertainment', name: 'Casinos & Entertainment', icon: '🎰', subgroups: ['casino', 'attraction'] },
  { id: 'services', name: 'Shops & Services', icon: '🛍️', subgroups: ['food', 'transport'] },
  { id: 'scenery', name: 'Paths & Scenery', icon: '🌳', subgroups: ['paths', 'decor'] }
];

export const INT_MAJOR = [
  { id: 'facilities', name: 'Staff & Facilities', icon: '🛠️', subgroups: ['support', 'security'] },
  { id: 'gambling', name: 'Gambling', icon: '🎰', subgroups: ['slots', 'table'] },
  { id: 'retail', name: 'Retail & Dining', icon: '🍸', subgroups: ['food'] },
  { id: 'decor', name: 'Decor', icon: '🌿', subgroups: ['decor'] }
];

export function majorsFor(world) {
  return world === 'exterior' ? EXT_MAJOR : INT_MAJOR;
}

export function majorFor(world, categoryId) {
  const majors = majorsFor(world);
  return majors.find(m => m.subgroups.includes(categoryId)) || majors[0];
}

export function categoryOf(world, id) {
  const map = world === 'exterior' ? EXT_MAP : INT_MAP;
  return map[id] || 'decor';
}
