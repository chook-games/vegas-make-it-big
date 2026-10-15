import { scene } from './scene.js';

const active = [];
const MAX = 220;

function spawnOne(x, y, z, color, opts) {
  const size = opts.size || 0.12;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  mesh.position.set(x, y, z);
  scene.add(mesh);
  active.push({
    mesh,
    vx: opts.vx, vy: opts.vy, vz: opts.vz,
    gravity: opts.gravity == null ? -6 : opts.gravity,
    life: 0,
    maxLife: opts.maxLife || 1.0,
    spinX: (Math.random() - 0.5) * 6,
    spinY: (Math.random() - 0.5) * 6
  });
}

export function spawnMoneyBurst(pos, color) {
  if (active.length > MAX) return;
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    spawnOne(pos.x, pos.y + 1.2, pos.z, color == null ? 0xffd166 : color, {
      vx: Math.cos(a) * 0.6, vy: 2.4 + Math.random() * 1.2, vz: Math.sin(a) * 0.6,
      gravity: -5.5, maxLife: 1.1, size: 0.11
    });
  }
}

export function spawnConfetti() {
  if (active.length > MAX) return;
  const colors = [0xff2a85, 0x00f5d4, 0xffd166, 0x06d6a0, 0x7b2cbf];
  for (let i = 0; i < 40; i++) {
    spawnOne((Math.random() - 0.5) * 10, 9 + Math.random() * 3, (Math.random() - 0.5) * 10, colors[i % colors.length], {
      vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random(), vz: (Math.random() - 0.5) * 2,
      gravity: -2.5, maxLife: 2.6, size: 0.16
    });
  }
}

export function spawnSpark(pos, color) {
  if (active.length > MAX) return;
  spawnOne(pos.x, pos.y + 0.4, pos.z, color == null ? 0x00f5d4 : color, {
    vx: (Math.random() - 0.5) * 1.4, vy: 1.5 + Math.random(), vz: (Math.random() - 0.5) * 1.4,
    gravity: -4, maxLife: 0.8, size: 0.08
  });
}

export function updateParticles(dt) {
  for (let i = active.length - 1; i >= 0; i--) {
    const p = active[i];
    p.life += dt;
    p.vy += p.gravity * dt;
    p.mesh.position.x += p.vx * dt;
    p.mesh.position.y += p.vy * dt;
    p.mesh.position.z += p.vz * dt;
    p.mesh.rotation.x += p.spinX * dt;
    p.mesh.rotation.y += p.spinY * dt;
    const k = 1 - p.life / p.maxLife;
    if (p.mesh.material) p.mesh.material.opacity = Math.max(0, k);
    if (p.life >= p.maxLife) {
      scene.remove(p.mesh);
      active.splice(i, 1);
    }
  }
}

export function clearParticles() {
  active.forEach(p => scene.remove(p.mesh));
  active.length = 0;
}
