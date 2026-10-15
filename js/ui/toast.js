import { camera } from '../three/scene.js';
import { Bus, EV } from '../core/events.js';
import { playSound } from '../audio/audio.js';

export function showToast({ text, kind }) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${kind || ''}`;
  el.textContent = text;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

export function spawnFloatingText(worldPos, text, color = '#06d6a0') {
  const vec = worldPos.clone();
  vec.y += 1.8;
  vec.project(camera);
  const x = (vec.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-(vec.y * 0.5) + 0.5) * window.innerHeight;

  const el = document.createElement('div');
  el.className = 'float-text';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.color = color;
  el.textContent = text;
  document.getElementById('floating-container').appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

export function initToast() {
  Bus.on(EV.TOAST, showToast);
  Bus.on(EV.FLOATING, ({ position, text, color }) => spawnFloatingText(position, text, color));
  Bus.on('sfx', (type) => playSound(type));
}
