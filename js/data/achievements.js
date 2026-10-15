function totalBuildings(s) {
  return Object.keys(s.exteriorGrid).length + Object.keys(s.interiorGrid).length;
}
function countIn(grid, id) {
  let n = 0;
  for (const k in grid) if (grid[k].item.id === id) n++;
  return n;
}

export const ACHIEVEMENTS = [
  { id: 'a_first', title: 'Το Πρώτο Τούβλο', icon: '🧱', desc: 'Χτίσε το πρώτο σου κτίριο.', reward: { cash: 200 }, check: s => totalBuildings(s) >= 1 },
  { id: 'a_builder10', title: 'Εργολάβος', icon: '🏗️', desc: 'Χτίσε 10 κτίρια.', reward: { cash: 1000 }, check: s => totalBuildings(s) >= 10 },
  { id: 'a_builder30', title: 'Αυτοκράτορας', icon: '🏙️', desc: 'Χτίσε 30 κτίρια.', reward: { cash: 5000 }, check: s => totalBuildings(s) >= 30 },
  { id: 'a_cash100k', title: 'Εκατομμυριούχος', icon: '💰', desc: 'Φτάσε τα $100,000.', reward: { cash: 10000 }, check: s => s.cash >= 100000 },
  { id: 'a_cash1m', title: 'Μίδας', icon: '🪙', desc: 'Φτάσε το $1,000,000.', reward: { cash: 100000 }, check: s => s.cash >= 1000000 },
  { id: 'a_rep50', title: 'Αξιοσέβαστος', icon: '🎖️', desc: 'Φτάσε Φήμη 50.', reward: { cash: 3000 }, check: s => s.reputation >= 50 },
  { id: 'a_rep100', title: 'Θρύλος της Vegas', icon: '🌟', desc: 'Φτάσε Φήμη 100.', reward: { cash: 15000 }, check: s => s.reputation >= 100 },
  { id: 'a_slots10', title: 'Τζόγος Παντού', icon: '🍒', desc: 'Έχε 10 Slots ταυτόχρονα.', reward: { cash: 2500 }, check: s => countIn(s.interiorGrid, 'slots') >= 10 },
  { id: 'a_vip5', title: 'Λέσχη VIP', icon: '🃏', desc: 'Έχε 5 τραπέζια VIP Blackjack.', reward: { cash: 8000 }, check: s => countIn(s.interiorGrid, 'vip_bj') >= 5 },
  { id: 'a_gen', title: 'Παραγωγή', icon: '⚡', desc: 'Χτίσε 4 γεννήτριες.', reward: { cash: 1500 }, check: s => countIn(s.exteriorGrid, 'generator') >= 4 },
  { id: 'a_firstday', title: 'Καλημέρα Vegas', icon: '🌅', desc: 'Ολοκλήρωσε την πρώτη σου μέρα.', reward: { cash: 500 }, check: s => s.clock.day >= 2 },
  { id: 'a_week', title: 'Πλήρης Εβδομάδα', icon: '📅', desc: 'Επιβίωσε 7 μέρες.', reward: { cash: 5000 }, check: s => s.clock.day >= 8 },
  { id: 'a_prestige1', title: 'Ξανά από την Αρχή', icon: '💎', desc: 'Κάνε το πρώτο σου Prestige.', reward: { cash: 5000 }, check: s => s.prestigeLevel >= 1 }
];
