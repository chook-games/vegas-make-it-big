export const SIZES = {
  casino: [3, 3], hotel: [2, 2], chapel: [2, 2], fountain: [2, 2], generator: [2, 2],
  parking: [3, 3], restaurant: [2, 2], solar: [2, 2], pool: [4, 3], gardens: [3, 3],
  cinema: [2, 3], mall: [3, 3], aquarium: [3, 3], powerplant: [3, 3], marina: [3, 4],
  golf: [4, 4], ferris: [3, 3], rollercoaster: [4, 4], convention: [4, 3], stadium: [4, 4],
  helipad: [2, 3], observatory: [2, 3], statue: [2, 2], titanic: [4, 3], rocket: [2, 3],
  trex: [3, 3], pagoda: [3, 3], pyramid: [3, 3], saloon: [3, 2], volcano: [3, 3], castle: [3, 3], robot: [2, 3],
  slots: [3, 1], roulette: [2, 2], vip_bj: [2, 2], wall: [3, 1], security: [2, 2], cashier: [2, 1],
  keno: [2, 2], bar: [2, 2], poker: [2, 2], sicbo: [2, 2], craps: [2, 2], baccarat: [2, 2],
  giftshop: [2, 2], lounge: [3, 3], cage: [2, 2], sportsbook: [3, 2], buffet: [3, 2], foodcourt: [3, 3],
  spa: [3, 2], nightclub: [3, 3], highlimit: [3, 3], boxing: [4, 3], vault: [2, 2], restroom: [2, 2],
  plants: [1, 1], path_concrete: [1, 1], path_pavement: [1, 1]
};

export function sizeOf(id) {
  return SIZES[id] || [1, 1];
}

export function effSize(id, rotation) {
  const s = sizeOf(id);
  return (rotation % 2 === 0) ? [s[0], s[1]] : [s[1], s[0]];
}
