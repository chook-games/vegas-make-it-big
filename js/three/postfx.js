import { scene, camera, renderer } from './scene.js';
import { state } from '../core/state.js';

export function initPostFX() {
  state.settings.bloom = false;
}

export function renderFrame() {
  renderer.render(scene, camera);
}

export function resizePostFX() {}

export function setBloom() {
  state.settings.bloom = false;
}

export function bloomAvailable() {
  return false;
}
