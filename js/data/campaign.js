export const SCENARIOS = [
  {
    id: 's1', title: 'Welcome to Vegas', theme: 'american', startCash: 5000,
    desc: 'Your first lot. Set up a small but profitable resort.',
    targetDays: 3, reward: { cash: 3000 },
    goals: [
      { type: 'cash', target: 8000, label: 'Cash $8,000' },
      { type: 'lotBuildings', target: 3, label: '3 buildings on the lot' }
    ]
  },
  {
    id: 's2', title: 'Ocean & Titanic', theme: 'ocean', startCash: 6000,
    desc: 'A new lot by the sea. Build the legendary ship casino.',
    targetDays: 4, reward: { cash: 6000 },
    goals: [
      { type: 'landmark', target: 'titanic', label: 'Build Casino Titanic' },
      { type: 'lotBuildings', target: 6, label: '6 buildings on the lot' },
      { type: 'rep', target: 25, label: 'Reputation 25' }
    ]
  },
  {
    id: 's3', title: 'Space Boulevard', theme: 'space', startCash: 8000,
    desc: 'The universe awaits. Level up and raise capital.',
    targetDays: 5, reward: { cash: 12000, gold: 1 },
    goals: [
      { type: 'level', target: 6, label: 'Level 6' },
      { type: 'cash', target: 60000, label: 'Cash $60,000' }
    ]
  },
  {
    id: 's4', title: 'Prehistoric Park', theme: 'prehistoric', startCash: 10000,
    desc: 'Dinosaurs and crowds. Fill the park with attractions.',
    targetDays: 5, reward: { cash: 20000 },
    goals: [
      { type: 'lotBuildings', target: 8, label: '8 buildings on the lot' },
      { type: 'guests', target: 150, label: '150 guests' }
    ]
  },
  {
    id: 's5', title: 'Oriental Charm', theme: 'oriental', startCash: 15000,
    desc: 'Luxury and staff. Build reputation and hire a team.',
    targetDays: 6, reward: { cash: 35000, gold: 2 },
    goals: [
      { type: 'rep', target: 45, label: 'Reputation 45' },
      { type: 'lotBuildings', target: 10, label: '10 buildings on the lot' },
      { type: 'staff', target: 8, label: '8 staff hired' }
    ]
  },
  {
    id: 's6', title: 'Golden Egypt', theme: 'egyptian', startCash: 20000,
    desc: 'An empire across many lots. Open new ones.',
    targetDays: 6, reward: { cash: 60000 },
    goals: [
      { type: 'cash', target: 250000, label: 'Cash $250,000' },
      { type: 'lots', target: 3, label: '3 lots' }
    ]
  },
  {
    id: 's7', title: 'Wild West', theme: 'western', startCash: 25000,
    desc: 'You are the law. Grow the resort and hit a level.',
    targetDays: 7, reward: { cash: 90000, gold: 2 },
    goals: [
      { type: 'lotBuildings', target: 12, label: '12 buildings on the lot' },
      { type: 'level', target: 12, label: 'Level 12' }
    ]
  },
  {
    id: 's8', title: 'Tropical Paradise', theme: 'tropical', startCash: 30000,
    desc: 'Tourist crowds. Fill the island and build reputation.',
    targetDays: 7, reward: { cash: 130000 },
    goals: [
      { type: 'guests', target: 320, label: '320 guests' },
      { type: 'rep', target: 60, label: 'Reputation 60' }
    ]
  },
  {
    id: 's9', title: 'Medieval Kingdom', theme: 'medieval', startCash: 40000,
    desc: 'Castles and treasure. Huge capital and a staff army.',
    targetDays: 8, reward: { cash: 220000, gold: 3 },
    goals: [
      { type: 'cash', target: 800000, label: 'Cash $800,000' },
      { type: 'staff', target: 15, label: '15 staff hired' }
    ]
  },
  {
    id: 's10', title: 'Neon Future', theme: 'futuristic', startCash: 60000,
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
