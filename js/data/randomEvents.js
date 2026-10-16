export const RANDOM_EVENTS = [
  {
    id: 'ev_boxing', name: 'Big Fight Night', icon: '🥊',
    desc: 'Boxing match at the Arena! +60% guests.',
    durationMs: 30000, effects: { guestMul: 1.6, incomeMul: 1.1 }
  },
  {
    id: 'ev_concert', name: 'Star Concert', icon: '🎤',
    desc: 'Concert on the Strip! +50% guests, +15% income.',
    durationMs: 35000, effects: { guestMul: 1.5, incomeMul: 1.15 }
  },
  {
    id: 'ev_highroller', name: 'High Roller in Town', icon: '💎',
    desc: 'A tycoon arrived! +80% income from table games.',
    durationMs: 28000, effects: { incomeMul: 1.8 }
  },
  {
    id: 'ev_convention', name: 'Tech Convention', icon: '💼',
    desc: 'Hotels are full! +45% guests.',
    durationMs: 40000, effects: { guestMul: 1.45 }
  },
  {
    id: 'ev_heatwave', name: 'Heatwave', icon: '🔥',
    desc: 'Heatwave! Fewer people, +25% drink profit.',
    durationMs: 30000, effects: { guestMul: 0.8, incomeMul: 1.25 }
  },
  {
    id: 'ev_storm', name: 'Thunderstorm', icon: '⛈️',
    desc: 'Storm! Everyone inside: -20% income but +20% casino guests.',
    durationMs: 28000, effects: { guestMul: 1.2, incomeMul: 0.8 }
  },
  {
    id: 'ev_hackers', name: 'Cheaters', icon: '🕵️',
    desc: 'Cheaters at the tables! -35% income unless you have Security.',
    durationMs: 26000, effects: { incomeMul: 0.65 }
  },
  {
    id: 'ev_jackpot', name: 'Jackpot Frenzy', icon: '🎉',
    desc: 'The slot floor went wild! +70% slot income.',
    durationMs: 24000, effects: { incomeMul: 1.7 }
  },
  {
    id: 'ev_holiday', name: 'Public Holiday', icon: '🎇',
    desc: 'Public holiday! +65% guests all day.',
    durationMs: 45000, effects: { guestMul: 1.65 }
  },
  {
    id: 'ev_blackout', name: 'Power Outage', icon: '🔌',
    desc: 'Grid problem! -40% income until it passes.',
    durationMs: 22000, effects: { incomeMul: 0.6 }
  }
];

export function pickRandomEvent(excludeId) {
  const pool = RANDOM_EVENTS.filter(e => e.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}
