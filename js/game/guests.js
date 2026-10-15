import { state } from '../core/state.js';
import { exteriorGroup, interiorGroup, walkers } from '../three/scene.js';

const MAX_WALKERS = 28;

function makeWalker(world, isVip) {
  const g = new THREE.Group();
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.17, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: isVip ? 0xffd166 : 0x00bbf9 })
  );
  torso.position.y = 0.32;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffcba4 })
  );
  head.position.y = 0.7;
  g.add(torso, head);
  g.position.set((Math.random() - 0.5) * 10, 0.08, (Math.random() - 0.5) * 10);
  (world === 'exterior' ? exteriorGroup : interiorGroup).add(g);
  return {
    mesh: g, world, isVip,
    tx: (Math.random() - 0.5) * 11,
    tz: (Math.random() - 0.5) * 11,
    speed: 0.018 + Math.random() * 0.02
  };
}

function removeWalker(i) {
  const w = walkers[i];
  (w.world === 'exterior' ? exteriorGroup : interiorGroup).remove(w.mesh);
  walkers.splice(i, 1);
}

export function updateGuests(dtFactor, totals) {
  const desired = Math.max(4, Math.min(MAX_WALKERS, Math.round(totals.guests / 6)));
  const extDesired = Math.round(desired * 0.55);
  const intDesired = desired - extDesired;

  let extCount = walkers.filter(w => w.world === 'exterior').length;
  let intCount = walkers.filter(w => w.world === 'interior').length;

  while (extCount < extDesired && walkers.length < MAX_WALKERS) { walkers.push(makeWalker('exterior', Math.random() < 0.2)); extCount++; }
  while (intCount < intDesired && walkers.length < MAX_WALKERS) { walkers.push(makeWalker('interior', Math.random() < 0.25)); intCount++; }

  for (let i = walkers.length - 1; i >= 0; i--) {
    const w = walkers[i];
    const over = w.world === 'exterior' ? extCount > extDesired : intCount > intDesired;
    if (over) {
      removeWalker(i);
      if (w.world === 'exterior') extCount--; else intCount--;
    }
  }
}

export function animateGuests() {
  for (const w of walkers) {
    const dx = w.tx - w.mesh.position.x;
    const dz = w.tz - w.mesh.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.3) {
      w.tx = (Math.random() - 0.5) * 11;
      w.tz = (Math.random() - 0.5) * 11;
    } else {
      w.mesh.position.x += (dx / dist) * w.speed;
      w.mesh.position.z += (dz / dist) * w.speed;
      w.mesh.position.y = 0.08 + Math.abs(Math.sin(performance.now() * 0.008 + w.tx)) * 0.04;
    }
  }
}

export function clearWalkers() {
  while (walkers.length) removeWalker(0);
}
