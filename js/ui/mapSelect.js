import { THEMES } from '../data/themes.js';
import { LOT_NAMES } from '../data/lots.js';

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
  { id: 'small', label: 'Small', radius: 4, cost: 0, cash: 8000 },
  { id: 'medium', label: 'Medium', radius: 5, cost: 4000, cash: 4000 },
  { id: 'large', label: 'Large', radius: 6, cost: 7000, cash: 1000 },
  { id: 'large', label: 'Large', radius: 6, cost: 7000, cash: 1000 }
];

export function openMapSelect({ onPick, onBack }) {
  const themes = shuffle(THEMES).slice(0, LOT_SIZES.length);
  const names = shuffle(LOT_NAMES).slice(0, LOT_SIZES.length);
  let selected = 0;

  const el = document.createElement('div');
  el.className = 'lotmap-screen';
  el.innerHTML = `
    <div class="lotmap-inner">
      <div class="lotmap-top">
        <div class="lotmap-title">Vegas Strip — Buy a Lot</div>
        <div class="lotmap-sub">Click a lot to select it, then press Buy Lot.</div>
      </div>
      <div class="lotmap-body">
        <div class="lotmap-road">
          <div class="map-lane-line"></div>
          <span class="map-car">🚗</span>
          <span class="map-car delay1">🚙</span>
          <span class="map-car delay2">🚕</span>
          <span class="map-car delay3">🚌</span>
          <span class="map-tram">🚋</span>
        </div>
        <div class="lotmap-plots">
          ${LOT_SIZES.map((lot, i) => {
            const t = themes[i];
            return `<button class="lotplot" data-idx="${i}" style="--accent:${hex(t.accent)}">
              <span class="lotplot-name">${names[i]}</span>
              <span class="lotplot-size">${lot.label} · ${lot.radius * 2 + 1}×${lot.radius * 2 + 1}</span>
              <span class="lotplot-theme">${t.icon} ${t.name}</span>
              <span class="lotplot-price">${lot.cost ? '-$' + lot.cost.toLocaleString() : 'Free'}</span>
              <span class="lotplot-ring"></span>
            </button>`;
          }).join('')}
        </div>
      </div>
      <div class="lotmap-footer">
        <div class="lotmap-sel" id="lotmap-sel"></div>
        <button class="btn btn-gold" data-buy style="width:auto;margin:0;padding:12px 18px;">Buy Lot</button>
        <button class="btn btn-ghost" data-back style="width:auto;margin:0;padding:12px 18px;">Back</button>
      </div>
    </div>`;
  document.body.appendChild(el);

  const plots = Array.from(el.querySelectorAll('.lotplot'));
  const selEl = el.querySelector('#lotmap-sel');

  function refresh() {
    plots.forEach((p, i) => p.classList.toggle('selected', i === selected));
    const lot = LOT_SIZES[selected];
    const t = themes[selected];
    selEl.innerHTML = `<b>${names[selected]}</b> · ${t.icon} ${t.name} · ${lot.label} (${lot.radius * 2 + 1}×${lot.radius * 2 + 1}) · start $${lot.cash.toLocaleString()}${lot.cost ? ` · cost -$${lot.cost.toLocaleString()}` : ''}`;
  }

  plots.forEach((p, i) => p.addEventListener('click', () => { selected = i; refresh(); }));
  el.querySelector('[data-buy]').addEventListener('click', () => {
    const lot = LOT_SIZES[selected];
    const t = themes[selected];
    el.remove();
    onPick && onPick({ theme: t.id, radius: lot.radius, cash: lot.cash, name: names[selected] });
  });
  el.querySelector('[data-back]').addEventListener('click', () => {
    el.remove();
    onBack && onBack();
  });

  refresh();
  return { close: () => el.remove() };
}
