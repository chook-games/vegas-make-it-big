export const STAFF = [
  { id: 'cleaner', name: 'Καθαρίστρια', icon: '🧹', cost: 400, wage: 22, maxBase: 8,
    effect: { happiness: 1.6 }, requires: { level: 2 },
    desc: 'Κρατάει το καζίνο καθαρό. +1.6% διάθεση επισκεπτών ο καθένας.' },
  { id: 'dealer', name: 'Ντίλερ', icon: '🤵', cost: 800, wage: 40, maxBase: 10,
    effect: { incomePct: 0.05 }, requires: { level: 4 },
    desc: 'Επαγγελματίες ντίλερ στα τραπέζια. +5% έσοδα ο καθένας.' },
  { id: 'security', name: 'Φύλακας', icon: '💪', cost: 600, wage: 34, maxBase: 10,
    effect: { crime: 0.08 }, requires: { level: 4 },
    desc: 'Μειώνει cheaters & κλοπές. -8% ζημιές ο καθένας.' },
  { id: 'bartender', name: 'Μπάρμαν', icon: '🍸', cost: 700, wage: 30, maxBase: 8,
    effect: { guestPct: 0.035 }, requires: { level: 6 },
    desc: 'Κρατάει τον κόσμο διασκέδαση. +3.5% επισκέπτες ο καθένας.' },
  { id: 'host', name: 'VIP Host', icon: '🎩', cost: 1000, wage: 48, maxBase: 6,
    effect: { incomePct: 0.09 }, requires: { level: 9 },
    desc: 'Υποδέχεται τους High Rollers. +9% έσοδα ο καθένας.' },
  { id: 'manager', name: 'Διευθυντής', icon: '📋', cost: 1500, wage: 70, maxBase: 5,
    effect: { incomePct: 0.06, guestPct: 0.03 }, requires: { level: 12 },
    desc: 'Τρέχει τη βάρδια. +6% έσοδα και +3% επισκέπτες ο καθένας.' },
  { id: 'chef', name: 'Σεφ', icon: '👨‍🍳', cost: 1200, wage: 55, maxBase: 6,
    effect: { incomePct: 0.04, happiness: 1.2 }, requires: { level: 14 },
    desc: 'Ανεβάζει το φαγητό. +4% έσοδα και +1.2% διάθεση.' },
  { id: 'pitboss', name: 'Pit Boss', icon: '🎰', cost: 2200, wage: 95, maxBase: 4,
    effect: { incomePct: 0.14 }, requires: { level: 20, prestige: 1 },
    desc: 'Επιβλέπει το πάτωμα. +14% έσοδα ο καθένας.' }
];

export function findStaff(id) {
  return STAFF.find(s => s.id === id) || null;
}

export function staffUnlocked(def, state) {
  if (!def.requires) return true;
  const r = def.requires;
  if (r.level != null && state.level < r.level) return false;
  if (r.prestige != null && state.prestigeLevel < r.prestige) return false;
  return true;
}

export function staffLockLabel(def) {
  if (!def.requires) return '';
  const parts = [];
  if (def.requires.level != null) parts.push(`Lv.${def.requires.level}`);
  if (def.requires.prestige != null) parts.push(`Prestige ${def.requires.prestige}`);
  return parts.join(' • ');
}

export function staffMax(def, state) {
  return def.maxBase + Math.floor(state.level / 4);
}
