export const CATALOG = {
  exterior: [
    { id: 'casino', name: 'Casino', icon: '🎰', cost: 1200, income: 160, power: -3, guests: 25, tier: 1,
      desc: 'The heart of the resort. Bright entrance with a red carpet out front.' },
    { id: 'hotel', name: 'Hotel', icon: '🏨', cost: 900, income: 110, power: -2, guests: 40, tier: 1, isHotel: true,
      desc: 'Luxury tower with a pool. Increases guest capacity.' },
    { id: 'chapel', name: 'Wedding Chapel', icon: '💒', cost: 650, income: 95, power: -1, guests: 15, tier: 1,
      desc: 'Little wedding chapel with a bell tower on the front.' },
    { id: 'fountain', name: 'Fountain', icon: '⛲', cost: 500, income: 45, power: -1, guests: 30, tier: 1,
      desc: 'Spectacular fountain with a golden arch. Boosts Reputation.' },
    { id: 'generator', name: 'Generator', icon: '⚡', cost: 450, income: -15, power: 8, guests: -5, tier: 1, isGenerator: true,
      desc: 'Produces +8 Power for your lot.' },
    { id: 'parking', name: 'Parking', icon: '🅿️', cost: 600, income: 55, power: 0, guests: 35, tier: 2, requires: { level: 3 },
      desc: 'Multi-storey car park. Draws visitors from all over town.' },
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️', cost: 800, income: 130, power: -2, guests: 20, tier: 2, requires: { level: 5, rep: 20 },
      desc: 'Fine-dining chef restaurant. Makes guests stay longer.' },
    { id: 'solar', name: 'Solar Panels', icon: '☀️', cost: 900, income: 20, power: 12, guests: -3, tier: 2, isGenerator: true, requires: { level: 7 },
      desc: 'Clean energy +12. No noise for guests.' },
    { id: 'pool', name: 'Resort Pool', icon: '🏊', cost: 1400, income: 150, power: -2, guests: 45, tier: 2, requires: { level: 8, rep: 30 },
      desc: 'Huge outdoor pool with a bar. A VIP favourite.' },
    { id: 'gardens', name: 'Gardens', icon: '🌳', cost: 1200, income: 90, power: -1, guests: 35, tier: 2, requires: { level: 9, rep: 25 },
      desc: 'Botanical gardens. Lift guest mood and clean the air.' },
    { id: 'cinema', name: 'IMAX Cinema', icon: '🎬', cost: 1500, income: 165, power: -2, guests: 40, tier: 3, requires: { level: 5, rep: 20 },
      desc: 'Massive screen. Packs the evening hours.' },
    { id: 'mall', name: 'Shopping Mall', icon: '🛍️', cost: 1800, income: 190, power: -3, guests: 55, tier: 3, requires: { level: 6, rep: 30 },
      desc: 'Luxury mall. VIPs spend a lot here.' },
    { id: 'aquarium', name: 'Aquarium', icon: '🐠', cost: 2000, income: 205, power: -3, guests: 50, tier: 3, requires: { level: 8, rep: 35 },
      desc: 'Aquarium with rays. Family attraction.' },
    { id: 'powerplant', name: 'Power Plant', icon: '🔌', cost: 2200, income: 40, power: 26, guests: -8, tier: 3, isGenerator: true, requires: { level: 14 },
      desc: 'Small power station producing +26 Power.' },
    { id: 'marina', name: 'Marina', icon: '⛵', cost: 2800, income: 240, power: -3, guests: 55, tier: 3, requires: { level: 11, rep: 50 },
      desc: 'Luxury marina with yachts. Attracts wealthy guests.' },
    { id: 'golf', name: 'Golf Course', icon: '🏌️', cost: 2600, income: 250, power: -3, guests: 45, tier: 3, requires: { level: 10, rep: 45 },
      desc: '18-hole course. A place for business people.' },
    { id: 'ferris', name: 'Ferris Wheel', icon: '🎡', cost: 2400, income: 210, power: -3, guests: 60, tier: 3, requires: { level: 12, rep: 55 },
      desc: 'Giant wheel lighting up the Strip at night.' },
    { id: 'rollercoaster', name: 'Roller Coaster', icon: '🎢', cost: 3400, income: 330, power: -4, guests: 80, tier: 4, requires: { level: 12, rep: 55 },
      desc: 'Wild looping coaster. Queues from morning.' },
    { id: 'convention', name: 'Convention Center', icon: '🏢', cost: 3600, income: 300, power: -5, guests: 90, tier: 4, requires: { level: 15, rep: 60 },
      desc: 'Convention center. Fills hotels with events.' },
    { id: 'stadium', name: 'Arena', icon: '🏟️', cost: 4200, income: 420, power: -6, guests: 120, tier: 4, requires: { level: 18, rep: 70, prestige: 1 },
      desc: 'Arena for concerts and fights. Draws big crowds.' },
    { id: 'helipad', name: 'Helipad', icon: '🚁', cost: 4200, income: 360, power: -4, guests: 70, tier: 4, requires: { level: 18, rep: 70, prestige: 1 },
      desc: 'Helipad for high rollers. Arrive in style.' },
    { id: 'observatory', name: 'Observatory', icon: '🔭', cost: 5200, income: 460, power: -6, guests: 100, tier: 5, requires: { level: 22, rep: 80, prestige: 2 },
      desc: 'Skyscraper with a 360 view. The symbol of your resort.' },
    { id: 'statue', name: 'Statue of Liberty', icon: '🗽', cost: 4200, income: 380, power: -4, guests: 80, tier: 3, isLandmark: true, themeOnly: 'american', requires: { level: 6 },
      desc: 'American landmark. The icon of the lot.' },
    { id: 'titanic', name: 'Casino Titanic', icon: '🚢', cost: 4600, income: 420, power: -4, guests: 90, tier: 3, isLandmark: true, themeOnly: 'ocean', requires: { level: 6 },
      desc: 'Legendary ship casino. Needs the ocean around it.' },
    { id: 'rocket', name: 'Space Rocket', icon: '🚀', cost: 4400, income: 400, power: -5, guests: 85, tier: 3, isLandmark: true, themeOnly: 'space', requires: { level: 6 },
      desc: 'Rocket on the launchpad. Space attraction.' },
    { id: 'trex', name: 'T-Rex', icon: '🦖', cost: 4300, income: 390, power: -3, guests: 88, tier: 3, isLandmark: true, themeOnly: 'prehistoric', requires: { level: 6 },
      desc: 'A living dinosaur. Terror and spectacle.' },
    { id: 'pagoda', name: 'Pagoda', icon: '🏯', cost: 4500, income: 410, power: -4, guests: 84, tier: 3, isLandmark: true, themeOnly: 'oriental', requires: { level: 6 },
      desc: 'Colourful pagoda with lanterns.' },
    { id: 'pyramid', name: 'Pyramid', icon: '🛕', cost: 4700, income: 430, power: -5, guests: 92, tier: 3, isLandmark: true, themeOnly: 'egyptian', requires: { level: 6 },
      desc: 'Golden pyramid with a glowing peak.' },
    { id: 'saloon', name: 'Saloon', icon: '🤠', cost: 3900, income: 360, power: -3, guests: 76, tier: 3, isLandmark: true, themeOnly: 'western', requires: { level: 6 },
      desc: 'Wild West saloon with live shows.' },
    { id: 'volcano', name: 'Volcano', icon: '🌋', cost: 4800, income: 440, power: -4, guests: 95, tier: 3, isLandmark: true, themeOnly: 'tropical', requires: { level: 6 },
      desc: 'An active volcano attraction.' },
    { id: 'castle', name: 'Castle', icon: '🏰', cost: 4600, income: 415, power: -4, guests: 86, tier: 3, isLandmark: true, themeOnly: 'medieval', requires: { level: 6 },
      desc: 'Medieval castle with tournaments.' },
    { id: 'robot', name: 'Giant Robot', icon: '🤖', cost: 4900, income: 455, power: -5, guests: 98, tier: 3, isLandmark: true, themeOnly: 'futuristic', requires: { level: 6 },
      desc: 'Holographic guardian robot.' },
    { id: 'path_concrete', name: 'Concrete Path', icon: '⬜', cost: 20, income: 0, power: 0, guests: 0, tier: 1, isPath: true,
      desc: 'Cheap concrete walkway. Guests can only walk on paths.' },
    { id: 'path_pavement', name: 'Pavement', icon: '🔲', cost: 80, income: 0, power: 0, guests: 0, tier: 2, isPath: true, requires: { level: 4 },
      desc: 'Fancy paved walkway. Guests walk on it and it looks much better.' }
  ],
  interior: [
    { id: 'slots', name: 'Slots', icon: '🍒', cost: 350, income: 75, power: -1, guests: 10, noisy: true, tier: 1,
      desc: 'A row of slot machines. Loud for the VIP tables!' },
    { id: 'roulette', name: 'Roulette', icon: '🎡', cost: 600, income: 120, power: -1, guests: 14, tier: 1,
      desc: 'Roulette table. Rotate it to fit the walkway.' },
    { id: 'vip_bj', name: 'VIP Blackjack', icon: '🃏', cost: 1100, income: 260, power: -1, guests: 8, isVip: true, tier: 1,
      desc: 'High-roller table. Loses 50% income next to Slots without a VIP Wall.' },
    { id: 'wall', name: 'VIP Wall', icon: '🧱', cost: 150, income: 0, power: 0, guests: 2, isWall: true, tier: 1,
      desc: 'Golden soundproof wall. Rotate 90 for horizontal or vertical.' },
    { id: 'security', name: 'Security', icon: '🛡️', cost: 500, income: -10, power: -1, guests: 5, isSecurity: true, tier: 1,
      desc: 'Security station with cameras. +35% income for nearby tables.' },
    { id: 'cashier', name: 'Cashier', icon: '💵', cost: 400, income: 40, power: -1, guests: 5, tier: 2, requires: { level: 4 },
      desc: 'Main cashier. Improves guest flow.' },
    { id: 'keno', name: 'Keno', icon: '🔢', cost: 700, income: 110, power: -1, guests: 12, tier: 2, requires: { level: 6 },
      desc: 'Keno game with screens. Fast and simple.' },
    { id: 'bar', name: 'Bar', icon: '🍸', cost: 700, income: 90, power: -1, guests: 25, tier: 2, requires: { level: 6, rep: 20 },
      desc: 'Cocktail bar. Keeps the crowd awake.' },
    { id: 'poker', name: 'Poker', icon: '♠️', cost: 850, income: 150, power: -1, guests: 12, tier: 2, requires: { level: 9, rep: 25 },
      desc: 'Dealt poker table. Steady profit.' },
    { id: 'sicbo', name: 'Sic Bo', icon: '🎯', cost: 900, income: 160, power: -1, guests: 11, noisy: true, tier: 2, requires: { level: 8, rep: 28 },
      desc: 'Sic Bo dice table. Noisy but profitable.' },
    { id: 'craps', name: 'Craps', icon: '🎲', cost: 950, income: 175, power: -1, guests: 13, noisy: true, tier: 2, requires: { level: 10, rep: 25 },
      desc: 'Craps table. Very noisy.' },
    { id: 'baccarat', name: 'Baccarat', icon: '🎴', cost: 1000, income: 180, power: -1, guests: 10, tier: 2, requires: { level: 9, rep: 30 },
      desc: 'The VIP first choice. High stakes.' },
    { id: 'giftshop', name: 'Gift Shop', icon: '🎁', cost: 800, income: 95, power: -1, guests: 20, tier: 2, requires: { level: 11, rep: 35 },
      desc: 'Souvenir shop. Small but steady profit.' },
    { id: 'lounge', name: 'VIP Lounge', icon: '🛋️', cost: 1100, income: 130, power: -1, guests: 30, tier: 3, requires: { level: 10, rep: 40 },
      desc: 'VIP cigar lounge. Quiet and prestigious.' },
    { id: 'cage', name: 'Cash Cage', icon: '🔐', cost: 1200, income: 90, power: -1, guests: 8, tier: 3, requires: { level: 12 },
      desc: 'Armoured cash cage. Improves security.' },
    { id: 'sportsbook', name: 'Sportsbook', icon: '🏈', cost: 1300, income: 200, power: -2, guests: 30, tier: 3, requires: { level: 14, rep: 35 },
      desc: 'Sportsbook with giant screens.' },
    { id: 'buffet', name: 'Buffet', icon: '🍤', cost: 1000, income: 100, power: -2, guests: 35, tier: 3, requires: { level: 16, rep: 45 },
      desc: 'All-you-can-eat buffet. Huge crowds.' },
    { id: 'foodcourt', name: 'Food Court', icon: '🍕', cost: 1500, income: 170, power: -2, guests: 50, tier: 3, requires: { level: 17, rep: 60 },
      desc: 'Many restaurants in one space.' },
    { id: 'spa', name: 'Spa', icon: '💆', cost: 1600, income: 150, power: -2, guests: 45, tier: 3, requires: { level: 13, rep: 50 },
      desc: 'Luxury spa. Relaxes the VIPs.' },
    { id: 'nightclub', name: 'Nightclub', icon: '🪩', cost: 2000, income: 220, power: -2, guests: 60, noisy: true, tier: 4, requires: { level: 16, rep: 55 },
      desc: 'DJ club. Noise and lots of profit at night.' },
    { id: 'highlimit', name: 'High Limit', icon: '💰', cost: 2600, income: 420, power: -2, guests: 12, isVip: true, tier: 4, requires: { level: 20, rep: 65, prestige: 1 },
      desc: 'High Limit room. Only for the mega-rich.' },
    { id: 'boxing', name: 'Boxing Ring', icon: '🥊', cost: 3000, income: 380, power: -3, guests: 70, noisy: true, tier: 4, requires: { level: 24, rep: 75, prestige: 2 },
      desc: 'Fight ring inside the casino. Show and betting.' },
    { id: 'vault', name: 'Gold Vault', icon: '🏦', cost: 4000, income: 520, power: -3, guests: 20, tier: 5, requires: { level: 28, rep: 85, prestige: 3 },
      desc: 'Legendary vault. The ultimate prestige.' },
    { id: 'restroom', name: 'Restrooms', icon: '🚻', cost: 300, income: 15, power: -1, guests: 6, tier: 1, isRestroom: true,
      desc: 'Necessary restrooms. They smell bad - keep them away from VIP tables.' },
    { id: 'plants', name: 'Plants', icon: '🌿', cost: 120, income: 0, power: 0, guests: 3, tier: 1, isDecor: true,
      desc: 'Decoration plants. Clean the air and reduce smell around them.' }
  ]
};

export function findItem(world, id) {
  const list = CATALOG[world];
  if (!list) return null;
  return list.find(x => x.id === id) || null;
}

export function allItems() {
  return [...CATALOG.exterior, ...CATALOG.interior];
}

export function isUnlocked(item, state) {
  if (!item.requires) return true;
  const r = item.requires;
  if (r.level != null && state.level < r.level) return false;
  if (r.rep != null && state.reputation < r.rep) return false;
  if (r.prestige != null && state.prestigeLevel < r.prestige) return false;
  if (r.day != null && state.clock.day < r.day) return false;
  return true;
}

export function lockLabel(item) {
  if (!item.requires) return '';
  const parts = [];
  if (item.requires.level != null) parts.push(`Lv.${item.requires.level}`);
  if (item.requires.rep != null) parts.push(`Rep ${item.requires.rep}`);
  if (item.requires.prestige != null) parts.push(`Prestige ${item.requires.prestige}`);
  if (item.requires.day != null) parts.push(`Day ${item.requires.day}`);
  return parts.join(' • ');
}
