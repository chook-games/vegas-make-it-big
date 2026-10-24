import { state } from '../core/state.js';
import { walkers } from '../three/scene.js';
import { calculateTotals } from '../game/economy.js';
import { totalStaff, countOf } from '../game/staff.js';
import { isGambling } from '../data/betting.js';

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
