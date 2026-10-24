export const SCENARIOS = [
  {
    id: 's1', title: 'Welcome to The Strip', theme: 'american', startCash: 12000,
    desc: 'The tutorial scenario: build a motel, lay paths, set up maintenance, then open the casino and its first games.',
    targetDays: 2, reward: { cash: 3000 },
    goals: [
      { type: 'build', target: 'motel', label: 'Build a Motel' },
      { type: 'paths', target: 5, label: 'Lay 5 path tiles' },
      { type: 'build', target: 'headoffice', label: 'Build the Head Office' },
      { type: 'upgradeBuilding', target: 'headoffice', label: 'Upgrade the Head Office' },
      { type: 'build', target: 'mechhut', label: 'Build a Mechanic Hut' },
      { type: 'build', target: 'elechut', label: 'Build an Electrical Hut' },
      { type: 'build', target: 'casino', label: 'Build a Casino' },
      { type: 'build', target: 'slots', label: 'Build a Slot Machine' },
      { type: 'build', target: 'cashier', label: 'Build a Cash Desk' },
      { type: 'cashierVisit', target: 1, label: 'A guest uses the cashier' },
      { type: 'build', target: 'poker', label: 'Build a Poker Table' },
      { type: 'pokerAdjusted', target: 1, label: 'Adjust the Poker table odds' },
      { type: 'build', target: 'security', label: 'Build Security' },
      { type: 'stairs', target: 1, label: 'Place Stairs' },
      { type: 'upperBuilt', target: 1, label: 'Build on the Upper floor' }
    ]
  },
  {
    id: 's2', title: 'King of the Hill', theme: 'egyptian', startCash: 6000,
    desc: 'Open a small casino, advertise it and pull in the gamblers.',
    targetDays: 4, reward: { cash: 6000 },
    goals: [
      { type: 'build', target: 'casino', label: 'Build a Casino' },
      { type: 'build', target: 'slots', label: 'Add Slot Machines' },
      { type: 'lotBuildings', target: 6, label: '6 buildings on the lot' },
      { type: 'guests', target: 80, label: '80 guests' }
    ]
  },
  {
    id: 's3', title: 'Top of the Heap', theme: 'prehistoric', startCash: 8000,
    desc: 'Rise above the rest: profit, entertainment and grand fountains.',
    targetDays: 5, reward: { cash: 12000, gold: 1 },
    goals: [
      { type: 'build', target: 'fountain', label: 'Build a Fountain' },
      { type: 'build', target: 'cinema', label: 'Build Entertainment (Cinema)' },
      { type: 'lotBuildings', target: 10, label: '10 buildings on the lot' },
      { type: 'cash', target: 120000, label: 'Cash $120,000' }
    ]
  },
  {
    id: 's4', title: 'Big Spenders', theme: 'american', startCash: 10000,
    desc: 'A large hotel, a second lot and the biggest crowd on the Strip.',
    targetDays: 5, reward: { cash: 20000 },
    goals: [
      { type: 'build', target: 'hotel', label: 'Build a Hotel' },
      { type: 'lots', target: 2, label: 'Own 2 lots' },
      { type: 'guests', target: 200, label: '200 guests' },
      { type: 'rep', target: 40, label: 'Reputation 40' }
    ]
  },
  {
    id: 's5', title: 'Convention Season', theme: 'oriental', startCash: 15000,
    desc: 'Conventions fill the town. Add craps and restaurants to feed the crowd.',
    targetDays: 6, reward: { cash: 35000, gold: 2 },
    goals: [
      { type: 'build', target: 'craps', label: 'Build a Craps Table' },
      { type: 'build', target: 'restaurant', label: 'Build a Restaurant' },
      { type: 'guests', target: 260, label: '260 guests' },
      { type: 'rep', target: 50, label: 'Reputation 50' }
    ]
  },
  {
    id: 's6', title: 'High Hopes', theme: 'ocean', startCash: 20000,
    desc: 'High rollers and whales. Build the VIP tables and a second lot.',
    targetDays: 6, reward: { cash: 60000 },
    goals: [
      { type: 'countBuild', target: 'vip_bj', amount: 2, label: '2 VIP Blackjack tables' },
      { type: 'lots', target: 2, label: 'Own 2 lots' },
      { type: 'guests', target: 350, label: '350 guests' },
      { type: 'rep', target: 60, label: 'Reputation 60' }
    ]
  },
  {
    id: 's7', title: 'All Shook Up', theme: 'space', startCash: 25000,
    desc: 'Family fun: rollercoaster, pool and a space-age resort.',
    targetDays: 7, reward: { cash: 90000, gold: 2 },
    goals: [
      { type: 'build', target: 'rollercoaster', label: 'Build a Roller Coaster' },
      { type: 'build', target: 'pool', label: 'Build a Resort Pool' },
      { type: 'level', target: 14, label: 'Level 14' },
      { type: 'cash', target: 320000, label: 'Cash $320,000' }
    ]
  },
  {
    id: 's8', title: 'Shop til you Drop', theme: 'medieval', startCash: 30000,
    desc: 'Retail therapy: mall, gift shops and wedding chapels.',
    targetDays: 7, reward: { cash: 130000 },
    goals: [
      { type: 'build', target: 'mall', label: 'Build a Shopping Mall' },
      { type: 'build', target: 'giftshop', label: 'Build a Gift Shop' },
      { type: 'build', target: 'chapel', label: 'Build a Wedding Chapel' },
      { type: 'rep', target: 65, label: 'Reputation 65' }
    ]
  },
  {
    id: 's9', title: 'The Ace of Clubs', theme: 'tropical', startCash: 40000,
    desc: 'Best nightlife on the Strip: clubs, fights and big money.',
    targetDays: 8, reward: { cash: 220000, gold: 3 },
    goals: [
      { type: 'build', target: 'nightclub', label: 'Build a Nightclub' },
      { type: 'build', target: 'boxing', label: 'Build a Boxing Ring' },
      { type: 'cash', target: 800000, label: 'Cash $800,000' },
      { type: 'rep', target: 75, label: 'Reputation 75' }
    ]
  },
  {
    id: 's10', title: 'Viva Las Vegas', theme: 'futuristic', startCash: 60000,
    desc: 'The final show. Arena, chapel, crowds and the Emperor title.',
    targetDays: 9, reward: { cash: 600000, gold: 5 },
    goals: [
      { type: 'build', target: 'stadium', label: 'Build the Arena' },
      { type: 'build', target: 'chapel', label: 'Build a Wedding Chapel' },
      { type: 'guests', target: 500, label: '500 guests' },
      { type: 'rep', target: 85, label: 'Reputation 85' },
      { type: 'level', target: 20, label: 'Level 20' }
    ]
  }
];

export const MAX_STARS = 3;

export const CAMPAIGN_THEME_UNLOCKS = [
  'Stars & Stripes', 'Greece', 'Mayan', 'Stars & Stripes', 'India',
  'Nautical', 'Space', 'London', 'Lost World', 'Japan'
];
