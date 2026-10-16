import { state, activeLot } from './core/state.js';
import { Bus, EV } from './core/events.js';
import { TICK_MS, SAVE_INTERVAL_MS, OFFLINE_CAP_HOURS, OFFLINE_EFFICIENCY } from './core/constants.js';
import { hasSave, load, save, resetToNew } from './core/save.js';
import { createWorlds } from './three/worlds.js';
import { animatedObjects, vehicles, exteriorGroup, interiorGroup, applySettings, onResize } from './three/scene.js';
import { renderFrame, initPostFX, resizePostFX } from './three/postfx.js';
import { updateParticles, spawnConfetti, spawnMoneyBurst, setWeatherParticles, updateWeatherParticles, triggerLightning, tickLightning } from './three/particles.js';
import { initControls, updateCamera, rotateCameraStep } from './three/controls.js';
import { initToast, spawnFloatingText } from './ui/toast.js';
import { initHUD, updateHUD } from './ui/hud.js';
import { initDock, renderDock } from './ui/dock.js';
import { initInspector, closeInspector } from './game/inspector.js';
import { initPlacement, handleTileTap, hoverPlacement, seedStarterResort, rebuildBuildingsFromState, cancelPendingPlacement, rotatePendingPlacement, confirmPendingPlacement } from './game/placement.js';
import { initTutorial, beginTutorial } from './game/tutorial.js';
import { initScreens, openQuestsScreen, openAchievementsScreen, openPrestigeScreen, openOfflineScreen, openLevelUpScreen } from './ui/screens.js';
import { openStaffScreen } from './ui/staffScreen.js';
import { openLotScreen } from './ui/lotScreen.js';
import { openCampaignScreen } from './ui/campaignScreen.js';
import { openMainMenu } from './ui/mainMenu.js';
import { openMapSelect } from './ui/mapSelect.js';
import { openRivalsScreen } from './ui/rivalsScreen.js';
import { openSandboxScreen } from './ui/sandboxScreen.js';
import { startFreePlayLot, startFreePlayWithTheme, checkCampaign } from './game/campaign.js';
import { npcTick } from './game/npc.js';
import { checkDailies, onDayPassed } from './game/missions.js';
import { applyStaticI18n } from './i18n/i18n.js';
import { setAllEdges } from './data/betting.js';
import { openSettingsScreen } from './ui/settings.js';
import { openPlotsScreen } from './ui/plotsScreen.js';
import { toggleHeatmap, initHeatmap, applyHeatmap } from './ui/heatmap.js';
import { currentTheme } from './game/lots.js';
import { applyThemeToTiles, applyRadius } from './three/worlds.js';
import { updateDayNight } from './game/daynight.js';
import { updateEvents } from './game/randomEvents.js';
import { updateWeather, weatherId } from './game/weather.js';
import { doIncomeTick, calculateTotals } from './game/economy.js';
import { updateGuests, animateGuests } from './game/guests.js';
import { checkProgress } from './game/quests.js';
import { canPrestige } from './game/prestige.js';
import { playSound, vibrate, unlockAudio, startMusic, refreshMusic } from './audio/audio.js';

const clock = new THREE.Clock();
let booted = false;

