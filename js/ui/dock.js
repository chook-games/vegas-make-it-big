import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { CATALOG, isUnlocked, lockLabel } from '../data/buildings.js';
import { playSound } from '../audio/audio.js';
import { cancelPendingPlacement } from '../game/placement.js';
import { activeLot } from '../game/lots.js';

export function renderDock() {
  const grid = document.getElementById('build-grid');
  grid.innerHTML = '';
  const theme = activeLot() ? activeLot().theme : 'american';
  const list = CATALOG[state.mode].filter(item => !item.themeOnly || item.themeOnly === theme);

  const statusEl = document.getElementById('dock-status');
  if (state.selectedTool) {
    const sel = list.find(x => x.id === state.selectedTool);
    statusEl.textContent = sel ? `Επιλεγμένο: ${sel.name}` : 'Επιλογή';
    statusEl.style.color = '#ffd166';
  } else {
    statusEl.textContent = 'Tap σε κτίριο για επιλογές';
    statusEl.style.color = '#00f5d4';
  }

  document.getElementById('dock-title').textContent = state.mode === 'exterior'
    ? '🏗️ Κατασκευές Resort'
    : '🎰 Εξοπλισμός Καζίνο';

  list.forEach(item => {
    const unlocked = isUnlocked(item, state);
    const card = document.createElement('div');
    card.className = `build-card ${state.selectedTool === item.id ? 'active' : ''} ${unlocked ? '' : 'locked'}`;
    const badge = item.tier ? `<span class="build-badge">T${item.tier}</span>` : '';
    const lock = unlocked ? '' : `<span class="build-lock">🔒</span>`;
    const costTxt = unlocked ? `$${item.cost}` : (lockLabel(item) || 'Κλειδωμένο');
    card.innerHTML = `
      ${badge}${lock}
      <div class="build-icon">${item.icon}</div>
      <div class="build-name">${item.name}</div>
      <div class="build-cost ${unlocked ? '' : 'locked-txt'}">${costTxt}</div>
    `;
    card.addEventListener('click', () => selectTool(item, unlocked));
    grid.appendChild(card);
  });
}

function selectTool(item, unlocked) {
  if (!unlocked) {
    playSound('error');
    Bus.emit(EV.TOAST, { text: `🔒 Απαιτεί ${lockLabel(item)}.`, kind: 'bad' });
    return;
  }
  if (state.pendingPlacement) cancelPendingPlacement();
  Bus.emit(EV.INSPECTOR_CLOSE);

  if (state.selectedTool === item.id) {
    state.selectedTool = null;
    Bus.emit('tool:select', null);
    document.getElementById('ui-hint').innerHTML = '👆 Πάτησε σε υπάρχον κτίριο για Αναβάθμιση ή Μετακίνηση.';
  } else {
    state.selectedTool = item.id;
    Bus.emit('tool:select', item.id);
    document.getElementById('ui-hint').innerHTML = `${item.icon} <b>${item.name}:</b> Πάτησε σε κενό πλακίδιο για τοποθέτηση & περιστροφή!`;
  }
  playSound('preview');
  renderDock();
}

export function initDock() {
  Bus.on(EV.UI_REFRESH, renderDock);
  Bus.on('tool:select', renderDock);
}
