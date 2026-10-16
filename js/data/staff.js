export const STAFF = [
  { id: 'cleaner', name: 'Cleaner', icon: '🧹', cost: 400, wage: 22, maxBase: 8,
    effect: { happiness: 1.6, repair: 0.5 }, requires: { level: 2 },
    desc: 'Keeps the casino clean and maintains the lot. Slows condition decay.' },
  { id: 'dealer', name: 'Croupier', icon: '🤵', cost: 800, wage: 40, maxBase: 12,
    effect: { incomePct: 0.04 }, requires: { level: 4 },
    desc: 'Required to run a table or slot group. Each croupier staffs one gambling station (+4% income each).' },
  { id: 'mechanic', name: 'Mechanic', icon: '🔧', cost: 700, wage: 36, maxBase: 8,
    effect: { repair: 0.9 }, requires: { level: 5 },
    desc: 'Automatically repairs machines and utilities. Keeps condition high.' },
  { id: 'security', name: 'Guard', icon: '💪', cost: 600, wage: 34, maxBase: 10,
    effect: { crime: 0.08 }, requires: { level: 4 },
    desc: 'Reduces cheaters and theft. -8% losses each.' },
  { id: 'bartender', name: 'Bartender', icon: '🍸', cost: 700, wage: 30, maxBase: 8,
    effect: { guestPct: 0.035 }, requires: { level: 6 },
    desc: 'Keeps the crowd entertained. +3.5% guests each.' },
  { id: 'host', name: 'VIP Host', icon: '🎩', cost: 1000, wage: 48, maxBase: 6,
    effect: { incomePct: 0.09 }, requires: { level: 9 },
    desc: 'Welcomes high rollers. +9% income each.' },
  { id: 'manager', name: 'Manager', icon: '📋', cost: 1500, wage: 70, maxBase: 5,
    effect: { incomePct: 0.06, guestPct: 0.03 }, requires: { level: 12 },
    desc: 'Runs the shift. +6% income and +3% guests each.' },
  { id: 'chef', name: 'Chef', icon: '👨‍🍳', cost: 1200, wage: 55, maxBase: 6,
    effect: { incomePct: 0.04, happiness: 1.2 }, requires: { level: 14 },
    desc: 'Raises the food game. +4% income and +1.2% mood.' },
  { id: 'pitboss', name: 'Pit Boss', icon: '🎰', cost: 2200, wage: 95, maxBase: 4,
    effect: { incomePct: 0.14 }, requires: { level: 20, prestige: 1 },
    desc: 'Supervises the floor. +14% income each.' }
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
