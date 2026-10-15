function countIn(grid, id) {
  let n = 0;
  for (const k in grid) if (grid[k].item.id === id) n++;
  return n;
}

function totalBuildings(state) {
  return Object.keys(state.exteriorGrid).length + Object.keys(state.interiorGrid).length;
}

function clampProgress(cur, target) {
  return { current: Math.min(cur, target), target };
}

export const QUESTS = [
  {
    id: 'q_hotel', title: 'Ξεκίνα το Resort', icon: '🏨',
    desc: 'Χτίσε το πρώτο σου Ξενοδοχείο στο Strip.',
    reward: { cash: 600 },
    goal: s => countIn(s.exteriorGrid, 'hotel') >= 1,
    progress: s => clampProgress(countIn(s.exteriorGrid, 'hotel'), 1)
  },
  {
    id: 'q_casino', title: 'Άνοιξε Καζίνο', icon: '🎰',
    desc: 'Χτίσε ένα Καζίνο στην έξοδο του Resort.',
    reward: { cash: 800 },
    goal: s => countIn(s.exteriorGrid, 'casino') >= 1,
    progress: s => clampProgress(countIn(s.exteriorGrid, 'casino'), 1)
  },
  {
    id: 'q_enter', title: 'Μπες Μέσα', icon: '🚪',
    desc: 'Μπες στο εσωτερικό του Καζίνο.',
    reward: { cash: 300 },
    goal: s => s.stats.viewedInterior,
    progress: s => clampProgress(s.stats.viewedInterior ? 1 : 0, 1)
  },
  {
    id: 'q_slots', title: 'Γέμισε Κουλοχέρηδες', icon: '🍒',
    desc: 'Τοποθέτησε 2 Slots στο πάτωμα του Καζίνο.',
    reward: { cash: 500 },
    goal: s => countIn(s.interiorGrid, 'slots') >= 2,
    progress: s => clampProgress(countIn(s.interiorGrid, 'slots'), 2)
  },
  {
    id: 'q_vip', title: 'Χώρος για VIP', icon: '🃏',
    desc: 'Χτίσε ένα τραπέζι VIP Blackjack (και βάλε VIP Τοίχο δίπλα!).',
    reward: { cash: 900 },
    goal: s => countIn(s.interiorGrid, 'vip_bj') >= 1,
    progress: s => clampProgress(countIn(s.interiorGrid, 'vip_bj'), 1)
  },
  {
    id: 'q_cash10k', title: 'Πρώτο Πόσο', icon: '💰',
    desc: 'Φτάσε τα $10,000 στο ταμείο.',
    reward: { cash: 1200 },
    goal: s => s.cash >= 10000,
    progress: s => clampProgress(Math.floor(s.cash), 10000)
  },
  {
    id: 'q_rep30', title: 'Χτίσε Φήμη', icon: '⭐',
    desc: 'Ανέβασε τη Φήμη στο 30. Κρατάει το House Edge χαμηλό.',
    reward: { cash: 1500, rep: 5 },
    goal: s => s.reputation >= 30,
    progress: s => clampProgress(Math.floor(s.reputation), 30)
  },
  {
    id: 'q_build15', title: 'Επιχειρηματίας', icon: '🏗️',
    desc: 'Χτίσε 15 κτίρια συνολικά σε Strip και Καζίνο.',
    reward: { cash: 2500 },
    goal: s => totalBuildings(s) >= 15,
    progress: s => clampProgress(totalBuildings(s), 15)
  },
  {
    id: 'q_cash50k', title: 'High Roller', icon: '💎',
    desc: 'Φτάσε τα $50,000 στο ταμείο.',
    reward: { cash: 5000 },
    goal: s => s.cash >= 50000,
    progress: s => clampProgress(Math.floor(s.cash), 50000)
  },
  {
    id: 'q_rep70', title: 'Θρύλος του Strip', icon: '👑',
    desc: 'Ανέβασε τη Φήμη στο 70 για να ξεκλειδώσεις τα elite κτίρια.',
    reward: { cash: 10000, rep: 10 },
    goal: s => s.reputation >= 70,
    progress: s => clampProgress(Math.floor(s.reputation), 70)
  }
];
