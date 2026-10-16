import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { worldRadius } from '../three/worlds.js';
import { plotCost, canExpand, buyPlot, MAX_RADIUS } from '../game/plots.js';

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
    <div class="center muted">Your lot size. Each expansion adds a ring of tiles to the Strip and casino.</div>
    ${buildMap()}
    <div class="settings-row"><span class="settings-label">Expansions bought</span><span>${Math.max(0, (state.gridSize - 1) / 2 - 5)} / ${MAX_RADIUS - 5}</span></div>
    <div class="settings-row"><span class="settings-label">Next size</span><span>${more ? (state.gridSize + 2) + '×' + (state.gridSize + 2) : 'Max'}</span></div>
    <div class="settings-row"><span class="settings-label">Next cost</span><span style="color:${afford ? '#06d6a0' : '#ff8080'}">${more ? '$' + cost.toLocaleString() : '—'}</span></div>
    <div class="spacer"></div>
    <div class="muted">Existing buildings stay in place. New rings show in bright colour on the map.</div>
  `;
}

function render() {
  openModal({
    title: '🗺️ Expand Lot',
    bodyHTML: buildBody(),
    actions: [
      {
        label: canExpand() ? (state.cash >= plotCost() ? `Buy Plot ($${plotCost().toLocaleString()})` : `Need $${plotCost().toLocaleString()}`) : 'Maximum size',
        cls: 'btn-gold',
        onClick: () => { if (buyPlot()) render(); }
      },
      { label: 'Close', cls: 'btn-ghost', onClick: closeModal }
    ]
  });
}

export function openPlotsScreen() {
  render();
}
