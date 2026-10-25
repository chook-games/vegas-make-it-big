import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';

const SIZES = [
  { id: 'small', label: 'Small', radius: 4, cost: 0 },
  { id: 'medium', label: 'Medium', radius: 5, cost: 4000 },
  { id: 'large', label: 'Large', radius: 6, cost: 7000 }
];

export function openLotPurchase({ onPick, themeName }) {
  const content = SIZES.map(s => {
    const dim = s.radius * 2 + 1;
    const afford = state.cash >= s.cost;
    return `<div class="list-row ${afford ? '' : 'locked'}">
      <div class="lotp-icon">${s.id === 'small' ? '🟩' : s.id === 'medium' ? '🟦' : '🟪'}</div>
      <div class="list-main">
        <div class="list-name">${s.label} lot · ${dim}×${dim}</div>
        <div class="list-desc">${s.cost ? 'Costs $' + s.cost.toLocaleString() : 'Free'} · leaves $${Math.max(0, state.cash - s.cost).toLocaleString()}</div>
      </div>
      <button class="btn ${afford ? (s.cost ? 'btn-gold' : 'btn-green') : 'btn-ghost'}" data-size="${s.id}" style="width:auto;margin:0;padding:9px 14px;">${afford ? 'Buy' : 'Need $' + s.cost.toLocaleString()}</button>
    </div>`;
  }).join('');

  openModal({
    title: 'Buy a Lot',
    closable: false,
    bodyHTML: `<div class="center muted">Choose your starting lot${themeName ? ' for the ' + themeName + ' theme' : ''}. Bigger fits more buildings but costs more.</div><div class="spacer"></div>${content}`,
    onOpen: (bodyEl) => {
      bodyEl.querySelectorAll('[data-size]').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = SIZES.find(x => x.id === btn.dataset.size);
          if (!s || state.cash < s.cost) return;
          closeModal();
          onPick(s);
        });
      });
    }
  });
}
