export const THEMES = [
  {
    id: 'american', name: 'American Pride', icon: '🇺🇸',
    accent: 0xff2a3d, shell: 0x1a2a6c, roof: 0xffffff,
    groundA: 0x22304a, groundB: 0x1b2740, grass: 0x2e6b3a,
    landmark: 'statue', desc: 'Κλασική λάμψη της Αμερικής με αετούς και σημαίες.'
  },
  {
    id: 'ocean', name: 'Ocean / Titanic', icon: '🌊',
    accent: 0x00b4d8, shell: 0x023e8a, roof: 0x90e0ef,
    groundA: 0x0a2a3d, groundB: 0x092233, grass: 0x1f6f8b,
    landmark: 'titanic', desc: 'Ναυτικό θέμα. Χρειάζεται νερό γύρω για το πλοίο-καζίνο.'
  },
  {
    id: 'space', name: 'Space', icon: '🚀',
    accent: 0x9d4edd, shell: 0x1b1035, roof: 0x00f5d4,
    groundA: 0x160d2b, groundB: 0x120a22, grass: 0x3b2f63,
    landmark: 'rocket', desc: 'Διαστημικός σταθμός με πλανήτες και πυραύλους.'
  },
  {
    id: 'prehistoric', name: 'Prehistoric', icon: '🦕',
    accent: 0x2ecc71, shell: 0x4a3520, roof: 0x8d6e4a,
    groundA: 0x24331f, groundB: 0x1d2a19, grass: 0x3f7d2e,
    landmark: 'trex', desc: 'Ζούγκλα με δεινόσαυρους και ηφαίστεια.'
  },
  {
    id: 'oriental', name: 'Oriental', icon: '🏯',
    accent: 0xffd166, shell: 0x9d0208, roof: 0xc71b1b,
    groundA: 0x2b1010, groundB: 0x220c0c, grass: 0x5c1f1f,
    landmark: 'pagoda', desc: 'Ανατολίτικη πολυτέλεια με παγόδες και φανάρια.'
  },
  {
    id: 'egyptian', name: 'Egyptian', icon: '🏛️',
    accent: 0xffc300, shell: 0xc9a227, roof: 0x8a6d1f,
    groundA: 0x3a2f1a, groundB: 0x302614, grass: 0x8a7a3a,
    landmark: 'pyramid', desc: 'Αρχαία Αίγυπτος με πυραμίδες και σφίγγες.'
  },
  {
    id: 'western', name: 'Wild West', icon: '🤠',
    accent: 0xd9822b, shell: 0x6b4226, roof: 0x8f5a30,
    groundA: 0x3a2b1c, groundB: 0x2f2316, grass: 0x7a5a2e,
    landmark: 'saloon', desc: 'Σαλούν, ερημιά και σαλούν χορού.'
  },
  {
    id: 'tropical', name: 'Tropical', icon: '🌴',
    accent: 0x06d6a0, shell: 0x0b6e4f, roof: 0x2a9d8f,
    groundA: 0x123a30, groundB: 0x0e2f27, grass: 0x1f8a5b,
    landmark: 'volcano', desc: 'Παραδεισένιο νησί με φοίνικες και ηφαίστειο.'
  },
  {
    id: 'medieval', name: 'Medieval', icon: '🏰',
    accent: 0xe63946, shell: 0x5c6672, roof: 0x3d4450,
    groundA: 0x2a2d33, groundB: 0x22252a, grass: 0x4a5a3a,
    landmark: 'castle', desc: 'Κάστρα, ιππότες και τουρνουά.'
  },
  {
    id: 'futuristic', name: 'Futuristic', icon: '🤖',
    accent: 0xff2a85, shell: 0x0b132b, roof: 0x00f5d4,
    groundA: 0x0d1424, groundB: 0x0a0f1c, grass: 0x1a2a4a,
    landmark: 'robot', desc: 'Neon μελλοντική πόλη με ρομπότ και holograms.'
  }
];

export function themeById(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

export function randomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)].id;
}
