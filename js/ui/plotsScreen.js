import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { worldRadius } from '../three/worlds.js';
import { plotCost, canExpand, buyPlot, MAX_PLOTS } from '../game/plots.js';

function buildMap() {
  const cur = worldRadius();
  const next = cur + 1;
  const size = next * 2 + 1;
  let cells = '';
  for (let gz = -next; gz <= next; gz++) {
    for (let gx = -next; gx <= next; gx++) {
      const ring = Math.max(Math.abs(gx), Math.abs(gz));
      const cls = ring <= cur ? 'on' : (ring === next ? 'edge' : '');
      cells += `<div class="plot-cell ${cls}"></div>`;
    }
  }
  return `<div class="plot-map" style="grid-template-columns: repeat(${size}, 20px)">${cells}</div>`;
}

function buildBody() {
  const cost = plotCost();
  const afford = state.cash >= cost;
  const more = canExpand();
  return `
    <div class="center big-stat">${state.gridSize}×${state.gridSize}</div>
    <div class="center muted">Η έκταση του Resort σου. Κάθε επέκταση προσθέτει έναν δακτύλιο πλακιδίων σε Strip & Καζίνο.</div>
    ${buildMap()}
    <div class="settings-row"><span class="settings-label">Επεκτάσεις που έγιναν</span><span>${state.plots} / ${MAX_PLOTS}</span></div>
    <div class="settings-row"><span class="settings-label">Επόμενη έκταση</span><span>${more ? (state.gridSize + 2) + '×' + (state.gridSize + 2) : 'Μέγιστη'}</span></div>
    <div class="settings-row"><span class="settings-label">Κόστος επόμενης</span><span style="color:${afford ? '#06d6a0' : '#ff8080'}">${more ? '$' + cost.toLocaleString() : '—'}</span></div>
    <div class="spacer"></div>
    <div class="muted">Τα υπάρχοντα κτίρια μένουν στη θέση τους. Οι νέοι δακτύλιοι εμφανίζονται με έντονο χρώμα στον χάρτη.</div>
  `;
}

function render() {
  openModal({
    title: '🗺️ Επέκταση Χάρτη',
    bodyHTML: buildBody(),
    actions: [
      {
        label: canExpand() ? (state.cash >= plotCost() ? `Αγορά Plot ($${plotCost().toLocaleString()})` : `Χρειάζεσαι $${plotCost().toLocaleString()}`) : 'Μέγιστη έκταση',
        cls: 'btn-gold',
        onClick: () => { if (buyPlot()) render(); }
      },
      { label: 'Κλείσιμο', cls: 'btn-ghost', onClick: closeModal }
    ]
  });
}

export function openPlotsScreen() {
  render();
}
