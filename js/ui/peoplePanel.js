import { state } from '../core/state.js';
import { walkers } from '../three/scene.js';
import { calculateTotals } from '../game/economy.js';
import { totalStaff, countOf, hire, fire, totalWages } from '../game/staff.js';
import { STAFF, staffUnlocked, staffMax } from '../data/staff.js';
import { isGambling } from '../data/betting.js';
import { playerValue, playerRank } from '../game/npc.js';

function stations() {
  let n = 0;
  for (const lot of state.lots) {
    for (const k in lot.exteriorGrid) if (isGambling('exterior', lot.exteriorGrid[k].item.id)) n++;
    for (const k in lot.interiorGrid) if (isGambling('interior', lot.interiorGrid[k].item.id)) n++;
    const up = lot.interiorUpperGrid || {};
    for (const k in up) if (isGambling('interior', up[k].item.id)) n++;
  }
  return n;
}

export function renderPeoplePanel(el) {
  if (!el) return;
  const totals = calculateTotals();
  const counts = { tourist: 0, family: 0, highroller: 0, cheater: 0 };
  for (const w of walkers) {
    if (w.arch && counts[w.arch.id] != null) counts[w.arch.id]++;
  }
  const st = stations();
  el.innerHTML = `
    <div class="people-grid">
      <div class="people-stat"><span>Guests</span><b>${totals.guests}</b></div>
      <div class="people-stat"><span>On map</span><b>${walkers.length}</b></div>
      <div class="people-stat"><span>Capacity</span><b>${totals.capacity}</b></div>
      <div class="people-stat"><span>Mood</span><b>${Math.round(state.happiness)}%</b></div>
    </div>
    <div class="people-breakdown">
      <div>🧳 Tourists <b>${counts.tourist}</b></div>
      <div>👪 Families <b>${counts.family}</b></div>
      <div>🎩 High Rollers <b>${counts.highroller}</b></div>
      <div>🕵️ Cheaters <b>${counts.cheater}</b></div>
    </div>
    <div class="people-breakdown">
      <div>👔 Staff <b>${totalStaff()}</b></div>
      <div>🤵 Croupiers <b>${countOf('dealer')}/${st}</b></div>
      <div>🛠️ Condition <b>${Math.round(state.condition)}%</b></div>
      <div>⭐ Reputation <b>${Math.round(state.reputation)}</b></div>
    </div>
  `;
}

export function renderFinancePanel(el) {
  if (!el) return;
  const t = calculateTotals();
  const st = stations();
  const profitVal = t.profitPerDay != null ? t.profitPerDay : t.totalIncome;
  const profit = `${profitVal >= 0 ? '+' : '-'}$${Math.abs(profitVal).toLocaleString()}`;
  el.innerHTML = `
    <div class="people-grid">
      <div class="people-stat"><span>Profit / day</span><b style="color:${profitVal >= 0 ? '#06d6a0' : '#ff6b6b'}">${profit}</b></div>
      <div class="people-stat"><span>Income / day</span><b>$${(t.grossPerDay != null ? t.grossPerDay : t.grossIncome).toLocaleString()}</b></div>
      <div class="people-stat"><span>Costs / day</span><b style="color:#ffb4a2">$${(t.costsPerDay != null ? t.costsPerDay : t.costs).toLocaleString()}</b></div>
      <div class="people-stat"><span>Guests</span><b>${t.guests}</b></div>
    </div>
    <div class="people-breakdown">
      <div>Wages <b>$${(t.wagesPerDay != null ? t.wagesPerDay : t.wages).toLocaleString()}</b></div>
      <div>Running <b>$${(t.runningPerDay != null ? t.runningPerDay : t.running).toLocaleString()}</b></div>
      <div>Power <b>${t.powerUsed}/${t.powerCap}</b></div>
      <div>Water <b>${t.waterUsed}/${t.waterCap}</b></div>
      <div>Croupiers <b>${countOf('dealer')}/${st}</b></div>
      <div>Condition <b>${Math.round(state.condition)}%</b></div>
    </div>
  `;
}

export function renderStaffPanel(el) {
  if (!el) return;
  const rows = STAFF.map(def => {
    const unlocked = staffUnlocked(def, state);
    const count = countOf(def.id);
    const max = staffMax(def, state);
    return `<div class="staff-mini-row">
      <span class="sm-icon">${def.icon}</span>
      <span class="sm-name">${def.name}</span>
      ${unlocked
        ? `<button class="sm-btn" data-dock-fire="${def.id}" ${count <= 0 ? 'disabled' : ''}>−</button>
           <span class="sm-count">${count}/${max}</span>
           <button class="sm-btn" data-dock-hire="${def.id}" ${count >= max ? 'disabled' : ''}>+</button>`
        : `<span class="sm-lock">🔒</span>`}
    </div>`;
  }).join('');

  el.innerHTML = `<div class="center muted" style="font-size:10.5px">Staff ${totalStaff()} · Wages $${totalWages()}/cycle</div>
    <div class="staff-mini">${rows}</div>`;

  el.querySelectorAll('[data-dock-hire]').forEach(b => {
    b.addEventListener('click', () => { hire(b.dataset.dockHire); renderStaffPanel(el); });
  });
  el.querySelectorAll('[data-dock-fire]').forEach(b => {
    b.addEventListener('click', () => { fire(b.dataset.dockFire); renderStaffPanel(el); });
  });
}

export function renderWorldPanel(el) {
  if (!el) return;
  const t = calculateTotals();
  const rank = playerRank();
  let buildings = 0;
  for (const lot of state.lots) {
    buildings += Object.keys(lot.exteriorGrid).length
      + Object.keys(lot.interiorGrid).length
      + Object.keys(lot.interiorUpperGrid || {}).length;
  }
  el.innerHTML = `
    <div class="people-grid">
      <div class="people-stat"><span>Population</span><b>${t.guests}</b></div>
      <div class="people-stat"><span>Lots</span><b>${state.lots.length}</b></div>
      <div class="people-stat"><span>Buildings</span><b>${buildings}</b></div>
      <div class="people-stat"><span>Rank</span><b>#${rank.rank}/${rank.total}</b></div>
    </div>
    <div class="people-breakdown">
      <div>💰 Cash <b>$${Math.floor(state.cash).toLocaleString()}</b></div>
      <div>⭐ Reputation <b>${Math.round(state.reputation)}</b></div>
      <div>🛠️ Condition <b>${Math.round(state.condition)}%</b></div>
      <div>🏁 Resort value <b>$${playerValue().toLocaleString()}</b></div>
    </div>
  `;
}