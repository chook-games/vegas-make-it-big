import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { calculateTotals } from '../game/economy.js';
import { formatClock, seasonInfo } from '../game/daynight.js';
import { levelProgress } from '../game/leveling.js';
import { totalStaff } from '../game/staff.js';
import { activeLot } from '../game/lots.js';
import { themeById } from '../data/themes.js';
import { inCampaign, currentScenario, goalStatus } from '../game/campaign.js';
import { currentWeather } from '../game/weather.js';
import { activeQuest, questProgress } from '../game/quests.js';
import { playerValue } from '../game/npc.js';

export function updateHUD() {
  const totals = calculateTotals();

  document.getElementById('ui-cash').textContent = `$${Math.floor(state.cash).toLocaleString()}`;
  document.getElementById('ui-clock').textContent = formatClock();

  const s = seasonInfo();
  document.getElementById('ui-season').textContent = `${s.icon} ${s.name}`;
  const wx = currentWeather();
  document.getElementById('ui-weather').textContent = `${wx.icon} ${wx.name}`;

  const lot = activeLot();
  if (lot) document.getElementById('ui-lot').textContent = `${themeById(lot.theme).icon} ${lot.name}`;

  document.getElementById('ui-rep').textContent = `⭐ ${Math.round(state.reputation)} · 😊 ${Math.round(state.happiness)}% · 🛠 ${Math.round(state.condition)}%`;
  document.getElementById('ui-gold').textContent = `💎 ${state.gold}`;
  document.getElementById('ui-staff').textContent = `👔 ${totalStaff()}`;
  document.getElementById('ui-level').textContent = `Lv.${levelProgress().level}`;

  const lp = levelProgress();
  const ppRank = document.getElementById('pp-rank');
  if (ppRank) {
    ppRank.textContent = `${lp.rank} · Lv.${lp.level}`;
    document.getElementById('pp-rep').textContent = `⭐${Math.round(state.reputation)}`;
    document.getElementById('pp-value').textContent = `$${playerValue().toLocaleString()}`;
  }

  updateFinance(totals);
  updateObjectives();

  return totals;
}

function updateFinance(totals) {
  const profit = document.getElementById('fin-profit');
  if (!profit) return;
  profit.textContent = `${totals.totalIncome >= 0 ? '+' : '-'}$${Math.abs(totals.totalIncome).toLocaleString()}`;
  profit.style.color = totals.totalIncome >= 0 ? '#06d6a0' : '#ff6b6b';
  document.getElementById('fin-income').textContent = `$${totals.grossIncome.toLocaleString()}`;
  document.getElementById('fin-costs').textContent = `$${totals.wages.toLocaleString()}`;
  const pow = document.getElementById('fin-power');
  pow.textContent = `⚡ ${totals.powerUsed}/${totals.powerCap}`;
  pow.style.color = totals.powerShort ? '#ff6b6b' : '#9fd6ff';
  const wat = document.getElementById('fin-water');
  wat.textContent = `💧 ${totals.waterUsed}/${totals.waterCap}`;
  wat.style.color = totals.waterShort ? '#ff6b6b' : '#9fd6ff';
  const g = document.getElementById('fin-guests');
  if (g) g.textContent = `👥 ${totals.guests}`;
  const o = document.getElementById('fin-odds');
  if (o) o.textContent = `🎲 ${state.houseEdge}%`;
}

function updateObjectives() {
  const list = document.getElementById('objectives-list');
  if (!list) return;
  let rows = '';
  if (inCampaign()) {
    const sc = currentScenario();
    if (sc) {
      goalStatus().forEach(g => {
        const pct = Math.min(100, g.pct);
        rows += `<div class="obj-row ${g.done ? 'done' : ''}"><b>${g.done ? '✔ ' : ''}${g.label}</b>
          <div class="obj-progress"><i style="width:${pct}%"></i></div>
          <div style="font-size:10px;color:#889">${Math.min(g.current, g.target).toLocaleString()} / ${g.target.toLocaleString()}</div></div>`;
      });
    } else {
      rows = '<div class="obj-row done">Campaign complete!</div>';
    }
  } else {
    const q = activeQuest();
    if (q) {
      const p = questProgress(q);
      const pct = Math.min(100, Math.round((p.current / p.target) * 100));
      rows = `<div class="obj-row"><b>${q.icon} ${q.title}</b><div style="font-size:10.5px;color:#aab">${q.desc}</div>
        <div class="obj-progress"><i style="width:${pct}%"></i></div>
        <div style="font-size:10px;color:#889">${p.current} / ${p.target}</div></div>`;
    } else {
      rows = '<div class="obj-row done">All quests complete!</div>';
    }
  }
  list.innerHTML = rows;
}

export function initHUD() {
  Bus.on(EV.UI_REFRESH, updateHUD);
  Bus.on(EV.CASH_CHANGED, updateHUD);
}

export function showBuildingFinance(income) {
  const p = document.getElementById('fin-profit');
  if (!p) return;
  const v = Math.round(income || 0);
  p.textContent = `${v >= 0 ? '+' : '-'}$${Math.abs(v).toLocaleString()}`;
  p.style.color = v >= 0 ? '#06d6a0' : '#ff6b6b';
  document.getElementById('fin-income').textContent = `$${Math.abs(v).toLocaleString()}`;
  document.getElementById('fin-costs').textContent = '—';
}

export function restoreFinance() {
  updateHUD();
}
