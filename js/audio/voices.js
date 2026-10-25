import { state } from '../core/state.js';
import { Bus } from '../core/events.js';
import { camera } from '../three/scene.js';
import { isUnlocked, loadBuffer, playBuffer } from './engine.js';

const BASE = 'assets/audio/people/';

const WIN = [
  'win_male_01', 'win_male_02', 'win_male_03', 'win_male_04', 'win_male_05', 'win_male_06',
  'win_female_01', 'win_female_02', 'win_female_03', 'win_female_04', 'win_female_05', 'win_female_06'
];

const LOSE = [
  'lose_male_01', 'lose_male_02', 'lose_male_03', 'lose_male_04', 'lose_male_05',
  'lose_female_01', 'lose_female_02', 'lose_female_03', 'lose_female_04', 'lose_female_05', 'lose_female_06', 'lose_female_07'
];

let lastAt = 0;

Bus.on('guest:voice', (data) => {
  if (!state.settings.sound || !isUnlocked() || !data || !data.position) return;
  const now = Date.now();
  if (now - lastAt < 650) return;

  const pos = data.position;
  const dx = pos.x - camera.position.x;
  const dy = (pos.y || 0) - camera.position.y;
  const dz = pos.z - camera.position.z;
  const dist = Math.sqrt(dx * dx + dy * dy * 0.35 + dz * dz);
  if (dist > 55) return;

  const vol = (1 - dist / 55) * 0.6;
  if (vol < 0.04) return;

  const e = camera.matrixWorld.elements;
  let pan = (dx * e[0] + dz * e[2]) / 14;
  pan = Math.max(-0.85, Math.min(0.85, pan));

  const list = data.kind === 'lose' ? LOSE : WIN;
  const file = list[Math.floor(Math.random() * list.length)];
  lastAt = now;
  loadBuffer(file, BASE + file + '.ogg').then(() => {
    playBuffer(file, { vol, pan, rate: 0.94 + Math.random() * 0.12 });
  });
});
