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
  },
  {
    id: 'q_staff', title: 'Στελέχωση', icon: '👔',
    desc: 'Πρόσλαβε 3 εργαζόμενους για να ανεβάσεις την απόδοση.',
    reward: { cash: 2500 },
    goal: s => Object.values(s.staff || {}).reduce((a, b) => a + b, 0) >= 3,
    progress: s => clampProgress(Object.values(s.staff || {}).reduce((a, b) => a + b, 0), 3)
  },
  {
    id: 'q_plot', title: 'Μεγάλωσε το Resort', icon: '🗺️',
    desc: 'Αγόρασε ένα Plot επέκτασης χάρτη.',
    reward: { cash: 6000 },
    goal: s => s.plots >= 1,
    progress: s => clampProgress(s.plots, 1)
  },
  {
    id: 'q_level10', title: 'Άνοδος', icon: '🆙',
    desc: 'Φτάσε στο Level 10.',
    reward: { cash: 8000, gold: 1 },
    goal: s => s.level >= 10,
    progress: s => clampProgress(s.level, 10)
  },
  {
    id: 'q_level20', title: 'Βετεράνος', icon: '🎖️',
    desc: 'Φτάσε στο Level 20 και χτίσε αυτοκρατορία.',
    reward: { cash: 30000, gold: 3 },
    goal: s => s.level >= 20,
    progress: s => clampProgress(s.level, 20)
  },
  {
    id: 'q_lot2', title: 'Επέκταση στο Strip', icon: '🏙️',
    desc: 'Αγόρασε ένα δεύτερο οικόπεδο με νέο θέμα.',
    reward: { cash: 15000, gold: 1 },
    goal: s => (s.lots ? s.lots.length : 1) >= 2,
    progress: s => clampProgress(s.lots ? s.lots.length : 1, 2)
  }
];
