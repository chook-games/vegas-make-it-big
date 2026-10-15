import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { pickableTilesExt, pickableTilesInt } from '../three/scene.js';
import { getLotHeat } from '../game/lots.js';

function mix(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, Math.max(0, Math.min(1, t))).getHex();
}

function paintTiles(tiles, h) {
  for (const t of tiles) {
    const key = t.userData.key;
    const noise = (h.noise && h.noise[key]) || 0;
    const smell = (h.smell && h.smell[key]) || 0;
    const max = Math.max(noise, smell);
    let color;
    if (max < 0.03) color = 0x101018;
    else if (noise >= smell) color = mix(0x8a7a00, 0xff2a00, noise);
    else color = mix(0x006644, 0x00ff88, smell);
    if (!t.userData.baseMat) t.userData.baseMat = t.material;
    t.material = new THREE.MeshBasicMaterial({ color });
  }
}

export function applyHeatmap() {
  const lot = state.lots[state.activeLot];
  if (!lot) return;
  const heat = getLotHeat(lot);
  paintTiles(pickableTilesExt, heat.exterior);
  paintTiles(pickableTilesInt, heat.interior);
}

export function clearHeatmap() {
  [...pickableTilesExt, ...pickableTilesInt].forEach(t => {
    if (t.userData.baseMat) {
      t.material = t.userData.baseMat;
      delete t.userData.baseMat;
    }
  });
}

export function toggleHeatmap(on) {
  state.heatmap = on === undefined ? !state.heatmap : on;
  const legend = document.getElementById('heat-legend');
  if (legend) legend.classList.toggle('show', state.heatmap);
  if (state.heatmap) applyHeatmap();
  else clearHeatmap();
  Bus.emit(EV.UI_REFRESH);
}

export function initHeatmap() {
  Bus.on('lot:switch', () => { if (state.heatmap) applyHeatmap(); });
}
