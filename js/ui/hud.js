import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { calculateTotals } from '../game/economy.js';
import { formatClock, seasonInfo } from '../game/daynight.js';
import { levelProgress } from '../game/leveling.js';
import { totalStaff } from '../game/staff.js';

export function updateHUD() {
  const totals = calculateTotals();

  document.getElementById('ui-cash').textContent = `$${Math.floor(state.cash).toLocaleString()}`;

  const incEl = document.getElementById('ui-income');
  incEl.textContent = `${totals.totalIncome >= 0 ? '+' : ''}$${totals.totalIncome}`;
  incEl.style.color = totals.totalIncome >= 0 ? '#06d6a0' : '#ff4d4d';

  const powEl = document.getElementById('ui-power');
  powEl.textContent = `${totals.powerUsed}/${totals.powerCap}`;
  powEl.style.color = totals.hasBlackout ? '#ff4d4d' : '#00f5d4';

  document.getElementById('ui-guests').textContent = `${totals.guests}`;

  const repEl = document.getElementById('ui-rep');
  repEl.textContent = `⭐ Φήμη ${Math.round(state.reputation)} · 😊 ${Math.round(state.happiness)}%`;

  document.getElementById('ui-clock').textContent = formatClock();
  const s = seasonInfo();
  document.getElementById('ui-season').textContent = `${s.icon} ${s.name}`;

  document.getElementById('ui-odds-val').textContent = `${state.houseEdge}%`;

  const lp = levelProgress();
  document.getElementById('ui-xp-fill').style.width = `${lp.pct}%`;
  document.getElementById('ui-level').textContent = `Lv.${lp.level} · ${lp.rank} · ${lp.xp}/${lp.need} XP`;

  document.getElementById('ui-gold').textContent = `💎 ${state.gold}`;
  document.getElementById('ui-staff').textContent = `👔 ${totalStaff()} εργαζόμενοι`;

  return totals;
}

export function initHUD() {
  Bus.on(EV.UI_REFRESH, updateHUD);
  Bus.on(EV.CASH_CHANGED, updateHUD);
}
