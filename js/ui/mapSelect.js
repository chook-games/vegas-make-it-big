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

export function openMapSelect({ onPick, onBack }) {
  const picks = shuffle(THEMES).slice(0, 4);

  const el = document.createElement('div');
  el.className = 'map-select';
  el.innerHTML = `
    <div class="ms-inner">
      <div class="ms-title">Vegas Strip — Pick a Lot</div>
      <div class="ms-sub">Start from one of the available lots on the boulevard.</div>
      <div class="map-viewport">
        <div class="map-road">
          <div class="map-lane-line"></div>
          <span class="map-car">🚗</span>
          <span class="map-car delay1">🚙</span>
          <span class="map-car delay2">🚕</span>
          <span class="map-car delay3">🚌</span>
        </div>
        <div class="map-lots">
          ${picks.map((t, i) => `
            <button class="map-lot" data-theme="${t.id}" style="border-color:${hex(t.accent)}">
              <span class="map-lot-badge">Lot ${i + 1}</span>
              <span class="map-lot-icon">${t.icon}</span>
              <span class="map-lot-name">${t.name}</span>
            </button>`).join('')}
        </div>
      </div>
      <div class="spacer"></div>
      <button class="btn btn-primary" data-random>🎲 Random Lot</button>
      <button class="btn btn-ghost" data-back>Back to Menu</button>
    </div>`;
  document.body.appendChild(el);

  const close = () => el.remove();
  el.querySelectorAll('.map-lot').forEach(b => b.addEventListener('click', () => {
    close();
    onPick && onPick(b.dataset.theme);
  }));
  el.querySelector('[data-random]').addEventListener('click', () => {
    const t = THEMES[Math.floor(Math.random() * THEMES.length)];
    close();
    onPick && onPick(t.id);
  });
  el.querySelector('[data-back]').addEventListener('click', () => {
    close();
    onBack && onBack();
  });

  return { close };
}
