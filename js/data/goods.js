export const GOODS = [
  { id: 'drinks', name: 'Drinks', icon: '🍸', cost: 10, min: 2, max: 20, step: 2, def: 8,
    venues: ['bar', 'lounge', 'nightclub'] },
  { id: 'food', name: 'Food', icon: '🍽️', cost: 20, min: 10, max: 40, step: 2, def: 20,
    venues: ['restaurant', 'buffet', 'foodcourt'] },
  { id: 'rooms', name: 'Rooms', icon: '🛏️', cost: 50, min: 20, max: 90, step: 5, def: 45,
    venues: ['hotel', 'motel', 'mediumhotel', 'largehotel'] },
  { id: 'shows', name: 'Shows', icon: '🎬', cost: 30, min: 10, max: 60, step: 5, def: 35,
    venues: ['cinema', 'stadium', 'boxing', 'theatre', 'circus'] },
  { id: 'shops', name: 'Souvenirs', icon: '🎁', cost: 15, min: 5, max: 30, step: 1, def: 18,
    venues: ['mall', 'giftshop', 'jewelrystore'] }
];

export function goodForVenue(id) {
  return GOODS.find(g => g.venues.includes(id)) || null;
}

export function defaultPrices() {
  const p = {};
  for (const g of GOODS) p[g.id] = g.def;
  return p;
}

export function priceT(good, price) {
  return Math.max(0, Math.min(1, (price - good.min) / Math.max(1, good.max - good.min)));
}