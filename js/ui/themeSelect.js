import { THEMES } from '../data/themes.js';
import { openModal, closeModal } from './modals.js';

function hex(n) {
  return '#' + (n >>> 0).toString(16).padStart(6, '0');
}

function themeThumb(theme) {
  const c = document.createElement('canvas');
  c.width = 160;
  c.height = 100;
  const ctx = c.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 100);
    grad.addColorStop(0, hex(theme.accent));
    grad.addColorStop(1, hex(theme.shell));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 100);
    ctx.fillStyle = hex(theme.groundB);
    ctx.fillRect(0, 72, 160, 28);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(46, 30, 68, 50);
    ctx.fillStyle = hex(theme.roof);
    ctx.fillRect(40, 26, 80, 8);
    ctx.fillStyle = 'rgba(255,240,180,0.7)';
    for (let y = 38; y < 74; y += 10) {
      for (let x = 52; x < 108; x += 14) ctx.fillRect(x, y, 6, 5);
    }
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(theme.icon, 80, 52);
  }
  try { return c.toDataURL('image/png'); } catch (e) { return ''; }
}

export function openThemeSelect({ defaultId, onPick }) {
  let sel = defaultId || THEMES[0].id;

  openModal({
    title: 'Select a Theme',
    closable: false,
    className: 'green-modal',
    bodyHTML: `
      <div class="center muted">Pick the theme for your lot. It changes the look of the casino and unlocks a themed landmark.</div>
      <div class="theme-grid thumbs">
        ${THEMES.map(t => `<button class="theme-card ${t.id === sel ? 'active' : ''}" data-theme="${t.id}">
          <img class="tc-thumb" src="${t.thumb || themeThumb(t)}" alt="">
          <span class="tc-name">${t.icon} ${t.name}</span>
        </button>`).join('')}
      </div>
    `,
    onOpen: (bodyEl) => {
      bodyEl.querySelectorAll('[data-theme]').forEach(b => b.addEventListener('click', () => {
        sel = b.dataset.theme;
        bodyEl.querySelectorAll('[data-theme]').forEach(x => x.classList.toggle('active', x.dataset.theme === sel));
      }));
    },
    actions: [
      { label: 'Accept', cls: 'btn-green', onClick: () => { closeModal(); onPick && onPick(sel); } }
    ]
  });
}
