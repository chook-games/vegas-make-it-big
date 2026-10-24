export const DESIRES = {
  gambling: { name: 'Gambling', icon: '🎰' },
  drink: { name: 'Drink', icon: '🍸' },
  entertainment: { name: 'Entertainment', icon: '🎬' },
  toilet: { name: 'Toilet', icon: '🚻' },
  rest: { name: 'Rest', icon: '🛋️' },
  food: { name: 'Food', icon: '🍽️' },
  activity: { name: 'Activity', icon: '🎡' },
  shopping: { name: 'Shopping', icon: '🛍️' },
  sleep: { name: 'Sleep', icon: '🛏️' },
  money: { name: 'Money', icon: '💵' }
};

const VENUE_LIST = {
  gambling: ['slots', 'roulette', 'craps', 'sicbo', 'keno', 'baccarat', 'poker', 'sportsbook', 'vip_bj', 'highlimit', 'casino',
    'videopoker', 'blackjack', 'wheeloffortune', 'carjackpot', 'progressiveslots', 'texasholdem', 'paigow', 'caribbeanstud',
    'mediumcasino', 'largecasino'],
  drink: ['bar', 'lounge', 'nightclub'],
  entertainment: ['cinema', 'stadium', 'boxing', 'nightclub', 'theatre', 'circus'],
  toilet: ['restroom'],
  rest: ['lounge', 'gardens', 'pool', 'wavepool'],
  food: ['restaurant', 'buffet', 'foodcourt'],
  activity: ['pool', 'golf', 'ferris', 'rollercoaster', 'aquarium', 'gardens', 'marina', 'cinema',
    'wavepool', 'waterride', 'tennisclub', 'arcade', 'circus'],
  shopping: ['mall', 'giftshop', 'jewelrystore'],
  sleep: ['hotel', 'mediumhotel', 'largehotel'],
  money: ['cashier', 'cage', 'atm']
};

const SETS = {};
for (const k in VENUE_LIST) SETS[k] = new Set(VENUE_LIST[k]);

export function venueSet(desire) {
  return SETS[desire] || new Set();
}

export function desireIcon(desire) {
  return (DESIRES[desire] && DESIRES[desire].icon) || '❓';
}

export function desireName(desire) {
  return (DESIRES[desire] && DESIRES[desire].name) || desire;
}
