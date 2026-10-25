import { openModal, closeModal } from './modals.js';

function button(act, icon, label, disabled) {
  return `<button class="mm-btn" data-act="${act}" ${disabled ? 'disabled' : ''}><span class="mm-btn-label">${label}</span><span class="mm-btn-icon">${icon}</span></button>`;
}

export function menuSceneMarkup() {
  const buildings = Array.from({ length: 16 }).map((_, i) => {
    const h = 16 + ((i * 37) % 54);
    const w = 6 + ((i * 13) % 5);
    const hue = 260 + (i % 5) * 12;
    return `<span class="mm-bld" style="left:${i * 6.6}%;width:${w}%;height:${h}%;--hue:${hue};--lit:${i % 3 === 0}"></span>`;
  }).join('');
  return `<div class="mm-scene">
      <div class="mm-sun"></div>
      <div class="mm-skyline">${buildings}</div>
      <div class="mm-neon">VEGAS</div>
    </div>`;
}

export function openMainMenu({ hasSave, onContinue, onCampaign, onFreePlay, onSettings }) {
  const el = document.createElement('div');
  el.className = 'main-menu';
  el.innerHTML = `
    ${menuSceneMarkup()}
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
          <p>Original game © Deep Red Games / Empire Interactive. This is a non-commercial fan tribute; original audio and theme art are used for preservation.</p>
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
