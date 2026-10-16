import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { CATALOG, isUnlocked, lockLabel } from '../data/buildings.js';
import { categoriesFor, categoryOf } from '../data/categories.js';
import { playSound } from '../audio/audio.js';
import { cancelPendingPlacement } from '../game/placement.js';
import { activeLot } from '../game/lots.js';
import { t } from '../i18n/i18n.js';

export function renderDock() {
  const grid = document.getElementById('build-grid');
  const tabs = document.getElementById('dock-tabs');
  grid.innerHTML = '';
  tabs.innerHTML = '';

  const theme = activeLot() ? activeLot().theme : 'american';
  const cats = categoriesFor(state.mode);
  let cat = state.dockCategory[state.mode];
  if (!cats.find(c => c.id === cat)) {
    cat = cats[0].id;
    state.dockCategory[state.mode] = cat;
  }

  cats.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'dock-tab' + (c.id === cat ? ' active' : '');
    btn.innerHTML = `<span class="dock-tab-icon">${c.icon}</span><span class="dock-tab-name">${t(c.name)}</span>`;
    btn.addEventListener('click', () => {
      state.dockCategory[state.mode] = c.id;
      playSound('preview');
      renderDock();
    });
    tabs.appendChild(btn);
  });

  const statusEl = document.getElementById('dock-status');
  if (state.selectedTool) {
    const all = CATALOG[state.mode];
    const sel = all.find(x => x.id === state.selectedTool);
    statusEl.textContent = sel ? `${t('Selected')}: ${t(sel.name)}` : t('Select a building');
    statusEl.style.color = '#ffd166';
  } else {
    statusEl.textContent = t('Tap a building for options');
    statusEl.style.color = '#00f5d4';
  }

  document.getElementById('dock-title').textContent = state.mode === 'exterior'
    ? t('Resort Buildings') : t('Casino Equipment');

  const list = CATALOG[state.mode].filter(item =>
    (!item.themeOnly || item.themeOnly === theme) && categoryOf(state.mode, item.id) === cat
  );

  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'dock-empty';
    empty.textContent = t('Nothing available here yet.');
    grid.appendChild(empty);
    return;
  }

  list.forEach(item => {
    const unlocked = isUnlocked(item, state);
    const card = document.createElement('div');
    card.className = `build-card ${state.selectedTool === item.id ? 'active' : ''} ${unlocked ? '' : 'locked'}`;
    const badge = item.tier ? `<span class="build-badge">T${item.tier}</span>` : '';
    const lock = unlocked ? '' : `<span class="build-lock">🔒</span>`;
    const costTxt = unlocked ? `$${item.cost.toLocaleString()}` : (lockLabel(item) || t('Locked'));
    card.innerHTML = `
      ${badge}${lock}
      <div class="build-icon">${item.icon}</div>
      <div class="build-name">${t(item.name)}</div>
      <div class="build-cost ${unlocked ? '' : 'locked-txt'}">${costTxt}</div>
    `;
    card.addEventListener('click', () => selectTool(item, unlocked));
    grid.appendChild(card);
  });
}

function selectTool(item, unlocked) {
  if (!unlocked) {
    playSound('error');
    Bus.emit(EV.TOAST, { text: `🔒 ${t('Requires')} ${lockLabel(item)}.`, kind: 'bad' });
    return;
  }
  if (state.pendingPlacement) cancelPendingPlacement();
  Bus.emit(EV.INSPECTOR_CLOSE);

  if (state.selectedTool === item.id) {
    state.selectedTool = null;
    Bus.emit('tool:select', null);
    document.getElementById('ui-hint').innerHTML = t('Tap a building on the map to upgrade or move it.');
  } else {
    state.selectedTool = item.id;
    Bus.emit('tool:select', item.id);
    document.getElementById('ui-hint').innerHTML = `${item.icon} <b>${t(item.name)}:</b> ${t('Tap an empty tile to place and rotate.')}`;
  }
  playSound('preview');
  renderDock();
}

export function initDock() {
  Bus.on(EV.UI_REFRESH, renderDock);
  Bus.on('tool:select', renderDock);
}
