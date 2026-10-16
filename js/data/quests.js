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
    id: 'q_hotel', title: 'Start the Resort', icon: '🏨',
    desc: 'Build your first Hotel on the Strip.',
    reward: { cash: 600 },
    goal: s => countIn(s.exteriorGrid, 'hotel') >= 1,
    progress: s => clampProgress(countIn(s.exteriorGrid, 'hotel'), 1)
  },
  {
    id: 'q_casino', title: 'Open a Casino', icon: '🎰',
    desc: 'Build a Casino at the front of the resort.',
    reward: { cash: 800 },
    goal: s => countIn(s.exteriorGrid, 'casino') >= 1,
    progress: s => clampProgress(countIn(s.exteriorGrid, 'casino'), 1)
  },
  {
    id: 'q_enter', title: 'Go Inside', icon: '🚪',
    desc: 'Enter the casino interior.',
    reward: { cash: 300 },
    goal: s => s.stats.viewedInterior,
    progress: s => clampProgress(s.stats.viewedInterior ? 1 : 0, 1)
  },
  {
    id: 'q_slots', title: 'Fill the Slots', icon: '🍒',
    desc: 'Place 2 Slots on the casino floor.',
    reward: { cash: 500 },
    goal: s => countIn(s.interiorGrid, 'slots') >= 2,
    progress: s => clampProgress(countIn(s.interiorGrid, 'slots'), 2)
  },
  {
    id: 'q_vip', title: 'Room for VIPs', icon: '🃏',
    desc: 'Build a VIP Blackjack table (and a VIP Wall next to it!).',
    reward: { cash: 900 },
    goal: s => countIn(s.interiorGrid, 'vip_bj') >= 1,
    progress: s => clampProgress(countIn(s.interiorGrid, 'vip_bj'), 1)
  },
  {
    id: 'q_cash10k', title: 'First Fortune', icon: '💰',
    desc: 'Reach $10,000 in cash.',
    reward: { cash: 1200 },
    goal: s => s.cash >= 10000,
    progress: s => clampProgress(Math.floor(s.cash), 10000)
  },
  {
    id: 'q_rep30', title: 'Build Reputation', icon: '⭐',
    desc: 'Raise Reputation to 30. Keep the House Edge low.',
    reward: { cash: 1500, rep: 5 },
    goal: s => s.reputation >= 30,
    progress: s => clampProgress(Math.floor(s.reputation), 30)
  },
  {
    id: 'q_build15', title: 'Entrepreneur', icon: '🏗️',
    desc: 'Build 15 buildings in total across the Strip and casino.',
    reward: { cash: 2500 },
    goal: s => totalBuildings(s) >= 15,
    progress: s => clampProgress(totalBuildings(s), 15)
  },
  {
    id: 'q_cash50k', title: 'High Roller', icon: '💎',
    desc: 'Reach $50,000 in cash.',
    reward: { cash: 5000 },
    goal: s => s.cash >= 50000,
    progress: s => clampProgress(Math.floor(s.cash), 50000)
  },
  {
    id: 'q_rep70', title: 'Strip Legend', icon: '👑',
    desc: 'Raise Reputation to 70 to unlock the elite buildings.',
    reward: { cash: 10000, rep: 10 },
    goal: s => s.reputation >= 70,
    progress: s => clampProgress(Math.floor(s.reputation), 70)
  },
  {
    id: 'q_staff', title: 'Staffing Up', icon: '👔',
    desc: 'Hire 3 staff to boost performance.',
    reward: { cash: 2500 },
    goal: s => Object.values(s.staff || {}).reduce((a, b) => a + b, 0) >= 3,
    progress: s => clampProgress(Object.values(s.staff || {}).reduce((a, b) => a + b, 0), 3)
  },
  {
    id: 'q_plot', title: 'Expand the Resort', icon: '🗺️',
    desc: 'Buy a map expansion plot.',
    reward: { cash: 6000 },
    goal: s => s.plots >= 1,
    progress: s => clampProgress(s.plots, 1)
  },
  {
    id: 'q_level10', title: 'Level Up', icon: '🆙',
    desc: 'Reach Level 10.',
    reward: { cash: 8000, gold: 1 },
    goal: s => s.level >= 10,
    progress: s => clampProgress(s.level, 10)
  },
  {
    id: 'q_level20', title: 'Veteran', icon: '🎖️',
    desc: 'Reach Level 20 and build an empire.',
    reward: { cash: 30000, gold: 3 },
    goal: s => s.level >= 20,
    progress: s => clampProgress(s.level, 20)
  },
  {
    id: 'q_lot2', title: 'Strip Expansion', icon: '🏙️',
    desc: 'Buy a second lot with a new theme.',
    reward: { cash: 15000, gold: 1 },
    goal: s => (s.lots ? s.lots.length : 1) >= 2,
    progress: s => clampProgress(s.lots ? s.lots.length : 1, 2)
  }
];
