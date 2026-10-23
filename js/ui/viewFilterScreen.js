import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { toggleHeatmap, applyUtilityOverlay, clearUtilityOverlay } from './heatmap.js';
import { setNeedsVisible } from '../game/guests.js';

function row(label, key, checked) {
  return `<div class="settings-row">
    <div class="settings-label">${label}</div>
    <div class="toggle ${checked ? 'on' : ''}" data-vf="${key}"></div>
  </div>`;
}

export function openViewFilterScreen() {
  if (!state.viewFilter) state.viewFilter = { needs: true, heat: false, utilities: false };
  const vf = state.viewFilter;

  openModal({
    title: '🔍 View Filters',
    bodyHTML: `
      <div class="center muted">Overlay information on the map, like the original view filters.</div>
      <div class="spacer"></div>
      ${row('👥 Guest needs icons', 'needs', vf.needs)}
      ${row('🎲 Noise / Smell heatmap', 'heat', state.heatmap)}
      ${row('⚡💧 Power & Water status', 'utilities', vf.utilities)}
    `,
    onOpen: (bodyEl) => {
      bodyEl.querySelectorAll('[data-vf]').forEach(t => t.addEventListener('click', () => {
        const key = t.dataset.vf;
        if (key === 'needs') {
          vf.needs = !vf.needs;
          t.classList.toggle('on', vf.needs);
          setNeedsVisible(vf.needs);
        } else if (key === 'heat') {
          const on = !state.heatmap;
          if (on) { vf.utilities = false; clearUtilityOverlay(); }
          toggleHeatmap(on);
          t.classList.toggle('on', on);
        } else if (key === 'utilities') {
          vf.utilities = !vf.utilities;
          t.classList.toggle('on', vf.utilities);
          if (vf.utilities) {
            if (state.heatmap) toggleHeatmap(false);
            applyUtilityOverlay();
          } else {
            clearUtilityOverlay();
          }
        }
      }));
    },
    actions: [{ label: 'Close', cls: 'btn-ghost', onClick: closeModal }]
  });
}
