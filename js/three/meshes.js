import { EXTERIOR } from './meshes-exterior.js';
import { INTERIOR } from './meshes-interior.js';
import { bas, glow, box, at, spin } from './meshkit.js';

function decorate(group, level) {
  if (level >= 3) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.02, 20), glow(0xffd166, 0.5));
    ring.rotation.x = -Math.PI / 2;
    at(ring, 0, 0.05, 0);
    group.add(ring);
  }
  if (level >= 5) {
    const topper = at(new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), bas(0x00f5d4)), 0, 1.9, 0);
    spin(topper);
    group.add(topper);
  }
  if (level >= 8) {
    const crown = at(box(0.5, 0.1, 0.5, bas(0xffd166)), 0, 2.05, 0);
    group.add(crown);
  }
  if (level >= 10) {
    const aura = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.03, 6, 24), glow(0x00f5d4, 0.7));
    aura.rotation.x = -Math.PI / 2;
    at(aura, 0, 0.08, 0);
    spin(aura);
    group.add(aura);
  }
}

export function createBuildingMesh(item, level = 1, isGhost = false, ctx = {}) {
  const builder = EXTERIOR[item.id] || INTERIOR[item.id];
  const group = builder ? builder(item, level, ctx) : new THREE.Group();

  if (isGhost) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.05, 24), new THREE.MeshBasicMaterial({ color: 0x00f5d4, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2;
    at(ring, 0, 0.06, 0);
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 4), bas(0x00f5d4));
    arrow.rotation.x = Math.PI / 2;
    at(arrow, 0, 0.18, 1.12);
    group.add(ring, arrow);
  } else {
    decorate(group, level);
  }

  return group;
}
