import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { openModal, closeModal } from './modals.js';
import { GOODS, priceT } from '../data/goods.js';
import { playSound } from '../audio/audio.js';

function rowsHTML() {
  return GOODS.map(g => {
    const price = state.prices[g.id] != null ? state.prices[g.id] : g.def;
    const t = priceT(g, price);
    const incMul = (0.5 + t * 1.3).toFixed(2);
    return `<div class="price-row" data-good="${g.id}">
      <div class="price-head">
        <span class="price-name">${g.icon} ${g.name}</span>
        <span class="price-val" id="price-val-${g.id}">$${price}</span>
      </div>
      <input type="range" class="odds-slider" id="price-${g.id}" min="${g.min}" max="${g.max}" step="${g.step}" value="${price}">
      <div class="price-meta"><span>$${g.min}</span><span id="price-mul-${g.id}">income ×${incMul}</span><span>$${g.max}</span></div>
    </div>`;
  }).join('');
}

export function openPricingScreen() {
  openModal({
    title: '💲 Price List',
    bodyHTML: `<div class="center muted">Set prices for food, drinks, rooms, shows and souvenirs. Higher prices earn more but scare guests away.</div><div class="spacer"></div>${rowsHTML()}`,
    onOpen: (bodyEl) => {
      GOODS.forEach(g => {
        const slider = bodyEl.querySelector(`#price-${g.id}`);
        if (!slider) return;
        slider.addEventListener('input', (e) => {
          const v = parseInt(e.target.value, 10);
          state.prices[g.id] = v;
          const val = bodyEl.querySelector(`#price-val-${g.id}`);
          if (val) val.textContent = `$${v}`;
          const mul = bodyEl.querySelector(`#price-mul-${g.id}`);
          if (mul) mul.textContent = `income ×${(0.5 + priceT(g, v) * 1.3).toFixed(2)}`;
          Bus.emit(EV.UI_REFRESH);
        });
        slider.addEventListener('change', () => playSound('preview'));
      });
    },
    actions: [
      { label: 'Reset to default', cls: 'btn-ghost', onClick: () => {
        GOODS.forEach(g => { state.prices[g.id] = g.def; });
        closeModal();
        openPricingScreen();
        Bus.emit(EV.UI_REFRESH);
      } },
      { label: 'Close', cls: 'btn-ghost', onClick: closeModal }
    ]
  });
}
