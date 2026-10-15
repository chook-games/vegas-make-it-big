export const CATALOG = {
  exterior: [
    { id: 'casino', name: 'Καζίνο', icon: '🎰', cost: 1200, income: 160, power: -3, guests: 25, tier: 1,
      desc: 'Η καρδιά του Resort. Φωτεινή είσοδος με κόκκινο χαλί μπροστά.' },
    { id: 'hotel', name: 'Ξενοδοχείο', icon: '🏨', cost: 900, income: 110, power: -2, guests: 40, tier: 1, isHotel: true,
      desc: 'Πολυτελής πύργος με πισίνα. Αυξάνει τη χωρητικότητα επισκεπτών.' },
    { id: 'chapel', name: 'Chapel', icon: '💒', cost: 650, income: 95, power: -1, guests: 15, tier: 1,
      desc: 'Εκκλησάκι γάμων με καμπαναριό στην πρόσοψη.' },
    { id: 'fountain', name: 'Σιντριβάνι', icon: '⛲', cost: 500, income: 45, power: -1, guests: 30, tier: 1,
      desc: 'Θεαματικό σιντριβάνι με χρυσή αψίδα. Ανέβασε τη Φήμη.' },
    { id: 'generator', name: 'Γεννήτρια', icon: '⚡', cost: 450, income: -15, power: 8, guests: -5, tier: 1, isGenerator: true,
      desc: 'Παράγει +8 Ενέργεια για το Resort σου.' },
    { id: 'parking', name: 'Parking', icon: '🅿️', cost: 600, income: 55, power: 0, guests: 35, tier: 2, requires: { level: 3 },
      desc: 'Πολυόροφο parking. Φέρνει κόσμο από όλη την πόλη.' },
    { id: 'restaurant', name: 'Εστιατόριο', icon: '🍽️', cost: 800, income: 130, power: -2, guests: 20, tier: 2, requires: { level: 5, rep: 20 },
      desc: 'Γκουρμέ εστιατόριο σεφ. Κρατάει τους επισκέπτες περισσότερο.' },
    { id: 'solar', name: 'Ηλιακά Πάνελ', icon: '☀️', cost: 900, income: 20, power: 12, guests: -3, tier: 2, isGenerator: true, requires: { level: 7 },
      desc: 'Καθαρή ενέργεια +12. Δεν ενοχλεί τους επισκέπτες.' },
    { id: 'pool', name: 'Πισίνα Resort', icon: '🏊', cost: 1400, income: 150, power: -2, guests: 45, tier: 2, requires: { level: 8, rep: 30 },
      desc: 'Τεράστια εξωτερική πισίνα με bar. Αγαπημένη των VIP.' },
    { id: 'gardens', name: 'Κήποι', icon: '🌳', cost: 1200, income: 90, power: -1, guests: 35, tier: 2, requires: { level: 9, rep: 25 },
      desc: 'Βοτανικοί κήποι. Ανεβάζουν τη διάθεση των επισκεπτών.' },
    { id: 'cinema', name: 'Σινεμά IMAX', icon: '🎬', cost: 1500, income: 165, power: -2, guests: 40, tier: 3, requires: { level: 5, rep: 20 },
      desc: 'Τεράστια οθόνη. Γεμίζει τις βραδινές ώρες.' },
    { id: 'mall', name: 'Εμπορικό', icon: '🛍️', cost: 1800, income: 190, power: -3, guests: 55, tier: 3, requires: { level: 6, rep: 30 },
      desc: 'Shopping mall με πολυτέλειες. Οι VIP ξοδεύουν πολλά.' },
    { id: 'aquarium', name: 'Ενυδρείο', icon: '🐠', cost: 2000, income: 205, power: -3, guests: 50, tier: 3, requires: { level: 8, rep: 35 },
      desc: 'Ενυδρείο με σαλάχια. Αξιοθέατο για όλη την οικογένεια.' },
    { id: 'powerplant', name: 'Σταθμός', icon: '🔌', cost: 2200, income: 40, power: 26, guests: -8, tier: 3, isGenerator: true, requires: { level: 14 },
      desc: 'Μικρός σταθμός παραγωγής +26 Ενέργειας.' },
    { id: 'marina', name: 'Μαρίνα', icon: '⛵', cost: 2800, income: 240, power: -3, guests: 55, tier: 3, requires: { level: 11, rep: 50 },
      desc: 'Πολυτελής μαρίνα με σκάφη. Προσελκύει πλούσιους επισκέπτες.' },
    { id: 'golf', name: 'Γήπεδο Γκολφ', icon: '🏌️', cost: 2600, income: 250, power: -3, guests: 45, tier: 3, requires: { level: 10, rep: 45 },
      desc: 'Γήπεδο 18 οπών. Χώρος για επιχειρηματίες.' },
    { id: 'ferris', name: 'Ρόδα', icon: '🎡', cost: 2400, income: 210, power: -3, guests: 60, tier: 3, requires: { level: 12, rep: 55 },
      desc: 'Γιγαντιαία ρόδα που φωτίζει όλο το Strip τη νύχτα.' },
    { id: 'rollercoaster', name: 'Roller Coaster', icon: '🎢', cost: 3400, income: 330, power: -4, guests: 80, tier: 4, requires: { level: 12, rep: 55 },
      desc: 'Τρελό coaster με looping. Ουρές από το πρωί.' },
    { id: 'convention', name: 'Συνεδριακό', icon: '🏢', cost: 3600, income: 300, power: -5, guests: 90, tier: 4, requires: { level: 15, rep: 60 },
      desc: 'Convention center. Γεμίζει ξενοδοχεία με εκδηλώσεις.' },
    { id: 'stadium', name: 'Αρένα', icon: '🏟️', cost: 4200, income: 420, power: -6, guests: 120, tier: 4, requires: { level: 18, rep: 70, prestige: 1 },
      desc: 'Αρένα για συναυλίες και αγώνες. Προσελκύει πλήθος.' },
    { id: 'helipad', name: 'Ελικοδρόμιο', icon: '🚁', cost: 4200, income: 360, power: -4, guests: 70, tier: 4, requires: { level: 18, rep: 70, prestige: 1 },
      desc: 'Helipad για High Rollers. Άφιξη με στιλ.' },
    { id: 'observatory', name: 'Παρατηρητήριο', icon: '🔭', cost: 5200, income: 460, power: -6, guests: 100, tier: 5, requires: { level: 22, rep: 80, prestige: 2 },
      desc: 'Ουρανοξύστης με θέα 360°. Το σύμβολο του Resort σου.' },
    { id: 'statue', name: 'Αγάλμα Ελευθερίας', icon: '🗽', cost: 4200, income: 380, power: -4, guests: 80, tier: 3, isLandmark: true, themeOnly: 'american', requires: { level: 6 },
      desc: 'Αμερικανικό ορόσημο. Εμβληματικό αξιοθέατο του lot.' },
    { id: 'titanic', name: 'Casino Titanic', icon: '🚢', cost: 4600, income: 420, power: -4, guests: 90, tier: 3, isLandmark: true, themeOnly: 'ocean', requires: { level: 6 },
      desc: 'Πλωτό καζίνο-θρύλος. Χρειάζεται ωκεανό γύρω του.' },
    { id: 'rocket', name: 'Διαστημικός Πύραυλος', icon: '🚀', cost: 4400, income: 400, power: -5, guests: 85, tier: 3, isLandmark: true, themeOnly: 'space', requires: { level: 6 },
      desc: 'Πύραυλος σε εκτόξευση. Space αξιοθέατο.' },
    { id: 'trex', name: 'Τ-Rex', icon: '🦖', cost: 4300, income: 390, power: -3, guests: 88, tier: 3, isLandmark: true, themeOnly: 'prehistoric', requires: { level: 6 },
      desc: 'Ζωντανός δεινόσαυρος. Τρόμος και θέαμα.' },
    { id: 'pagoda', name: 'Παγόδα', icon: '🏯', cost: 4500, income: 410, power: -4, guests: 84, tier: 3, isLandmark: true, themeOnly: 'oriental', requires: { level: 6 },
      desc: 'Πολύχρωμη παγόδα με φανάρια.' },
    { id: 'pyramid', name: 'Πυραμίδα', icon: '🛕', cost: 4700, income: 430, power: -5, guests: 92, tier: 3, isLandmark: true, themeOnly: 'egyptian', requires: { level: 6 },
      desc: 'Χρυσή πυραμίδα με φωτεινή κορυφή.' },
    { id: 'saloon', name: 'Σαλούν', icon: '🤠', cost: 3900, income: 360, power: -3, guests: 76, tier: 3, isLandmark: true, themeOnly: 'western', requires: { level: 6 },
      desc: 'Σαλούν της Άγριας Δύσης με live σόου.' },
    { id: 'volcano', name: 'Ηφαίστειο', icon: '🌋', cost: 4800, income: 440, power: -4, guests: 95, tier: 3, isLandmark: true, themeOnly: 'tropical', requires: { level: 6 },
      desc: 'Ενεργό ηφαίστειο-αξιοθέατο.' },
    { id: 'castle', name: 'Κάστρο', icon: '🏰', cost: 4600, income: 415, power: -4, guests: 86, tier: 3, isLandmark: true, themeOnly: 'medieval', requires: { level: 6 },
      desc: 'Μεσαιωνικό κάστρο με τουρνουά.' },
    { id: 'robot', name: 'Γιγάντιο Ρομπότ', icon: '🤖', cost: 4900, income: 455, power: -5, guests: 98, tier: 3, isLandmark: true, themeOnly: 'futuristic', requires: { level: 6 },
      desc: 'Holographic ρομπότ-φύλακας.' }
  ],
  interior: [
    { id: 'slots', name: 'Slots', icon: '🍒', cost: 350, income: 75, power: -1, guests: 10, noisy: true, tier: 1,
      desc: 'Σειρά κουλοχέρηδων. Κάνουν φασαρία για τα VIP τραπέζια!' },
    { id: 'roulette', name: 'Ρουλέτα', icon: '🎡', cost: 600, income: 120, power: -1, guests: 14, tier: 1,
      desc: 'Τραπέζι Ρουλέτας. Περίστρεψέ το για να ταιριάξει στον διάδρομο.' },
    { id: 'vip_bj', name: 'VIP Blackjack', icon: '🃏', cost: 1100, income: 260, power: -1, guests: 8, isVip: true, tier: 1,
      desc: 'Τραπέζι High-Rollers. Χάνει 50% κέρδη δίπλα σε Slots χωρίς VIP Τοίχο.' },
    { id: 'wall', name: 'VIP Τοίχος', icon: '🧱', cost: 150, income: 0, power: 0, guests: 2, isWall: true, tier: 1,
      desc: 'Χρυσός ηχομονωτικός τοίχος. Κάνε Rotate 90° για οριζόντια/κάθετη τοποθέτηση.' },
    { id: 'security', name: 'Security', icon: '🛡️', cost: 500, income: -10, power: -1, guests: 5, isSecurity: true, tier: 1,
      desc: 'Σταθμός ασφαλείας με κάμερες. Δίνει +35% κέρδη στα διπλανά τραπέζια.' },
    { id: 'cashier', name: 'Ταμείο', icon: '💵', cost: 400, income: 40, power: -1, guests: 5, tier: 2, requires: { level: 4 },
      desc: 'Κεντρικό ταμείο. Βελτιώνει τη ροή επισκεπτών.' },
    { id: 'keno', name: 'Keno', icon: '🔢', cost: 700, income: 110, power: -1, guests: 12, tier: 2, requires: { level: 6 },
      desc: 'Παιχνίδι Keno με οθόνες. Γρήγορο και απλό.' },
    { id: 'bar', name: 'Bar', icon: '🍸', cost: 700, income: 90, power: -1, guests: 25, tier: 2, requires: { level: 6, rep: 20 },
      desc: 'Cocktail bar. Κρατάει τον κόσμο ξύπνιο.' },
    { id: 'poker', name: 'Poker', icon: '♠️', cost: 850, income: 150, power: -1, guests: 12, tier: 2, requires: { level: 9, rep: 25 },
      desc: 'Τραπέζι πόκερ με ντίλερ. Σταθερό κέρδος.' },
    { id: 'sicbo', name: 'Sic Bo', icon: '🎯', cost: 900, income: 160, power: -1, guests: 11, noisy: true, tier: 2, requires: { level: 8, rep: 28 },
      desc: 'Τραπέζι ζαριών Sic Bo. Θορυβώδες αλλά κερδοφόρο.' },
    { id: 'craps', name: 'Craps', icon: '🎲', cost: 950, income: 175, power: -1, guests: 13, noisy: true, tier: 2, requires: { level: 10, rep: 25 },
      desc: 'Τραπέζι Craps. Πολύ θορυβώδες.' },
    { id: 'baccarat', name: 'Baccarat', icon: '🎴', cost: 1000, income: 180, power: -1, guests: 10, tier: 2, requires: { level: 9, rep: 30 },
      desc: 'Η πρώτη επιλογή των VIP. Υψηλά stakes.' },
    { id: 'giftshop', name: 'Gift Shop', icon: '🎁', cost: 800, income: 95, power: -1, guests: 20, tier: 2, requires: { level: 11, rep: 35 },
      desc: 'Κατάστημα αναμνηστικών. Μικρό αλλά σταθερό κέρδος.' },
    { id: 'lounge', name: 'VIP Lounge', icon: '🛋️', cost: 1100, income: 130, power: -1, guests: 30, tier: 3, requires: { level: 10, rep: 40 },
      desc: 'Σαλόνι VIP με πούρα. Ησυχία και κύρος.' },
    { id: 'cage', name: 'Cash Cage', icon: '🔐', cost: 1200, income: 90, power: -1, guests: 8, tier: 3, requires: { level: 12 },
      desc: 'Θωρακισμένο κλουβί χρημάτων. Αυξάνει την ασφάλεια.' },
    { id: 'sportsbook', name: 'Sportsbook', icon: '🏈', cost: 1300, income: 200, power: -2, guests: 30, tier: 3, requires: { level: 14, rep: 35 },
      desc: 'Στοιχηματικό με γιγαντιαίες οθόνες.' },
    { id: 'buffet', name: 'Buffet', icon: '🍤', cost: 1000, income: 100, power: -2, guests: 35, tier: 3, requires: { level: 16, rep: 45 },
      desc: 'All-you-can-eat μπουφές. Τεράστια προσέλευση.' },
    { id: 'foodcourt', name: 'Food Court', icon: '🍕', cost: 1500, income: 170, power: -2, guests: 50, tier: 3, requires: { level: 17, rep: 60 },
      desc: 'Πολλαπλά εστιατόρια σε έναν χώρο.' },
    { id: 'spa', name: 'Spa', icon: '💆', cost: 1600, income: 150, power: -2, guests: 45, tier: 3, requires: { level: 13, rep: 50 },
      desc: 'Πολυτελές spa. Χαλαρώνει τους VIP.' },
    { id: 'nightclub', name: 'Nightclub', icon: '🪩', cost: 2000, income: 220, power: -2, guests: 60, noisy: true, tier: 4, requires: { level: 16, rep: 55 },
      desc: 'Club με DJ. Θόρυβος και πολύ κέρδος τη νύχτα.' },
    { id: 'highlimit', name: 'High Limit', icon: '💰', cost: 2600, income: 420, power: -2, guests: 12, isVip: true, tier: 4, requires: { level: 20, rep: 65, prestige: 1 },
      desc: 'Αίθουσα High Limit. Μόνο για τους μεγιστάνες.' },
    { id: 'boxing', name: 'Ring', icon: '🥊', cost: 3000, income: 380, power: -3, guests: 70, noisy: true, tier: 4, requires: { level: 24, rep: 75, prestige: 2 },
      desc: 'Ρίνγκ αγώνων μέσα στο καζίνο. Σόου και τζόγος.' },
    { id: 'vault', name: 'Χρυσό Θησαυροφυλάκιο', icon: '🏦', cost: 4000, income: 520, power: -3, guests: 20, tier: 5, requires: { level: 28, rep: 85, prestige: 3 },
      desc: 'Θρυλικό θησαυροφυλάκιο. Το απόλυτο κύρος.' },
    { id: 'restroom', name: 'Τουαλέτες', icon: '🚻', cost: 300, income: 15, power: -1, guests: 6, tier: 1, isRestroom: true,
      desc: 'Απαραίτητες τουαλέτες. Βγάζουν δυσοσμία — κρατήσου μακριά από VIP τραπέζια.' },
    { id: 'plants', name: 'Φυτά Διακόσμησης', icon: '🌿', cost: 120, income: 0, power: 0, guests: 3, tier: 1, isDecor: true,
      desc: 'Καθαρίζουν τον αέρα και μειώνουν τη δυσοσμία γύρω τους.' }
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
  if (r.level != null && state.level < r.level) return false;
  if (r.rep != null && state.reputation < r.rep) return false;
  if (r.prestige != null && state.prestigeLevel < r.prestige) return false;
  if (r.day != null && state.clock.day < r.day) return false;
  return true;
}

export function lockLabel(item) {
  if (!item.requires) return '';
  const parts = [];
  if (item.requires.level != null) parts.push(`Lv.${item.requires.level}`);
  if (item.requires.rep != null) parts.push(`Φήμη ${item.requires.rep}`);
  if (item.requires.prestige != null) parts.push(`Prestige ${item.requires.prestige}`);
  if (item.requires.day != null) parts.push(`Μέρα ${item.requires.day}`);
  return parts.join(' • ');
}
