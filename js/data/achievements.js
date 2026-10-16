function totalBuildings(s) {
  return Object.keys(s.exteriorGrid).length + Object.keys(s.interiorGrid).length;
}
function countIn(grid, id) {
  let n = 0;
  for (const k in grid) if (grid[k].item.id === id) n++;
  return n;
}

export const ACHIEVEMENTS = [
  { id: 'a_first', title: 'The First Brick', icon: '🧱', desc: 'Build your first building.', reward: { cash: 200 }, check: s => totalBuildings(s) >= 1 },
  { id: 'a_builder10', title: 'Contractor', icon: '🏗️', desc: 'Build 10 buildings.', reward: { cash: 1000 }, check: s => totalBuildings(s) >= 10 },
  { id: 'a_builder30', title: 'Emperor', icon: '🏙️', desc: 'Build 30 buildings.', reward: { cash: 5000 }, check: s => totalBuildings(s) >= 30 },
  { id: 'a_cash100k', title: 'Millionaire', icon: '💰', desc: 'Reach $100,000.', reward: { cash: 10000 }, check: s => s.cash >= 100000 },
  { id: 'a_cash1m', title: 'Midas', icon: '🪙', desc: 'Reach $1,000,000.', reward: { cash: 100000 }, check: s => s.cash >= 1000000 },
  { id: 'a_rep50', title: 'Respected', icon: '🎖️', desc: 'Reach Reputation 50.', reward: { cash: 3000 }, check: s => s.reputation >= 50 },
  { id: 'a_rep100', title: 'Vegas Legend', icon: '🌟', desc: 'Reach Reputation 100.', reward: { cash: 15000 }, check: s => s.reputation >= 100 },
  { id: 'a_slots10', title: 'Slots Everywhere', icon: '🍒', desc: 'Have 10 Slots at once.', reward: { cash: 2500 }, check: s => countIn(s.interiorGrid, 'slots') >= 10 },
  { id: 'a_vip5', title: 'VIP Club', icon: '🃏', desc: 'Have 5 VIP Blackjack tables.', reward: { cash: 8000 }, check: s => countIn(s.interiorGrid, 'vip_bj') >= 5 },
  { id: 'a_gen', title: 'Power Up', icon: '⚡', desc: 'Build 4 generators.', reward: { cash: 1500 }, check: s => countIn(s.exteriorGrid, 'generator') >= 4 },
  { id: 'a_firstday', title: 'Good Morning Vegas', icon: '🌅', desc: 'Complete your first day.', reward: { cash: 500 }, check: s => s.clock.day >= 2 },
  { id: 'a_week', title: 'Full Week', icon: '📅', desc: 'Survive 7 days.', reward: { cash: 5000 }, check: s => s.clock.day >= 8 },
  { id: 'a_prestige1', title: 'Back to the Start', icon: '💎', desc: 'Do your first Prestige.', reward: { cash: 5000 }, check: s => s.prestigeLevel >= 1 },
  { id: 'a_level10', title: 'Rising Star', icon: '🆙', desc: 'Reach Level 10.', reward: { cash: 2000 }, check: s => s.level >= 10 },
  { id: 'a_level25', title: 'Top Dog', icon: '🚀', desc: 'Reach Level 25.', reward: { cash: 25000 }, check: s => s.level >= 25 },
  { id: 'a_staff5', title: 'The Boss', icon: '👔', desc: 'Hire 5 staff.', reward: { cash: 3000 }, check: s => Object.values(s.staff || {}).reduce((a, b) => a + b, 0) >= 5 },
  { id: 'a_staff15', title: 'Empire', icon: '🏢', desc: 'Hire 15 staff.', reward: { cash: 12000 }, check: s => Object.values(s.staff || {}).reduce((a, b) => a + b, 0) >= 15 },
  { id: 'a_plot', title: 'Expansionist', icon: '🗺️', desc: 'Buy a map expansion plot.', reward: { cash: 4000 }, check: s => s.plots >= 1 },
  { id: 'a_plot3', title: 'Land Baron', icon: '🌐', desc: 'Expand the map 3 times.', reward: { cash: 20000 }, check: s => s.plots >= 3 },
  { id: 'a_gold', title: 'Golden Pockets', icon: '💎', desc: 'Collect 10 gold.', reward: { cash: 8000 }, check: s => s.gold >= 10 },
  { id: 'a_lot2', title: 'Strip Tycoon', icon: '🏙️', desc: 'Buy a second lot.', reward: { cash: 8000 }, check: s => (s.lots ? s.lots.length : 1) >= 2 },
  { id: 'a_lot4', title: 'Strip Emperor', icon: '🌆', desc: 'Buy 4 lots.', reward: { cash: 40000 }, check: s => (s.lots ? s.lots.length : 1) >= 4 }
];
