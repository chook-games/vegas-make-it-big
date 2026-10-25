const CACHE = 'vegas-mib-v47';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './css/base.css',
  './css/hud.css',
  './css/panels.css',
  './css/screens.css',
  './js/main.js',
  './js/core/constants.js',
  './js/core/events.js',
  './js/core/state.js',
  './js/core/save.js',
  './js/i18n/i18n.js',
  './js/data/buildings.js',
  './js/data/categories.js',
  './js/data/sizes.js',
  './js/data/lots.js',
  './js/data/goods.js',
  './js/data/desires.js',
  './js/data/scenarioEvents.js',
  './js/data/utilities.js',
  './js/data/betting.js',
  './js/data/quests.js',
  './js/data/achievements.js',
  './js/data/randomEvents.js',
  './js/data/levels.js',
  './js/data/staff.js',
  './js/data/themes.js',
  './js/data/campaign.js',
  './js/audio/audio.js',
  './js/three/scene.js',
  './js/three/meshkit.js',
  './js/three/meshes.js',
  './js/three/meshes-exterior.js',
  './js/three/meshes-interior.js',
  './js/three/worlds.js',
  './js/three/controls.js',
  './js/three/sky.js',
  './js/three/particles.js',
  './js/three/postfx.js',
  './js/three/city.js',
  './js/three/icons.js',
  './js/game/economy.js',
  './js/game/daynight.js',
  './js/game/randomEvents.js',
  './js/game/placement.js',
  './js/game/inspector.js',
  './js/game/guests.js',
  './js/game/prestige.js',
  './js/game/quests.js',
  './js/game/tutorial.js',
  './js/game/leveling.js',
  './js/game/staff.js',
  './js/game/plots.js',
  './js/game/lots.js',
  './js/game/noise.js',
  './js/game/archetypes.js',
  './js/game/paths.js',
  './js/game/campaign.js',
  './js/game/npc.js',
  './js/game/weather.js',
  './js/game/missions.js',
  './js/game/scenarioEvents.js',
  './js/ui/toast.js',
  './js/ui/hud.js',
  './js/ui/dock.js',
  './js/ui/modals.js',
  './js/ui/screens.js',
  './js/ui/staffScreen.js',
  './js/ui/plotsScreen.js',
  './js/ui/lotScreen.js',
  './js/ui/campaignScreen.js',
  './js/ui/rivalsScreen.js',
  './js/ui/statsScreen.js',
  './js/ui/pricingScreen.js',
  './js/ui/viewFilterScreen.js',
  './js/ui/peoplePanel.js',
  './js/ui/lotPurchase.js',
  './js/ui/themeSelect.js',
  './js/ui/objectivesScreen.js',
  './js/ui/mainMenu.js',
  './js/ui/mapSelect.js',
  './js/ui/sandboxScreen.js',
  './js/ui/heatmap.js',
  './js/ui/settings.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
