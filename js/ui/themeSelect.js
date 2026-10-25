import { THEMES } from '../data/themes.js';
import { openModal, closeModal } from './modals.js';

export function openThemeSelect({ defaultId, onPick }) {
  let sel = defaultId || THEMES[0].id;

  openModal({
    title: 'Select a Theme',
    closable: false,
    bodyHTML: `
      <div class="center muted">Pick the theme for your lot. It changes the look of the casino and unlocks a themed landmark.</div>
      <div class="theme-grid big">
        ${THEMES.map(t => `<button class="theme-card ${t.id === sel ? 'active' : ''}" data-theme="${t.id}">
          <span class="tc-icon">${t.icon}</span>
          <span class="tc-name">${t.name}</span>
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
