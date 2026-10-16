import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { STAFF, staffUnlocked, staffMax, staffLockLabel } from '../data/staff.js';
import { countOf, hire, fire, totalWages, totalStaff } from '../game/staff.js';
import { isGambling } from '../data/betting.js';

function gamblingStations() {
  let n = 0;
  for (const lot of state.lots) {
    for (const k in lot.interiorGrid) if (isGambling('interior', lot.interiorGrid[k].item.id)) n++;
    for (const k in lot.exteriorGrid) if (isGambling('exterior', lot.exteriorGrid[k].item.id)) n++;
  }
  return n;
}

function buildBody() {
  const stations = gamblingStations();
  const croupiers = countOf('dealer');
  const cover = stations > 0 ? Math.min(100, Math.round((croupiers / stations) * 100)) : 100;
  const rows = STAFF.map(def => {
    const unlocked = staffUnlocked(def, state);
    const count = countOf(def.id);
    const max = staffMax(def, state);
    const lockTxt = unlocked ? '' : `<div class="list-reward" style="color:#ff8080;">🔒 ${staffLockLabel(def)}</div>`;
    const effTxt = def.effect.incomePct ? `+${Math.round(def.effect.incomePct * 100)}% income`
      : def.effect.guestPct ? `+${Math.round(def.effect.guestPct * 100)}% guests`
      : def.effect.happiness ? `+${def.effect.happiness} mood`
      : def.effect.crime ? `-${Math.round(def.effect.crime * 100)}% losses` : '';
    const controls = unlocked
      ? `<div class="staff-controls">
           <button class="staff-btn" data-fire="${def.id}" ${count <= 0 ? 'disabled' : ''}>−</button>
           <span class="staff-count">${count}/${max}</span>
           <button class="staff-btn" data-hire="${def.id}" ${count >= max ? 'disabled' : ''}>+</button>
         </div>`
      : '';
    return `<div class="list-row ${unlocked ? '' : 'locked'}">
      <div class="list-icon">${def.icon}</div>
      <div class="list-main">
        <div class="list-name">${def.name} ${effTxt ? `<span class="staff-eff">${effTxt}</span>` : ''}</div>
        <div class="list-desc">${def.desc}</div>
        <div class="list-reward">Cost $${def.cost.toLocaleString()} · Wage $${def.wage}/cycle</div>
        ${lockTxt}
      </div>
      ${controls}
    </div>`;
  }).join('');

  return `<div class="center muted">Total: <b>${totalStaff()}</b> staff · Wages <b>$${totalWages()}</b> / cycle</div>
    <div class="center ${cover < 100 ? 'muted' : 'muted'}" style="color:${cover < 100 ? '#ff8080' : '#06d6a0'}">Croupiers: ${croupiers}/${stations} gambling stations covered (${cover}%)</div>
    <div class="spacer"></div>${rows}`;
}

function render() {
  openModal({
    title: '👔 Staff',
    bodyHTML: buildBody(),
    onOpen: (bodyEl) => {
      bodyEl.querySelectorAll('[data-hire]').forEach(b => b.addEventListener('click', () => {
        hire(b.dataset.hire);
        render();
      }));
      bodyEl.querySelectorAll('[data-fire]').forEach(b => b.addEventListener('click', () => {
        fire(b.dataset.fire);
        render();
      }));
    }
  });
}

export function openStaffScreen() {
  closeModal();
  render();
}
