import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { calculateTotals } from '../game/economy.js';
import { formatClock, seasonInfo } from '../game/daynight.js';
import { levelProgress } from '../game/leveling.js';
import { totalStaff } from '../game/staff.js';
import { activeLot } from '../game/lots.js';
import { themeById } from '../data/themes.js';
import { inCampaign, currentScenario, goalStatus } from '../game/campaign.js';
import { playerRank } from '../game/npc.js';
import { currentWeather } from '../game/weather.js';

export function updateHUD() {
  const totals = calculateTotals();

  document.getElementById('ui-cash').textContent = `$${Math.floor(state.cash).toLocaleString()}`;

  const incEl = document.getElementById('ui-income');
  incEl.textContent = `${totals.totalIncome >= 0 ? '+' : ''}$${totals.totalIncome}`;
  incEl.style.color = totals.totalIncome >= 0 ? '#06d6a0' : '#ff4d4d';

  const powEl = document.getElementById('ui-power');
  powEl.textContent = `${totals.powerUsed}/${totals.powerCap} kW`;
  powEl.style.color = totals.powerShort ? '#ff4d4d' : '#00f5d4';

  const watEl = document.getElementById('ui-water');
  if (watEl) {
    watEl.textContent = `${totals.waterUsed}/${totals.waterCap}`;
    watEl.style.color = totals.waterShort ? '#ff4d4d' : '#4da6ff';
  }

  document.getElementById('ui-guests').textContent = `${totals.guests}`;

  const repEl = document.getElementById('ui-rep');
  repEl.textContent = `⭐ Rep ${Math.round(state.reputation)} · 😊 ${Math.round(state.happiness)}% · 🛠 ${Math.round(state.condition)}%`;

  document.getElementById('ui-clock').textContent = formatClock();
  const s = seasonInfo();
  document.getElementById('ui-season').textContent = `${s.icon} ${s.name}`;
  const wx = currentWeather();
  const wxEl = document.getElementById('ui-weather');
  if (wxEl) wxEl.textContent = `${wx.icon} ${wx.name}`;

  document.getElementById('ui-odds-val').textContent = `${state.houseEdge}%`;

  const lp = levelProgress();
  document.getElementById('ui-xp-fill').style.width = `${lp.pct}%`;
  document.getElementById('ui-level').textContent = `Lv.${lp.level} · ${lp.rank} · ${lp.xp}/${lp.need} XP`;

  document.getElementById('ui-gold').textContent = `💎 ${state.gold}`;
  document.getElementById('ui-staff').textContent = `👔 ${totalStaff()} staff`;

  const lot = activeLot();
  const lotEl = document.getElementById('ui-lot');
  if (lotEl && lot) lotEl.textContent = `${themeById(lot.theme).icon} ${lot.name}`;

  const rankEl = document.getElementById('ui-rank');
  if (rankEl) {
    const r = playerRank();
    rankEl.textContent = `🏁 #${r.rank}/${r.total}`;
    rankEl.style.color = r.rank === 1 ? '#06d6a0' : '#ff9ebb';
  }

  const goalEl = document.getElementById('ui-goal');
  if (goalEl) {
    if (inCampaign()) {
      const sc = currentScenario();
      const st = goalStatus();
      const done = st.filter(x => x.done).length;
      goalEl.style.display = '';
      goalEl.textContent = `🎯 ${sc ? sc.title : ''} (${done}/${st.length})`;
    } else {
      goalEl.style.display = 'none';
    }
  }

  return totals;
}

export function initHUD() {
  Bus.on(EV.UI_REFRESH, updateHUD);
  Bus.on(EV.CASH_CHANGED, updateHUD);
}
