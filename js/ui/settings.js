import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { openModal, closeModal } from './modals.js';
import { refreshMusic, playSound } from '../audio/audio.js';
import { applySettings } from '../three/scene.js';
import { resetToNew, save } from '../core/save.js';

function toggleRow(label, sub, key, onChange) {
  return `<div class="settings-row">
    <div>
      <div class="settings-label">${label}</div>
      ${sub ? `<div class="settings-sub">${sub}</div>` : ''}
    </div>
    <div class="toggle ${state.settings[key] ? 'on' : ''}" data-key="${key}"></div>
  </div>`;
}

export function openSettingsScreen() {
  const body = `
    ${toggleRow('🔊 Ηχητικά εφέ', 'Ήχοι κατασκευής & UI', 'sound')}
    ${toggleRow('🎵 Μουσική', 'Απαλό ambient loop', 'music')}
    ${toggleRow('📳 Δόνηση', 'Haptic feedback (mobile)', 'vibration')}
    ${toggleRow('🌑 Σκιές', 'Πιο όμορφα αλλά πιο βαρύ', 'shadows')}
    <div class="settings-row">
      <div>
        <div class="settings-label">🖥️ Πλήρης Οθόνη</div>
        <div class="settings-sub">Καλύτερη εμπειρία σε κινητό</div>
      </div>
      <button class="btn btn-ghost" id="set-fullscreen" style="width:auto;margin:0;padding:8px 14px;">Άνοιγμα</button>
    </div>
    <div class="settings-row">
      <div>
        <div class="settings-label">♻️ Επαναφορά Παιχνιδιού</div>
        <div class="settings-sub" style="color:#ff8080;">Διαγράφει όλη την πρόοδο</div>
      </div>
      <button class="btn btn-danger" id="set-reset" style="width:auto;margin:0;padding:8px 14px;">Reset</button>
    </div>
  `;

  openModal({ title: '⚙️ Ρυθμίσεις', bodyHTML: body, onOpen: (bodyEl) => {
    bodyEl.querySelectorAll('.toggle').forEach(t => {
      t.addEventListener('click', () => {
        const key = t.dataset.key;
        state.settings[key] = !state.settings[key];
        t.classList.toggle('on', state.settings[key]);
        if (key === 'music') refreshMusic();
        if (key === 'shadows') applySettings();
        playSound('preview');
        save();
      });
    });
    const fs = bodyEl.querySelector('#set-fullscreen');
    fs.addEventListener('click', () => {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      } catch (e) {}
    });
    const rs = bodyEl.querySelector('#set-reset');
    rs.addEventListener('click', () => {
      openModal({
        title: '⚠️ Επαναφορά',
        bodyHTML: '<div class="center">Σίγουρα; Όλη η πρόοδος θα χαθεί οριστικά.</div>',
        actions: [
          { label: 'Ναι, Reset', cls: 'btn-danger', onClick: () => { resetToNew(); location.reload(); } },
          { label: 'Άκυρο', cls: 'btn-ghost', onClick: () => { closeModal(); openSettingsScreen(); } }
        ]
      });
    });
  } });
}
