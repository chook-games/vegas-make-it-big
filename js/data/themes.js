export const THEMES = [
  {
    id: 'american', name: 'American Pride', icon: '🇺🇸',
    accent: 0xff2a3d, shell: 0x2a3f7a, roof: 0xffffff,
    groundA: 0x4a5a7a, groundB: 0x3d4a66, grass: 0x4a7a4a,
    landmark: 'statue', desc: 'Classic Americana with eagles and flags.'
  },
  {
    id: 'ocean', name: 'Ocean / Titanic', icon: '🌊',
    accent: 0x00b4d8, shell: 0x1e5a8a, roof: 0xa8e0ef,
    groundA: 0x2a5f7d, groundB: 0x24506a, grass: 0x2f8fa8,
    landmark: 'titanic', desc: 'Nautical theme with a ship-shaped casino.'
  },
  {
    id: 'space', name: 'Space', icon: '🚀',
    accent: 0x9d4edd, shell: 0x33305e, roof: 0x00f5d4,
    groundA: 0x33305e, groundB: 0x2a2750, grass: 0x4a4478,
    landmark: 'rocket', desc: 'Space station with planets and rockets.'
  },
  {
    id: 'prehistoric', name: 'Prehistoric', icon: '🦕',
    accent: 0x2ecc71, shell: 0x6a4a28, roof: 0xa88a5a,
    groundA: 0x4a6b3c, groundB: 0x3d5a32, grass: 0x5f9a3f,
    landmark: 'trex', desc: 'Jungle with dinosaurs and volcanoes.'
  },
  {
    id: 'oriental', name: 'Oriental', icon: '🏯',
    accent: 0xffd166, shell: 0xb01a20, roof: 0xe63946,
    groundA: 0x6b3a35, groundB: 0x5a2f2b, grass: 0x8a4a3a,
    landmark: 'pagoda', desc: 'Eastern luxury with pagodas and lanterns.'
  },
  {
    id: 'egyptian', name: 'Egyptian', icon: '🏛️',
    accent: 0xffc300, shell: 0xd4b24c, roof: 0xa8892a,
    groundA: 0x8a7a4a, groundB: 0x77693d, grass: 0xa89a5a,
    landmark: 'pyramid', desc: 'Ancient Egypt with pyramids and sphinxes.'
  },
  {
    id: 'western', name: 'Wild West', icon: '🤠',
    accent: 0xd9822b, shell: 0x8a5a30, roof: 0xb07a44,
    groundA: 0x7a5c3c, groundB: 0x6a4f33, grass: 0x9a7a44,
    landmark: 'saloon', desc: 'Saloon, desert and a good old hoedown.'
  },
  {
    id: 'tropical', name: 'Tropical', icon: '🌴',
    accent: 0x06d6a0, shell: 0x1e8a63, roof: 0x3fb99a,
    groundA: 0x2f7a63, groundB: 0x266a56, grass: 0x2fa86e,
    landmark: 'volcano', desc: 'Paradise island with palms and a volcano.'
  },
  {
    id: 'medieval', name: 'Medieval', icon: '🏰',
    accent: 0xe63946, shell: 0x6a7480, roof: 0x4a525c,
    groundA: 0x5a6068, groundB: 0x4a5058, grass: 0x6a7a52,
    landmark: 'castle', desc: 'Castles, knights and tournaments.'
  },
  {
    id: 'futuristic', name: 'Futuristic', icon: '🤖',
    accent: 0xff2a85, shell: 0x28304a, roof: 0x00f5d4,
    groundA: 0x28304a, groundB: 0x212840, grass: 0x33405e,
    landmark: 'robot', desc: 'Neon future city with robots and holograms.'
  }
];

export function themeById(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

export function randomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)].id;
}
