export const RANDOM_EVENTS = [
  {
    id: 'ev_boxing', name: 'Μεγάλος Αγώνας', icon: '🥊',
    desc: 'Boxing match στην Αρένα! +60% επισκέπτες.',
    durationMs: 30000, effects: { guestMul: 1.6, incomeMul: 1.1 }
  },
  {
    id: 'ev_concert', name: 'Συναυλία Star', icon: '🎤',
    desc: 'Συναυλία στο Strip! +50% επισκέπτες, +15% έσοδα.',
    durationMs: 35000, effects: { guestMul: 1.5, incomeMul: 1.15 }
  },
  {
    id: 'ev_highroller', name: 'High Roller στην Πόλη', icon: '💎',
    desc: 'Ένας μεγιστάνας ήρθε! +80% έσοδα από τραπέζια.',
    durationMs: 28000, effects: { incomeMul: 1.8 }
  },
  {
    id: 'ev_convention', name: 'Συνέδριο Τεχνολογίας', icon: '💼',
    desc: 'Γεμάτα ξενοδοχεία! +45% επισκέπτες.',
    durationMs: 40000, effects: { guestMul: 1.45 }
  },
  {
    id: 'ev_heatwave', name: 'Καύσωνας', icon: '🔥',
    desc: 'Καύσωνας! Λιγότερος κόσμος, +25% κέρδη στα ποτά.',
    durationMs: 30000, effects: { guestMul: 0.8, incomeMul: 1.25 }
  },
  {
    id: 'ev_storm', name: 'Καταιγίδα', icon: '⛈️',
    desc: 'Καταιγίδα! Όλοι μέσα, -20% έσοδα αλλά +20% επισκέπτες στο καζίνο.',
    durationMs: 28000, effects: { guestMul: 1.2, incomeMul: 0.8 }
  },
  {
    id: 'ev_hackers', name: 'Cheaters', icon: '🕵️',
    desc: 'Cheaters στα τραπέζια! -35% έσοδα εκτός αν έχεις Security.',
    durationMs: 26000, effects: { incomeMul: 0.65 }
  },
  {
    id: 'ev_jackpot', name: 'Jackpot Frenzy', icon: '🎉',
    desc: 'Τρελάθηκε το slot floor! +70% έσοδα από κουλοχέρηδες.',
    durationMs: 24000, effects: { incomeMul: 1.7 }
  },
  {
    id: 'ev_holiday', name: 'Αργία', icon: '🎇',
    desc: 'Δημόσια αργία! +65% επισκέπτες όλη μέρα.',
    durationMs: 45000, effects: { guestMul: 1.65 }
  },
  {
    id: 'ev_blackout', name: 'Διακοπή Ρεύματος', icon: '🔌',
    desc: 'Πρόβλημα στο δίκτυο! -40% έσοδα ώσπου να περάσει.',
    durationMs: 22000, effects: { incomeMul: 0.6 }
  }
];

export function pickRandomEvent(excludeId) {
  const pool = RANDOM_EVENTS.filter(e => e.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}
