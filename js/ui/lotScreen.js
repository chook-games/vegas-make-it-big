import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { THEMES, themeById } from '../data/themes.js';
import { switchLot, buyLot, canBuyLot, lotCost, maxLots } from '../game/lots.js';

let selectedTheme = 'american';

function themeChips() {
  return THEMES.map(t => `<button class="theme-chip ${selectedTheme === t.id ? 'active' : ''}" data-theme="${t.id}" title="${t.name}">${t.icon}</button>`).join('');
}

function buildBody() {
  const lots = state.lots.map((lot, i) => {
    const th = themeById(lot.theme);
    const active = i === state.activeLot;
    const cells = Object.keys(lot.exteriorGrid).length + Object.keys(lot.interiorGrid).length;
    return `<div class="list-row ${active ? 'done' : ''}">
      <div class="list-icon">${th.icon}</div>
      <div class="list-main">
        <div class="list-name">${lot.name} · ${th.name} ${active ? '✅' : ''}</div>
        <div class="list-desc">${cells} buildings · size ${(lot.radius || 7) * 2 + 1}×${(lot.radius || 7) * 2 + 1}</div>
      </div>
      ${active ? '' : `<button class="staff-btn" data-goto="${i}">➡️</button>`}
    </div>`;
  }).join('');

  const buy = canBuyLot()
    ? `<div class="spacer"></div>
       <div class="muted">New lot - pick a theme (changes the look & attractions):</div>
       <div class="theme-grid">${themeChips()}</div>
       <div class="settings-row"><span class="settings-label">Cost</span><span style="color:${state.cash >= lotCost() ? '#06d6a0' : '#ff8080'}">$${lotCost().toLocaleString()}</span></div>`
    : `<div class="spacer"></div><div class="center muted">You reached the maximum (${maxLots()} lots).</div>`;

  return `<div class="center muted">Vegas Strip · ${state.lots.length}/${maxLots()} lots</div>
    <div class="spacer"></div>${lots}${buy}`;
}

function render() {
  openModal({
    title: '🗺️ Vegas Strip · Lots',
    bodyHTML: buildBody(),
    actions: canBuyLot() ? [{
      label: state.cash >= lotCost() ? `Buy New Lot ($${lotCost().toLocaleString()})` : `Need $${lotCost().toLocaleString()}`,
      cls: 'btn-gold',
      onClick: () => { if (buyLot(selectedTheme)) render(); }
    }] : [],
    onOpen: (bodyEl) => {
      bodyEl.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
        switchLot(parseInt(b.dataset.goto, 10));
        render();
      }));
      bodyEl.querySelectorAll('[data-theme]').forEach(b => b.addEventListener('click', () => {
        selectedTheme = b.dataset.theme;
        render();
      }));
    }
  });
}

export function openLotScreen() {
  render();
}
