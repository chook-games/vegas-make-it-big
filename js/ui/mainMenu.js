import { openModal, closeModal } from './modals.js';

function button(act, icon, label, disabled) {
  return `<button class="mm-btn" data-act="${act}" ${disabled ? 'disabled' : ''}><span class="mm-btn-label">${label}</span><span class="mm-btn-icon">${icon}</span></button>`;
}

export function openMainMenu({ hasSave, onContinue, onCampaign, onFreePlay, onSettings }) {
  const el = document.createElement('div');
  el.className = 'main-menu';
  el.innerHTML = `
    <div class="mm-panel">
      <div class="mm-title">Main Menu</div>
      <div class="mm-buttons">
        ${button('campaign', '🎯', 'Campaign')}
        ${button('sandbox', '🏗️', 'Sandbox')}
        ${button('load', '📂', 'Load Game', !hasSave)}
        ${button('config', '⚙️', 'Configuration')}
        ${button('credits', '🎬', 'Credits')}
        ${button('quit', '🚪', 'Quit')}
      </div>
      <div class="mm-foot">Vegas: Make It Big — web edition</div>
    </div>`;
  document.body.appendChild(el);

  const close = () => el.remove();

  el.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
    const act = b.dataset.act;
    if (act === 'campaign') { close(); onCampaign && onCampaign(); }
    else if (act === 'sandbox') { close(); onFreePlay && onFreePlay(); }
    else if (act === 'load') { if (!hasSave) return; close(); onContinue && onContinue(); }
    else if (act === 'config') { onSettings && onSettings(); }
    else if (act === 'credits') {
      openModal({
        title: 'Credits',
        bodyHTML: `<div class="modal-text">
          <p><b>Vegas: Make It Big — Web Edition</b></p>
          <p>Fan-made browser clone inspired by the 2003 PC game “Vegas: Make It Big” (Vegas Tycoon).</p>
          <p>Original game © Deep Red Games / Empire Interactive. This project is a non-commercial tribute; no original assets are distributed.</p>
          <p>Built with Three.js, vanilla ES modules and a lot of coffee.</p>
        </div>`,
        actions: [{ label: 'Close', cls: 'btn-ghost', onClick: closeModal }]
      });
    } else if (act === 'quit') {
      openModal({
        title: 'Quit',
        bodyHTML: '<div class="center modal-text">Thanks for playing! Close the browser tab to quit.</div>',
        actions: [{ label: 'Close', cls: 'btn-ghost', onClick: closeModal }]
      });
    }
  }));

  return { close };
}
