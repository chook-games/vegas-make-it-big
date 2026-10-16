import { THEMES } from '../data/themes.js';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hex(n) {
  return '#' + n.toString(16).padStart(6, '0');
}

const LOT_SIZES = [
  { id: 'small', label: 'Small', radius: 4, cost: 0, cash: 8000, note: 'Cheap, lots of starting cash' },
  { id: 'medium', label: 'Medium', radius: 5, cost: 4000, cash: 4000, note: 'Balanced size and cash' },
  { id: 'large', label: 'Large', radius: 6, cost: 7000, cash: 1000, note: 'Fits the most, least cash' }
];

export function openMapSelect({ onPick, onBack }) {
  const themes = shuffle(THEMES).slice(0, 3);

  const el = document.createElement('div');
  el.className = 'map-select';
  el.innerHTML = `
    <div class="ms-inner">
      <div class="ms-title">Vegas Strip — Buy a Lot</div>
      <div class="ms-sub">Bigger lot fits more buildings but leaves you less starting cash.</div>
      <div class="map-viewport">
        <div class="map-road">
          <div class="map-lane-line"></div>
          <span class="map-car">🚗</span>
          <span class="map-car delay1">🚙</span>
          <span class="map-car delay2">🚕</span>
          <span class="map-car delay3">🚌</span>
        </div>
        <div class="map-lots three">
          ${LOT_SIZES.map((lot, i) => {
            const t = themes[i % themes.length];
            return `<button class="map-lot lot-${lot.id}" data-idx="${i}" style="border-color:${hex(t.accent)}">
              <span class="map-lot-badge">${lot.label} · ${lot.radius * 2 + 1}×${lot.radius * 2 + 1}</span>
              <span class="map-lot-icon">${t.icon}</span>
              <span class="map-lot-name">${t.name}</span>
              <span class="map-lot-cost">${lot.cost ? '-$' + lot.cost.toLocaleString() : 'Free'} · start $${lot.cash.toLocaleString()}</span>
            </button>`;
          }).join('')}
        </div>
      </div>
      <div class="spacer"></div>
      <button class="btn btn-ghost" data-back>Back to Menu</button>
    </div>`;
  document.body.appendChild(el);

  const close = () => el.remove();
  el.querySelectorAll('.map-lot').forEach(b => b.addEventListener('click', () => {
    const lot = LOT_SIZES[parseInt(b.dataset.idx, 10)];
    const t = themes[parseInt(b.dataset.idx, 10) % themes.length];
    close();
    onPick && onPick({ theme: t.id, radius: lot.radius, cash: lot.cash });
  }));
  el.querySelector('[data-back]').addEventListener('click', () => {
    close();
    onBack && onBack();
  });

  return { close };
}
