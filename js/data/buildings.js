export const CATALOG = {
  exterior: [
    {
      id: 'casino', name: 'Καζίνο', icon: '🎰', cost: 1200, income: 160,
      power: -3, guests: 25, tier: 1,
      desc: 'Η καρδιά του Resort. Έχει φωτεινή είσοδο με κόκκινο χαλί μπροστά.'
    },
    {
      id: 'hotel', name: 'Ξενοδοχείο', icon: '🏨', cost: 900, income: 110,
      power: -2, guests: 40, tier: 1, isHotel: true,
      desc: 'Πολυτελής πύργος με πισίνα. Αυξάνει τη χωρητικότητα επισκεπτών.'
    },
    {
      id: 'chapel', name: 'Chapel', icon: '💒', cost: 650, income: 95,
      power: -1, guests: 15, tier: 1,
      desc: 'Εκκλησάκι γάμων με είσοδο και καμπαναριό στην πρόσοψη.'
    },
    {
      id: 'fountain', name: 'Σιντριβάνι', icon: '⛲', cost: 500, income: 45,
      power: -1, guests: 30, tier: 1,
      desc: 'Θεαματικό σιντριβάνι με χρυσή αψίδα. Ανέβασε τη Φήμη.'
    },
    {
      id: 'generator', name: 'Γεννήτρια', icon: '⚡', cost: 450, income: -15,
      power: 8, guests: -5, tier: 1, isGenerator: true,
      desc: 'Παράγει +8 Ενέργεια για το Resort σου.'
    },
    {
      id: 'parking', name: 'Parking', icon: '🅿️', cost: 600, income: 55,
      power: 0, guests: 35, tier: 2, requires: { rep: 15 },
      desc: 'Χώρος στάθμευσης πολλών ορόφων. Φέρνει επισκέπτες από όλη την πόλη.'
    },
    {
      id: 'restaurant', name: 'Εστιατόριο', icon: '🍽️', cost: 800, income: 130,
      power: -2, guests: 20, tier: 2, requires: { rep: 20 },
      desc: 'Γκουρμέ εστιατόριο σεφ. Κρατάει τους επισκέπτες περισσότερο.'
    },
    {
      id: 'pool', name: 'Πισίνα Resort', icon: '🏊', cost: 1400, income: 150,
      power: -2, guests: 45, tier: 2, requires: { rep: 30 },
      desc: 'Τεράστια εξωτερική πισίνα με bar. Αγαπημένη των VIP.'
    },
    {
      id: 'ferris', name: 'Ρόδα', icon: '🎡', cost: 2400, income: 210,
      power: -3, guests: 60, tier: 3, requires: { rep: 55 },
      desc: 'Γιγαντιαία ρόδα που φωτίζει όλο το Strip τη νύχτα.'
    },
    {
      id: 'stadium', name: 'Αρένα', icon: '🏟️', cost: 4200, income: 420,
      power: -6, guests: 120, tier: 3, requires: { rep: 70, prestige: 1 },
      desc: 'Αρένα για συναυλίες και αγώνες. Προσελκύει πλήθος και χορηγούς.'
    }
  ],
  interior: [
    {
      id: 'slots', name: 'Slots', icon: '🍒', cost: 350, income: 75,
      power: -1, guests: 10, noisy: true, tier: 1,
      desc: 'Σειρά κουλοχέρηδων. Κάνουν φασαρία για τα VIP τραπέζια!'
    },
    {
      id: 'roulette', name: 'Ρουλέτα', icon: '🎡', cost: 600, income: 120,
      power: -1, guests: 14, tier: 1,
      desc: 'Τραπέζι Ρουλέτας. Περίστρεψέ το για να ταιριάξει στον διάδρομο.'
    },
    {
      id: 'vip_bj', name: 'VIP Blackjack', icon: '🃏', cost: 1100, income: 260,
      power: -1, guests: 8, isVip: true, tier: 1,
      desc: 'Τραπέζι High-Rollers. Χάνει 50% κέρδη δίπλα σε Slots χωρίς VIP Τοίχο.'
    },
    {
      id: 'wall', name: 'VIP Τοίχος', icon: '🧱', cost: 150, income: 0,
      power: 0, guests: 2, isWall: true, tier: 1,
      desc: 'Χρυσός ηχομονωτικός τοίχος. Κάνε Rotate 90° για οριζόντια/κάθετη τοποθέτηση.'
    },
    {
      id: 'security', name: 'Security', icon: '🛡️', cost: 500, income: -10,
      power: -1, guests: 5, isSecurity: true, tier: 1,
      desc: 'Σταθμός ασφαλείας με κάμερες. Δίνει +35% κέρδη στα διπλανά τραπέζια.'
    },
    {
      id: 'cashier', name: 'Ταμείο', icon: '💵', cost: 400, income: 40,
      power: -1, guests: 5, tier: 2, requires: { rep: 15 },
      desc: 'Κεντρικό ταμείο. Βελτιώνει τη ροή επισκεπτών.'
    },
    {
      id: 'bar', name: 'Bar', icon: '🍸', cost: 700, income: 90,
      power: -1, guests: 25, tier: 2, requires: { rep: 20 },
      desc: 'Cocktail bar. Κρατάει τον κόσμο ξύπνιο και τα ποτά φέρνουν κέρδος.'
    },
    {
      id: 'poker', name: 'Poker', icon: '♠️', cost: 850, income: 150,
      power: -1, guests: 12, tier: 2, requires: { rep: 25 },
      desc: 'Τραπέζι πόκερ με ντίλερ. Σταθερό κέρδος όλη μέρα.'
    },
    {
      id: 'craps', name: 'Craps', icon: '🎲', cost: 950, income: 175,
      power: -1, guests: 13, noisy: true, tier: 2, requires: { rep: 25 },
      desc: 'Τραπέζι Craps. Πολύ θορυβώδες, κρατάει τους VIP μακριά.'
    },
    {
      id: 'sportsbook', name: 'Sportsbook', icon: '🏈', cost: 1300, income: 200,
      power: -2, guests: 30, tier: 2, requires: { rep: 35 },
      desc: 'Στοιχηματικό με γιγαντιαίες οθόνες. Έσοδα ανάλογα με τα events.'
    },
    {
      id: 'buffet', name: 'Buffet', icon: '🍤', cost: 1000, income: 100,
      power: -2, guests: 35, tier: 3, requires: { rep: 45 },
      desc: 'All-you-can-eat μπουφές. Τεράστια προσέλευση επισκεπτών.'
    }
  ]
};

export function findItem(world, id) {
  const list = CATALOG[world];
  if (!list) return null;
  return list.find(x => x.id === id) || null;
}

export function allItems() {
  return [...CATALOG.exterior, ...CATALOG.interior];
}

export function isUnlocked(item, state) {
  if (!item.requires) return true;
  const r = item.requires;
  if (r.rep != null && state.reputation < r.rep) return false;
  if (r.prestige != null && state.prestigeLevel < r.prestige) return false;
  if (r.day != null && state.clock.day < r.day) return false;
  return true;
}

export function lockLabel(item) {
  if (!item.requires) return '';
  const parts = [];
  if (item.requires.rep != null) parts.push(`Φήμη ${item.requires.rep}`);
  if (item.requires.prestige != null) parts.push(`Prestige ${item.requires.prestige}`);
  if (item.requires.day != null) parts.push(`Μέρα ${item.requires.day}`);
  return parts.join(' • ');
}
