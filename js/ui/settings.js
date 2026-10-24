import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { openModal, closeModal } from './modals.js';
import { refreshMusic, playSound } from '../audio/audio.js';
import { applySettings } from '../three/scene.js';
import { setBloom, bloomAvailable } from '../three/postfx.js';
import { resetToNew, save } from '../core/save.js';
import { LANGS, getLang, setLang, applyStaticI18n } from '../i18n/i18n.js';
import { openStatsScreen } from './statsScreen.js';
import { openPricingScreen } from './pricingScreen.js';
import { openViewFilterScreen } from './viewFilterScreen.js';
import { openStaffScreen } from './staffScreen.js';
import { openAchievementsScreen, openPrestigeScreen } from './screens.js';
import { openLotScreen } from './lotScreen.js';

function toggleRow(label, sub, key) {
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
    <div class="settings-row">
      <div>
        <div class="settings-label">🌐 Language</div>
        <div class="settings-sub">More languages coming soon</div>
      </div>
      <select id="set-lang" class="lang-select">
        ${LANGS.map(l => `<option value="${l.code}" ${l.code === getLang() ? 'selected' : ''}>${l.name}</option>`).join('')}
      </select>
    </div>
    ${toggleRow('🔊 Sound effects', 'Building & UI sounds', 'sound')}
    ${toggleRow('🎵 Music', 'Soft ambient loop', 'music')}
    ${toggleRow('📳 Vibration', 'Haptic feedback (mobile)', 'vibration')}
    ${toggleRow('🌑 Shadows', 'Prettier but heavier', 'shadows')}
    ${bloomAvailable() ? toggleRow('✨ Bloom (Neon Glow)', 'Glow on lights, heavier', 'bloom') : ''}
    ${toggleRow('🖥️ Auto quality', 'Lowers shadows/bloom if FPS drops', 'autoQuality')}
    <div class="spacer"></div>
    <div class="muted">Tools</div>
    <div class="tool-grid">
      <button class="tool-btn" data-tool="staff">👔 Staff</button>
      <button class="tool-btn" data-tool="stats">📊 Statistics</button>
      <button class="tool-btn" data-tool="prices">💲 Prices</button>
      <button class="tool-btn" data-tool="filters">🔍 View Filters</button>
      <button class="tool-btn" data-tool="ach">🏆 Achievements</button>
      <button class="tool-btn" data-tool="prestige">💎 Prestige</button>
      <button class="tool-btn" data-tool="lots">🏙️ Lots</button>
    </div>
    <div class="settings-row">
      <div>
        <div class="settings-label">🖥️ Fullscreen</div>
        <div class="settings-sub">Better experience on mobile</div>
      </div>
      <button class="btn btn-ghost" id="set-fullscreen" style="width:auto;margin:0;padding:8px 14px;">Enter</button>
    </div>
    <div class="settings-row">
      <div>
        <div class="settings-label">♻️ Reset Game</div>
        <div class="settings-sub" style="color:#ff8080;">Deletes all progress</div>
      </div>
      <button class="btn btn-danger" id="set-reset" style="width:auto;margin:0;padding:8px 14px;">Reset</button>
    </div>
  `;

  openModal({ title: '⚙️ Settings', bodyHTML: body, onOpen: (bodyEl) => {
    bodyEl.querySelectorAll('.toggle').forEach(tg => {
      tg.addEventListener('click', () => {
        const key = tg.dataset.key;
        state.settings[key] = !state.settings[key];
        tg.classList.toggle('on', state.settings[key]);
        if (key === 'music') refreshMusic();
        if (key === 'shadows') applySettings();
        if (key === 'bloom') setBloom(state.settings.bloom);
        playSound('preview');
        save();
      });
    });
    const langSel = bodyEl.querySelector('#set-lang');
    if (langSel) langSel.addEventListener('change', (e) => {
      setLang(e.target.value);
      applyStaticI18n();
      Bus.emit(EV.UI_REFRESH);
      save();
    });
    const tools = {
      staff: openStaffScreen,
      stats: openStatsScreen,
      prices: openPricingScreen,
      filters: openViewFilterScreen,
      ach: openAchievementsScreen,
      prestige: openPrestigeScreen,
      lots: openLotScreen
    };
    bodyEl.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => {
      closeModal();
      const fn = tools[b.dataset.tool];
      if (fn) fn();
    }));

    const fs = bodyEl.querySelector('#set-fullscreen');
    if (fs) fs.addEventListener('click', () => {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      } catch (e) {}
    });
    const rs = bodyEl.querySelector('#set-reset');
    if (rs) rs.addEventListener('click', () => {
      openModal({
        title: '⚠️ Reset',
        bodyHTML: '<div class="center">Are you sure? All progress will be lost.</div>',
        actions: [
          { label: 'Yes, Reset', cls: 'btn-danger', onClick: () => { resetToNew(); location.reload(); } },
          { label: 'Cancel', cls: 'btn-ghost', onClick: () => { closeModal(); openSettingsScreen(); } }
        ]
      });
    });
  } });
}
