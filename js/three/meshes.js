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

function makeTransparent(group) {
  group.traverse(obj => {
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach(m => {
        m.transparent = true;
        m.opacity = 0.5;
        m.depthWrite = false;
      });
    }
  });
}

function resolveBuilder(item) {
  if (EXTERIOR[item.id]) return EXTERIOR[item.id];
  if (INTERIOR[item.id]) return INTERIOR[item.id];
  const id = item.id;
  if (id.includes('hotel')) return EXTERIOR.hotel;
  if (id.includes('casino')) return EXTERIOR.casino;
  if (id.includes('pool') || id === 'waterride') return EXTERIOR.pool;
  if (id === 'circus' || id === 'tennisclub' || id === 'arcade') return EXTERIOR.ferris;
  if (id === 'sign') return EXTERIOR.restaurant;
  if (id.includes('slot') || id === 'videopoker' || id === 'carjackpot') return INTERIOR.slots;
  if (id === 'blackjack' || id === 'texasholdem' || id === 'paigow' || id === 'caribbeanstud' || id === 'wheeloffortune') return INTERIOR.poker;
  if (id === 'firstaid') return INTERIOR.restroom;
  if (id === 'atm') return INTERIOR.cashier;
  if (id === 'kitchen') return INTERIOR.buffet;
  if (id === 'jewelrystore') return INTERIOR.giftshop;
  if (id === 'theatre' || id === 'museum') return INTERIOR.nightclub;
  return null;
}

function genericMesh(item, level) {
  const g = new THREE.Group();
  const tier = item.tier || 1;
  const h = 0.6 + tier * 0.3;
  const mat = new THREE.MeshStandardMaterial({ color: 0x4b5563 + (tier * 0x111111), roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, h * (1 + (level - 1) * 0.2), 1.3), mat);
  body.position.y = (h * (1 + (level - 1) * 0.2)) / 2;
  g.add(body);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.06), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
  sign.position.set(0, 0.4, 0.68);
  g.add(sign);
  return g;
}

export function createBuildingMesh(item, level = 1, isGhost = false, ctx = {}) {
  const builder = resolveBuilder(item);
  const group = builder ? builder(item, level, ctx) : genericMesh(item, level);

  const fp = ctx.footprint;
  if (fp) {
    const base = 1.9;
    const sx = (fp.w * fp.ts * 0.92) / base;
    const sz = (fp.h * fp.ts * 0.92) / base;
    const sy = (sx + sz) / 2;
    group.scale.set(Math.max(0.05, sx), Math.max(0.05, sy), Math.max(0.05, sz));
  }

  if (ctx.elevated) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.18, 2.12), new THREE.MeshStandardMaterial({ color: 0x3a3f4b, roughness: 0.9 }));
    slab.position.y = -0.02;
    group.add(slab);
  }

  if (isGhost) {
    if (fp) {
      const outline = new THREE.Mesh(
        new THREE.BoxGeometry(fp.w * fp.ts * 0.98, 0.06, fp.h * fp.ts * 0.98),
        new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.4 })
      );
      outline.position.y = 0.05;
      group.userData.outline = outline;
      group.add(outline);
    }
    if (!item.isPath) {
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 4), bas(0x00f5d4));
      arrow.rotation.x = Math.PI / 2;
      at(arrow, 0, 0.18, fp ? fp.h * fp.ts * 0.55 : 1.12);
      group.add(arrow);
      makeTransparent(group);
    }
  } else {
    if (!item.isPath) decorate(group, level);
  }

  return group;
}
