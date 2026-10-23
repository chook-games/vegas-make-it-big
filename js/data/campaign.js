export const SCENARIOS = [
  {
    id: 's1', title: 'Welcome to The Strip', theme: 'american', startCash: 5000,
    desc: 'Your first lot. Learn the ropes: buy land, build a motel and attract your first guests.',
    targetDays: 2, reward: { cash: 3000 },
    goals: [
      { type: 'lotBuildings', target: 3, label: '3 buildings on the lot' },
      { type: 'guests', target: 30, label: '30 guests' }
    ]
  },
  {
    id: 's2', title: 'King of the Hill', theme: 'egyptian', startCash: 6000,
    desc: 'Out-build the competition and claim the high ground on the Strip.',
    targetDays: 4, reward: { cash: 6000 },
    goals: [
      { type: 'lotBuildings', target: 6, label: '6 buildings on the lot' },
      { type: 'rep', target: 25, label: 'Reputation 25' }
    ]
  },
  {
    id: 's3', title: 'Top of the Heap', theme: 'prehistoric', startCash: 8000,
    desc: 'A jungle-themed resort. Rise to the top of the heap.',
    targetDays: 5, reward: { cash: 12000, gold: 1 },
    goals: [
      { type: 'level', target: 6, label: 'Level 6' },
      { type: 'cash', target: 60000, label: 'Cash $60,000' }
    ]
  },
  {
    id: 's4', title: 'Big Spenders', theme: 'american', startCash: 10000,
    desc: 'Attract the high rollers and separate them from their money.',
    targetDays: 5, reward: { cash: 20000 },
    goals: [
      { type: 'lotBuildings', target: 8, label: '8 buildings on the lot' },
      { type: 'guests', target: 150, label: '150 guests' }
    ]
  },
  {
    id: 's5', title: 'Convention Season', theme: 'oriental', startCash: 15000,
    desc: 'Conventions fill the hotels. Build capacity and reputation.',
    targetDays: 6, reward: { cash: 35000, gold: 2 },
    goals: [
      { type: 'rep', target: 45, label: 'Reputation 45' },
      { type: 'lotBuildings', target: 10, label: '10 buildings on the lot' },
      { type: 'staff', target: 8, label: '8 staff hired' }
    ]
  },
  {
    id: 's6', title: 'High Hopes', theme: 'ocean', startCash: 20000,
    desc: 'Expand across several lots and reach for the sky.',
    targetDays: 6, reward: { cash: 60000 },
    goals: [
      { type: 'cash', target: 250000, label: 'Cash $250,000' },
      { type: 'lots', target: 3, label: '3 lots' }
    ]
  },
  {
    id: 's7', title: 'All Shook Up', theme: 'space', startCash: 25000,
    desc: 'A space-age spectacle. Grow the resort and level up.',
    targetDays: 7, reward: { cash: 90000, gold: 2 },
    goals: [
      { type: 'lotBuildings', target: 12, label: '12 buildings on the lot' },
      { type: 'level', target: 12, label: 'Level 12' }
    ]
  },
  {
    id: 's8', title: 'Shop til you Drop', theme: 'medieval', startCash: 30000,
    desc: 'Retail therapy for the masses. Fill the lot and build fame.',
    targetDays: 7, reward: { cash: 130000 },
    goals: [
      { type: 'guests', target: 320, label: '320 guests' },
      { type: 'rep', target: 60, label: 'Reputation 60' }
    ]
  },
  {
    id: 's9', title: 'The Ace of Clubs', theme: 'tropical', startCash: 40000,
    desc: 'The premier club on the Strip. Huge capital and a full team.',
    targetDays: 8, reward: { cash: 220000, gold: 3 },
    goals: [
      { type: 'cash', target: 800000, label: 'Cash $800,000' },
      { type: 'staff', target: 15, label: '15 staff hired' }
    ]
  },
  {
    id: 's10', title: 'Viva Las Vegas', theme: 'futuristic', startCash: 60000,
    desc: 'The final stage. Become the Emperor of Vegas.',
    targetDays: 9, reward: { cash: 600000, gold: 5 },
    goals: [
      { type: 'rep', target: 85, label: 'Reputation 85' },
      { type: 'lotBuildings', target: 16, label: '16 buildings on the lot' },
      { type: 'level', target: 20, label: 'Level 20' }
    ]
  }
];

export const MAX_STARS = 3;

export const CAMPAIGN_THEME_UNLOCKS = [
  'Stars & Stripes', 'Greece', 'Mayan', 'Stars & Stripes', 'India',
  'Nautical', 'Space', 'London', 'Lost World', 'Japan'
];
