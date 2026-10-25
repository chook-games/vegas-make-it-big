import { state, makeLot, syncActiveGrids } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { SCENARIOS } from '../data/campaign.js';
import { calculateTotals } from './economy.js';
import { switchLot } from './lots.js';
import { resetToNew, save } from '../core/save.js';
import { playSound, vibrate } from '../audio/audio.js';

export function inCampaign() {
  return state.gameMode === 'campaign';
}

export function currentScenario() {
  if (!inCampaign()) return null;
  return SCENARIOS[state.campaignIndex] || null;
}

function totalBuildings() {
  let n = 0;
  for (const lot of state.lots) {
    n += Object.keys(lot.exteriorGrid).length + Object.keys(lot.interiorGrid).length;
  }
  return n;
}

function lotBuildings() {
  return Object.keys(state.exteriorGrid).length + Object.keys(state.interiorGrid).length;
}

function hasLandmark(id) {
  for (const k in state.exteriorGrid) if (state.exteriorGrid[k].item.id === id) return true;
  for (const k in state.interiorGrid) if (state.interiorGrid[k].item.id === id) return true;
  return false;
}

function hasBuilding(id) {
  const lot = state.lots[state.activeLot];
  if (!lot) return false;
  const grids = [lot.exteriorGrid, lot.interiorGrid, lot.interiorUpperGrid || {}];
  for (const grid of grids) {
    for (const k in grid) if (grid[k].item.id === id) return true;
  }
  return false;
}

function hasUpgraded(id) {
  const lot = state.lots[state.activeLot];
  if (!lot) return false;
  const grids = [lot.exteriorGrid, lot.interiorGrid, lot.interiorUpperGrid || {}];
  for (const grid of grids) {
    for (const k in grid) if (grid[k].item.id === id && grid[k].level >= 2) return true;
  }
  return false;
}

function countPaths() {
  const lot = state.lots[state.activeLot];
  if (!lot) return 0;
  let n = 0;
  for (const k in lot.exteriorGrid) if (lot.exteriorGrid[k].item.isPath) n++;
  return n;
}

function countUpper() {
  const lot = state.lots[state.activeLot];
  if (!lot) return 0;
  return Object.keys(lot.interiorUpperGrid || {}).length;
}

function countBuild(id) {
  const lot = state.lots[state.activeLot];
  if (!lot) return 0;
  let n = 0;
  const grids = [lot.exteriorGrid, lot.interiorGrid, lot.interiorUpperGrid || {}];
  for (const grid of grids) {
    for (const k in grid) if (grid[k].item.id === id) n++;
  }
  return n;
}

function totalStaffCount() {
  let n = 0;
  for (const id in state.staff) n += state.staff[id];
  return n;
}

function goalCurrent(g) {
  switch (g.type) {
    case 'cash': return Math.floor(state.cash);
    case 'rep': return Math.round(state.reputation);
    case 'level': return state.level;
    case 'lots': return state.lots.length;
    case 'staff': return totalStaffCount();
    case 'buildings': return totalBuildings();
    case 'lotBuildings': return lotBuildings();
    case 'guests': return calculateTotals().guests;
    case 'landmark': return hasLandmark(g.target) ? 1 : 0;
    case 'build': return hasBuilding(g.target) ? 1 : 0;
    case 'countBuild': return countBuild(g.target);
    case 'upgradeBuilding': return hasUpgraded(g.target) ? 1 : 0;
    case 'paths': return countPaths();
    case 'cashierVisit': return state.stats.cashierVisits || 0;
    case 'pokerAdjusted': return state.stats.pokerAdjusted || 0;
    case 'stairs': return hasBuilding('stairs') ? 1 : 0;
    case 'upperBuilt': return countUpper();
    default: return 0;
  }
}

export function goalStatus() {
  const sc = currentScenario();
  if (!sc) return [];
  return sc.goals.map(g => {
    const target = g.amount != null ? g.amount : (typeof g.target === 'number' ? g.target : 1);
    const current = goalCurrent(g);
    return {
      label: g.label,
      current,
      target,
      done: current >= target,
      pct: Math.min(100, (current / target) * 100)
    };
  });
}

export function allGoalsDone() {
  const st = goalStatus();
  return st.length > 0 && st.every(g => g.done);
}

function computeStars(sc) {
  const daysUsed = Math.max(1, state.clock.day - state.scenarioStartDay + 1);
  if (daysUsed <= sc.targetDays) return 3;
  if (daysUsed <= Math.ceil(sc.targetDays * 1.6)) return 2;
  return 1;
}

export function isScenarioUnlocked(i) {
  return i <= state.campaignIndex;
}

export function checkCampaign() {
  if (!inCampaign()) return;
  const sc = currentScenario();
  if (!sc) return;
  if (!allGoalsDone()) return;
  completeScenario(sc);
}

function completeScenario(sc) {
  const stars = computeStars(sc);
  state.campaignStars[sc.id] = Math.max(state.campaignStars[sc.id] || 0, stars);
  if (sc.reward) {
    if (sc.reward.cash) state.cash += sc.reward.cash;
    if (sc.reward.gold) state.gold += sc.reward.gold;
  }
  playSound('achievement');
  vibrate([20, 40, 20, 40]);
  state.campaignIndex += 1;
  const hasNext = state.campaignIndex < SCENARIOS.length;
  Bus.emit('campaign:complete', { scenario: sc, stars, reward: sc.reward, hasNext });
  Bus.emit(EV.UI_REFRESH);
  save();
}

export function startScenario(i) {
  const sc = SCENARIOS[i];
  if (!sc) return;
  const stars = state.campaignStars;
  resetToNew();
  state.gameMode = 'campaign';
  state.campaignStars = stars || {};
  state.campaignIndex = i;
  const lot = state.lots[0];
  lot.theme = sc.theme;
  if (sc.startHour != null) state.clock.hour = sc.startHour;
  if (state.cash < sc.startCash) state.cash = sc.startCash;
  switchLot(0, true);
  state.scenarioStartDay = state.clock.day;
  Bus.emit(EV.TOAST, { text: `🎬 Scenario ${i + 1}: ${sc.title}`, kind: 'good' });
  Bus.emit(EV.UI_REFRESH);
  save();
}

export function startCampaign() {
  state.campaignStars = {};
  startScenario(0);
}

export function startFreePlay() {
  resetToNew();
  state.gameMode = 'freeplay';
  Bus.emit(EV.UI_REFRESH);
  save();
}

export function startFreePlayWithTheme(themeId) {
  startFreePlay();
  const lot = state.lots[0];
  lot.theme = themeId;
  if (lot) switchLot(0, true);
  save();
}

export function startFreePlayLot({ theme, radius, cash, name }) {
  resetToNew();
  state.gameMode = 'freeplay';
  const lot = state.lots[0];
  lot.theme = theme || 'american';
  lot.radius = radius || 5;
  if (name) lot.name = name;
  state.plots = 0;
  if (typeof cash === 'number') state.cash = cash;
  syncActiveGrids();
  switchLot(0, true);
  Bus.emit(EV.UI_REFRESH);
  save();
}

export function campaignProgress() {
  return {
    index: state.campaignIndex,
    total: SCENARIOS.length,
    stars: Object.values(state.campaignStars).reduce((a, b) => a + b, 0),
    maxStars: SCENARIOS.length * 3
  };
}