function initUI() {
  initToast();
  initHUD();
  initDock();
  initInspector();
  initPlacement();
  initTutorial();
  initScreens();

  document.getElementById('btn-switch-view').addEventListener('click', switchView);
  document.getElementById('btn-cam-rotate').addEventListener('click', () => { rotateCameraStep(); playSound('rotate'); });
  document.getElementById('btn-sound').addEventListener('click', toggleSound);
  document.getElementById('btn-settings').addEventListener('click', () => { closeInspector(); openSettingsScreen(); });
  document.getElementById('btn-staff').addEventListener('click', () => { closeInspector(); openStaffScreen(); });
  document.getElementById('btn-plots').addEventListener('click', () => { closeInspector(); openPlotsScreen(); });
  document.getElementById('btn-lots').addEventListener('click', () => { closeInspector(); openLotScreen(); });
  document.getElementById('btn-campaign').addEventListener('click', () => { closeInspector(); openCampaignScreen(); });
  document.getElementById('btn-rivals').addEventListener('click', () => { closeInspector(); openRivalsScreen(); });
  document.getElementById('btn-heat').addEventListener('click', () => toggleHeatmap());
  document.getElementById('btn-quests').addEventListener('click', () => { closeInspector(); openQuestsScreen(); });
  document.getElementById('btn-ach').addEventListener('click', () => { closeInspector(); openAchievementsScreen(); });
  document.getElementById('btn-prestige').addEventListener('click', () => { closeInspector(); openPrestigeScreen(); });

  const oddsModal = document.getElementById('odds-modal');
  document.getElementById('btn-odds').addEventListener('click', () => {
    oddsModal.style.display = oddsModal.style.display === 'block' ? 'none' : 'block';
  });
  document.getElementById('odds-close').addEventListener('click', () => { oddsModal.style.display = 'none'; });
  document.getElementById('odds-slider').addEventListener('input', (e) => {
    state.houseEdge = parseInt(e.target.value, 10);
    document.getElementById('ui-odds-val').textContent = `${state.houseEdge}%`;
    document.getElementById('odds-modal-label').textContent = `${state.houseEdge}% House Edge`;
    setAllEdges(state.houseEdge);
    Bus.emit('odds:set', state.houseEdge);
    updateHUD();
  });

  document.getElementById('btn-sound').textContent = state.settings.sound ? '🔊' : '🔇';

  window.addEventListener('resize', () => { onResize(); resizePostFX(); });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
      if (state.pendingPlacement) { rotatePendingPlacement(); e.preventDefault(); }
    } else if (e.key === 'Escape') {
      if (state.pendingPlacement) { cancelPendingPlacement(); e.preventDefault(); }
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

  unlockAudio();
  document.body.addEventListener('pointerdown', unlockAudio, { once: true });

  Bus.on('level:up', (data) => {
    playSound('achievement');
    vibrate(30);
    spawnConfetti();
    openLevelUpScreen(data);
  });

  Bus.on(EV.DAY_PASSED, onDayPassed);
}

function toggleSound() {
  state.settings.sound = !state.settings.sound;
  document.getElementById('btn-sound').textContent = state.settings.sound ? '🔊' : '🔇';
  if (state.settings.sound) playSound('preview');
  save();
}

function switchView() {
  if (state.pendingPlacement) cancelPendingPlacement();
  closeInspector();
  state.selectedTool = null;

  if (state.mode === 'exterior') {
    state.mode = 'interior';
    exteriorGroup.visible = false;
    interiorGroup.visible = true;
    state.stats.viewedInterior = true;
    document.getElementById('btn-switch-view').textContent = '🌴 Exit to Strip';
    document.getElementById('ui-hint').innerHTML = '🃏 <b>Casino:</b> Pick a table below or tap one to Rotate/Upgrade!';
  } else {
    state.mode = 'exterior';
    interiorGroup.visible = false;
    exteriorGroup.visible = true;
    document.getElementById('btn-switch-view').textContent = '🎰 Enter Casino';
    document.getElementById('ui-hint').innerHTML = '🌴 <b>Strip:</b> Tap a building to Upgrade/Move or build a new one!';
  }
  Bus.emit(EV.VIEW_SWITCH, state.mode);
  renderDock();
  updateHUD();
}

let lastGuestUpdate = 0;
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta() * 1000, 100);
  const t = clock.getElapsedTime();

  updateCamera();
  if (booted) {
    updateDayNight(dt);
    updateEvents(dt);
    updateWeather(dt);
    const wid = weatherId();
    setWeatherParticles(wid);
    if (wid === 'storm' && Math.random() < 0.006) triggerLightning();
    tickLightning(dt / 1000);
  }

  if (state.pendingPlacement && state.pendingPlacement.mesh) {
    state.pendingPlacement.mesh.position.y = 0.12 + Math.sin(t * 6) * 0.06;
  }

  animatedObjects.forEach(obj => { if (obj.type === 'spin') obj.mesh.rotation.y += 0.035; });

  vehicles.forEach(v => {
    v.mesh.position.x += v.speed;
    if (v.mesh.position.x > 20) v.mesh.position.x = -20;
    if (v.mesh.position.x < -20) v.mesh.position.x = 20;
  });

  lastGuestUpdate += dt;
  if (booted && lastGuestUpdate > 500) {
    lastGuestUpdate = 0;
    const totals = calculateTotals();
    state._blackout = totals.hasBlackout;
    updateGuests(dt, totals);
  }
  if (booted) animateGuests(dt);
  updateParticles(dt / 1000);

  renderFrame();
}

