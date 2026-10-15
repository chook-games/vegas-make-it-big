import { scene, camera, renderer } from './scene.js';
import { state } from '../core/state.js';

let composer = null;
let bloomPass = null;

export function initPostFX() {
  composer = null;
  bloomPass = null;
  if (!state.settings.bloom) return;
  if (typeof THREE.EffectComposer === 'undefined' || typeof THREE.UnrealBloomPass === 'undefined' || typeof THREE.RenderPass === 'undefined') return;
  try {
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.65, 0.55, 0.9);
    composer.addPass(bloomPass);
  } catch (e) {
    composer = null;
  }
}

export function renderFrame() {
  if (composer) composer.render();
  else renderer.render(scene, camera);
}

export function resizePostFX() {
  if (composer) composer.setSize(window.innerWidth, window.innerHeight);
}

export function setBloom(on) {
  state.settings.bloom = on;
  initPostFX();
}

export function bloomAvailable() {
  return typeof THREE.EffectComposer !== 'undefined' && typeof THREE.UnrealBloomPass !== 'undefined' && typeof THREE.RenderPass !== 'undefined';
}
