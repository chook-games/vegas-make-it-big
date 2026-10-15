import { std, bas, glow, box, cyl, cone, sphere, at, spin, scaleFor } from './meshkit.js';

function stools(g, count, radius, color) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const st = cyl(0.13, 0.1, 0.35, 8, std(color));
    at(st, Math.cos(a) * radius, 0.18, Math.sin(a) * radius);
    g.add(st);
  }
}

export const INTERIOR = {
  slots(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    for (let i = -0.48; i <= 0.48; i += 0.48) {
      g.add(at(box(0.36, 1.05 * s, 0.45, std(0xffbe0b)), i, 0.52 * s, -0.15));
      g.add(at(box(0.28, 0.3, 0.1, bas(0x00f5d4)), i, 0.68 * s, 0.08));
      g.add(at(cyl(0.13, 0.1, 0.35, 8, std(0xef233c)), i, 0.18, 0.38));
    }
    return g;
  },
  roulette(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.5, 0.62, 0.95, std(0x06d6a0)), 0, 0.31, 0));
    const wheel = at(cyl(0.34, 0.34, 0.15, 14, std(0xffd166)), -0.32, 0.68, 0);
    spin(wheel); g.add(wheel);
    for (let x = -0.45; x <= 0.45; x += 0.45) g.add(at(cyl(0.13, 0.1, 0.35, 8, std(0xffd166)), x, 0.18, 0.68));
    return g;
  },
  vip_bj(item, level) {
    const g = new THREE.Group();
    g.add(at(cyl(0.72, 0.62, 0.65, 12, std(0xef233c)), 0, 0.32, 0));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 8, 20), bas(0xffd166));
    ring.rotation.x = Math.PI / 2;
    g.add(at(ring, 0, 0.66, 0));
    for (let a = -0.7; a <= 0.7; a += 0.7) g.add(at(cyl(0.15, 0.12, 0.42, 8, std(0xffd166)), Math.sin(a) * 0.85, 0.21, Math.cos(a) * 0.85));
    return g;
  },
  wall(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.95, 1.55 * s, 0.38, std(0xd4af37, { metalness: 0.6, roughness: 0.3 })), 0, 0.77 * s, 0));
    return g;
  },
  security(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.2, 0.85, 0.9, std(0x1d3557)), 0, 0.42, 0));
    g.add(at(box(0.8, 0.35, 0.12, bas(0x00f5d4)), 0, 0.68, 0.42));
    const dome = at(sphere(0.32, 12, new THREE.MeshBasicMaterial({ color: 0x3a86ff, wireframe: true })), 0, 1.15, 0);
    spin(dome); g.add(dome);
    return g;
  },
  cashier(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.4, 0.75, 0.7, std(0x2b2d42)), 0, 0.37, 0));
    g.add(at(box(1.3, 0.35, 0.06, glow(0x90e0ef, 0.4)), 0, 0.95, -0.1));
    const tray = at(box(0.4, 0.12, 0.3, bas(0xffd166)), 0, 0.8, 0.2);
    spin(tray); g.add(tray);
    return g;
  },
  keno(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.4, 0.6, 0.7, std(0x0a9396)), 0, 0.3, 0));
    g.add(at(box(1.2, 0.6, 0.06, bas(0x00f5d4)), 0, 0.9, -0.35));
    for (let i = 0; i < 6; i++) g.add(at(sphere(0.05, 6, bas(i % 2 ? 0xffd166 : 0xff2a85)), -0.5 + i * 0.2, 1.28, -0.35));
    return g;
  },
  bar(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.14, 0.7, 0.6, std(0x4a2c17)), 0, 0.35, 0));
    g.add(at(box(1.1, 0.9, 0.25, std(0x6b4423)), 0, 0.95 * s, -0.4));
    for (let i = -0.4; i <= 0.4; i += 0.4) g.add(at(cyl(0.06, 0.06, 0.3, 6, bas(i % 2 ? 0x00f5d4 : 0xff2a85)), i, 1.15 * s, -0.28));
    return g;
  },
  poker(item, level) {
    const g = new THREE.Group();
    g.add(at(cyl(0.75, 0.75, 0.6, 12, std(0x0b6e4f)), 0, 0.3, 0));
    g.add(at(cyl(0.7, 0.7, 0.08, 12, std(0x0a9e6f)), 0, 0.64, 0));
    stools(g, 5, 0.95, 0xef233c);
    return g;
  },
  sicbo(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.5, 0.6, 0.9, std(0x7b2cbf)), 0, 0.3, 0));
    const dome = at(new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), glow(0xffffff, 0.4)), 0, 0.66, 0);
    spin(dome); g.add(dome);
    stools(g, 4, 0.85, 0xffd166);
    return g;
  },
  craps(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.6, 0.6, 0.85, std(0x0a9396)), 0, 0.3, 0));
    for (let i = -0.5; i <= 0.5; i += 0.5) g.add(at(box(0.16, 0.16, 0.16, bas(0xffffff)), i, 0.68, 0.2));
    return g;
  },
  baccarat(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.3, 0.6, 0.8, std(0x6a040f)), 0, 0.3, 0));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 6, 20), bas(0xffd166));
    rim.rotation.x = Math.PI / 2;
    g.add(at(rim, 0, 0.62, 0));
    stools(g, 4, 0.8, 0xffd166);
    return g;
  },
  giftshop(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.3, 0.9 * s, 0.9, std(0xff9ebb)), 0, 0.45 * s, -0.1));
    g.add(at(box(1.4, 0.15, 1.0, bas(0xffd166)), 0, 0.95 * s, -0.1));
    g.add(at(box(0.5, 0.4, 0.06, bas(0xffffff)), 0, 0.5, 0.38));
    return g;
  },
  lounge(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.6, 0.08, 1.4, std(0x4a154b)), 0, 0.05, 0));
    for (const [x, z] of [[-0.5, -0.4], [0.5, -0.4], [-0.5, 0.4], [0.5, 0.4]]) {
      g.add(at(box(0.5, 0.3, 0.5, std(0x7b2cbf)), x, 0.2, z));
    }
    g.add(at(box(0.5, 0.5, 0.5, bas(0xff2a85)), 0, 0.3, 0));
    return g;
  },
  cage(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.3, 1.1 * s, 0.9, std(0x495057)), 0, 0.55 * s, 0));
    g.add(at(box(1.0, 0.7, 0.06, new THREE.MeshBasicMaterial({ color: 0xadb5bd, wireframe: true })), 0, 0.55 * s, 0.46));
    g.add(at(box(0.6, 0.2, 0.2, bas(0xffd166)), 0, 1.2 * s, 0));
    return g;
  },
  sportsbook(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.8, 1.6, 0.3, std(0x1b263b)), 0, 0.8 * s, -0.5));
    g.add(at(box(1.6, 0.9, 0.06, bas(0x00f5d4)), 0, 0.9 * s, -0.33));
    for (let x = -0.5; x <= 0.5; x += 0.5) g.add(at(box(0.4, 0.4, 0.4, std(0x415a77)), x, 0.2, 0.3));
    return g;
  },
  buffet(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.7, 0.7, 0.7, std(0x8d5524)), 0, 0.35, 0));
    for (let x = -0.6; x <= 0.6; x += 0.4) g.add(at(cyl(0.16, 0.16, 0.12, 10, bas(0xffd166)), x, 0.76 * s, 0.05));
    g.add(at(box(0.9, 0.3, 0.06, bas(0xff2a85)), 0, 1.15 * s, -0.3));
    return g;
  },
  foodcourt(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.7, 0.12, 1.5, std(0x8d99ae)), 0, 0.06, 0));
    for (const [x, z] of [[-0.45, -0.35], [0.45, -0.35], [-0.45, 0.35], [0.45, 0.35]]) {
      g.add(at(cyl(0.28, 0.28, 0.06, 12, bas(0xffffff)), x, 0.55, z));
      g.add(at(cyl(0.05, 0.05, 0.5, 6, std(0xbbbbbb)), x, 0.3, z));
    }
    return g;
  },
  spa(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.4, 0.5, 1.2, std(0x81b29a)), 0, 0.25, 0));
    g.add(at(cyl(0.4, 0.4, 0.12, 12, glow(0x00f5d4, 0.5)), 0, 0.53, 0));
    g.add(at(cone(0.3, 0.5, 8, bas(0xffd166)), 0.5, 0.7 * s, 0.4));
    return g;
  },
  nightclub(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(cyl(0.5, 0.5, 0.1, 12, std(0x1a1a2e)), 0, 0.45, 0));
    for (let i = 0; i < 3; i++) {
      const l = at(box(0.08, 0.9, 0.08, glow(i === 0 ? 0xff2a85 : i === 1 ? 0x00f5d4 : 0xffd166, 0.8)), (i - 1) * 0.4, 1.1 * s, -0.3);
      spin(l); g.add(l);
    }
    g.add(at(cyl(0.05, 0.05, 0.9, 6, std(0x666666)), 0, 0.45, 0));
    return g;
  },
  highlimit(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(cyl(0.9, 0.8, 0.65, 14, std(0x1b263b)), 0, 0.32, 0));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.08, 8, 24), bas(0xffd166));
    ring.rotation.x = Math.PI / 2;
    g.add(at(ring, 0, 0.66 * s, 0));
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) g.add(at(cyl(0.16, 0.13, 0.45, 8, std(0xffd166)), Math.cos(a) * 1.0, 0.22, Math.sin(a) * 1.0));
    return g;
  },
  boxing(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.6, 0.1, 1.6, std(0x1d3557)), 0, 0.5, 0));
    for (const [x, z] of [[-0.75, -0.75], [0.75, -0.75], [-0.75, 0.75], [0.75, 0.75]]) g.add(at(box(0.08, 0.5, 0.08, std(0xff2a85)), x, 0.25, z));
    for (let i = 0; i < 4; i++) {
      const l = at(sphere(0.08, 6, glow(0xffffff, 0.8)), -0.6 + i * 0.4, 1.0 * s, -0.6);
      g.add(l);
    }
    return g;
  },
  vault(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.5, 1.4 * s, 1.1, std(0x8d99ae, { metalness: 0.8, roughness: 0.3 })), 0, 0.7 * s, 0));
    const door = at(cyl(0.45, 0.45, 0.1, 16, std(0xffd166, { metalness: 0.9, roughness: 0.2 })), 0, 0.7 * s, 0.58);
    door.rotation.x = Math.PI / 2;
    g.add(door);
    const dial = at(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 6, 16), bas(0xff2a85)), 0, 0.7 * s, 0.62);
    spin(dial); g.add(dial);
    return g;
  },
  restroom(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.1, 1.0 * s, 0.9, std(0x8ecae6)), 0, 0.5 * s, 0));
    g.add(at(box(1.2, 0.14, 1.0, bas(0xffffff)), 0, 1.0 * s, 0));
    g.add(at(box(0.4, 0.55, 0.06, bas(0x023047)), 0, 0.3, 0.47));
    return g;
  },
  plants(item, level) {
    const g = new THREE.Group();
    for (const [x, z] of [[-0.3, 0.2], [0.3, -0.2], [0, 0.35]]) {
      g.add(at(cyl(0.12, 0.16, 0.3, 8, std(0x8d6e4a)), x, 0.15, z));
      g.add(at(sphere(0.28, 8, std(0x2ecc71)), x, 0.55, z));
    }
    return g;
  }
};