function incomeTick() {
  const totals = doIncomeTick();
  npcTick();
  updateHUD();

  if (totals.hasBlackout && !state._wasShort) {
    const what = totals.powerShort && totals.waterShort ? 'Power & Water'
      : totals.powerShort ? 'Power' : 'Water';
    Bus.emit(EV.TOAST, { text: `⚠️ ${what} shortage! Build supply or guests will leave.`, kind: 'bad' });
  }
  state._wasShort = totals.hasBlackout;

  const activeGrid = state.mode === 'exterior' ? state.exteriorGrid : state.interiorGrid;
  let shown = 0;
  Object.values(activeGrid).forEach(cell => {
    if (shown >= 6 || totals.totalIncome === 0) return;
    if (cell.mesh && cell.item.income > 0) {
      spawnFloatingText(cell.mesh.position, `+$${Math.max(1, Math.round(cell.item.income * cell.level))}`, '#06d6a0');
      shown++;
    }
  });

  checkProgress();
  refreshPrestigeAlert();
  if (state.heatmap) applyHeatmap();
  checkCampaign();
  checkDailies();
}

function refreshPrestigeAlert() {
  const btn = document.getElementById('btn-prestige');
  if (!btn) return;
  btn.classList.toggle('alert', canPrestige());
}

function computeOffline(raw) {
  const awayMs = Date.now() - (raw.lastSavedAt || Date.now());
  if (awayMs < 60000) return;
  const totals = calculateTotals();
  const capped = Math.min(awayMs, OFFLINE_CAP_HOURS * 3600000);
  const earned = Math.max(0, Math.round((totals.totalIncome / TICK_MS) * capped * OFFLINE_EFFICIENCY));
  if (earned > 0) {
    state.cash += earned;
    setTimeout(() => openOfflineScreen(awayMs, earned), 500);
  }
}

function applySandbox(cfg) {
  state.maxPopulation = cfg.maxPopulation || 0;
  state.eventsFreq = cfg.eventsFreq != null ? cfg.eventsFreq : 1;
  state.disastersFreq = cfg.disastersFreq != null ? cfg.disastersFreq : 1;
  state.unlockAll = !!cfg.unlockAll;
  if (cfg.startHour != null) state.clock.hour = cfg.startHour;
}

function startNewGame() {
  resetToNew();
  applyRadius(activeLot().radius || 3);
  applyThemeToTiles(currentTheme());
  seedStarterResort();
  beginTutorial();
  Bus.emit(EV.UI_REFRESH);
  checkProgress();
  save();
}

function startContinue(raw) {
  applyRadius(activeLot().radius || 3);
  applyThemeToTiles(currentTheme());
  rebuildBuildingsFromState();
  computeOffline(raw);
  if (!state.tutorialDone) beginTutorial();
  Bus.emit(EV.UI_REFRESH);
  checkProgress();
}

function applyLightingRefresh() {
  updateDayNight(0);
}

function boot() {
  initUI();
  createWorlds();
  initControls({
    onTap: handleTileTap,
    onHover: hoverPlacement,
    onDesktopClick: (x, y) => {
      if (state.pendingPlacement) confirmPendingPlacement();
      else handleTileTap(x, y);
    }
  });
  applySettings();
  initPostFX();
  applyStaticI18n();

  const existing = hasSave();
  let raw = null;
  if (existing) raw = load();

  const launch = () => {
    booted = true;
    if (state.settings.music) startMusic();
    refreshMusic();
    updateHUD();
    renderDock();
    refreshPrestigeAlert();
    initHeatmap();
  };

  document.getElementById('loading').classList.add('hide');

  const menu = () => openMainMenu({
    hasSave: hasSave(),
    onContinue: () => { const r = load() || raw || {}; startContinue(r); launch(); },
    onCampaign: () => openCampaignScreen({
      fromMenu: true,
      onStarted: () => { beginTutorial(); launch(); },
      onBack: () => menu()
    }),
    onFreePlay: () => openMapSelect({
      onPick: (lot) => openSandboxScreen({
        defaultCash: lot.cash,
        onStart: (cfg) => {
          startFreePlayLot({ theme: lot.theme, radius: lot.radius, cash: cfg.cash });
          applySandbox(cfg);
          seedStarterResort();
          beginTutorial();
          Bus.emit(EV.UI_REFRESH);
          launch();
        },
        onBack: () => menu()
      }),
      onBack: () => menu()
    }),
    onSettings: () => openSettingsScreen()
  });

  menu();
}

setInterval(() => { if (booted) save(); }, SAVE_INTERVAL_MS);
setInterval(() => { if (booted) incomeTick(); }, TICK_MS);

boot();
loop();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
