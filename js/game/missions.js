import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { save } from '../core/save.js';
import { playSound } from '../audio/audio.js';
import { inCampaign } from './campaign.js';

const POOL = [
  { type: 'earn', min: 5000, max: 30000, step: 1000, cash: 1500, label: (n) => `Earn $${n.toLocaleString()}` },
  { type: 'buildings', min: 2, max: 5, step: 1, cash: 1200, label: (n) => `Build ${n} buildings` },
  { type: 'upgrades', min: 1, max: 3, step: 1, cash: 1100, label: (n) => `Upgrade ${n} buildings` },
  { type: 'guests', min: 20, max: 60, step: 10, cash: 1000, label: (n) => `Serve ${n} guests` },
  { type: 'staff', min: 1, max: 3, step: 1, cash: 1100, label: (n) => `Hire ${n} staff` },
  { type: 'rep', min: 2, max: 6, step: 1, cash: 1200, label: (n) => `Gain ${n} reputation` },
  { type: 'level', min: 1, max: 1, step: 1, cash: 2200, gold: 1, label: () => 'Gain a level' }
];

function totalStaff() {
  let n = 0;
  for (const id in state.staff) n += state.staff[id];
  return n;
}

function currentValue(type) {
  switch (type) {
    case 'earn': return state.stats.totalEarned || 0;
    case 'buildings': return state.stats.buildingsBuilt || 0;
    case 'upgrades': return state.stats.upgrades || 0;
    case 'guests': return Math.floor(state.stats.guestsServed || 0);
    case 'staff': return totalStaff();
    case 'rep': return state.reputation;
    case 'level': return state.level;
    default: return 0;
  }
}

let uid = 1;

function makeMission(exclude) {
  const pool = POOL.filter(p => !exclude || p.type !== exclude);
  const tpl = pool[Math.floor(Math.random() * pool.length)];
  const range = Math.floor((tpl.max - tpl.min) / tpl.step);
  const target = tpl.min + Math.floor(Math.random() * (range + 1)) * tpl.step;
  return {
    id: 'm' + (uid++) + '_' + tpl.type,
    type: tpl.type,
    target,
    start: currentValue(tpl.type),
    cash: tpl.cash,
    gold: tpl.gold || 0,
    label: tpl.label(target)
  };
}

export function ensureDailies() {
  if (!Array.isArray(state.dailies)) state.dailies = [];
  while (state.dailies.length < 3) state.dailies.push(makeMission());
}

export function missionProgress(m) {
  const cur = currentValue(m.type) - m.start;
  return { current: Math.max(0, Math.min(m.target, Math.floor(cur))), target: m.target };
}

export function missionDone(m) {
  return currentValue(m.type) - m.start >= m.target;
}

export function checkDailies() {
  if (inCampaign()) return;
  ensureDailies();
  let changed = false;
  for (let i = 0; i < state.dailies.length; i++) {
    const m = state.dailies[i];
    if (missionDone(m)) {
      state.cash += m.cash || 0;
      if (m.gold) state.gold += m.gold;
      playSound('quest');
      const rewardTxt = m.cash ? ` +$${m.cash.toLocaleString()}` : '';
      Bus.emit(EV.TOAST, { text: `📋 Mission complete: ${m.label}!${rewardTxt}`, kind: 'good' });
      state.dailies[i] = makeMission(m.type);
      changed = true;
    }
  }
  if (changed) {
    Bus.emit(EV.UI_REFRESH);
    save();
  }
}

export function refreshDailies() {
  state.dailies = [makeMission(), makeMission(), makeMission()];
  Bus.emit(EV.TOAST, { text: '📋 New daily missions available!', kind: 'info' });
  Bus.emit(EV.UI_REFRESH);
}

export function onDayPassed(day) {
  if (state.dailyDay == null) state.dailyDay = day;
  if (day - state.dailyDay >= 3) {
    state.dailyDay = day;
    refreshDailies();
  }
}

export function dailiesSnapshot() {
  ensureDailies();
  return state.dailies.map(m => ({ id: m.id, label: m.label, ...missionProgress(m), cash: m.cash, gold: m.gold, done: missionDone(m) }));
}
