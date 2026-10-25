import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { openModal, closeModal } from './modals.js';
import { playSound } from '../audio/audio.js';
import { refreshMusic } from '../audio/music.js';
import { refreshAmbience } from '../audio/ambience.js';
import { applyVolumes } from '../audio/engine.js';
import { applySettings } from '../three/scene.js';
import { setBloom, bloomAvailable } from '../three/postfx.js';
import { resetToNew, save, exportSave, importSave } from '../core/save.js';
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

function volumeRow(label, key) {
  const cur = typeof state.settings[key] === 'number' ? state.settings[key] : 0.7;
  return `<div class="settings-row">
    <div><div class="settings-label">${label}</div></div>
    <input type="range" class="vol-slider" data-vol="${key}" min="0" max="100" value="${Math.round(cur * 100)}">
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
    ${volumeRow('Music volume', 'musicVol')}
    ${volumeRow('Sound effects volume', 'sfxVol')}
    ${volumeRow('Ambience volume', 'ambVol')}
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
        <div class="settings-label">💾 Save Data</div>
        <div class="settings-sub">Backup or move to another device</div>
      </div>
      <div style="display:flex; gap:6px;">
        <button class="btn btn-ghost" id="set-export" style="width:auto;margin:0;padding:8px 12px;">Export</button>
        <button class="btn btn-ghost" id="set-import" style="width:auto;margin:0;padding:8px 12px;">Import</button>
      </div>
    </div>
    <input type="file" id="set-import-file" accept="application/json,.json" style="display:none;">
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
        if (key === 'sound') refreshAmbience();
        if (key === 'shadows') applySettings();
        if (key === 'bloom') setBloom(state.settings.bloom);
        playSound('preview');
        save();
      });
    });
    bodyEl.querySelectorAll('[data-vol]').forEach(inp => {
      const key = inp.dataset.vol;
      const upd = () => { state.settings[key] = Number(inp.value) / 100; applyVolumes(); if (key === 'ambVol') refreshAmbience(); };
      inp.addEventListener('input', upd);
      inp.addEventListener('change', () => { upd(); save(); });
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

    const exp = bodyEl.querySelector('#set-export');
    if (exp) exp.addEventListener('click', () => {
      try {
        const blob = new Blob([exportSave()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vegas-save-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        playSound('confirm');
      } catch (e) {}
    });
    const imp = bodyEl.querySelector('#set-import');
    const fileIn = bodyEl.querySelector('#set-import-file');
    if (imp && fileIn) {
      imp.addEventListener('click', () => fileIn.click());
      fileIn.addEventListener('change', () => {
        const f = fileIn.files && fileIn.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          const ok = importSave(String(reader.result));
          if (ok) location.reload();
          else Bus.emit(EV.TOAST, { text: 'Invalid save file.', kind: 'bad' });
        };
        reader.readAsText(f);
      });
    }

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
