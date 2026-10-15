import { std, bas, glow, box, cyl, cone, sphere, at, spin, scaleFor } from './meshkit.js';

export const EXTERIOR = {
  casino(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const shell = ctx && ctx.theme ? ctx.theme.shell : 0x2b0938;
    const roof = ctx && ctx.theme ? ctx.theme.roof : 0xff2a85;
    g.add(at(box(1.6, 1.45 * s, 1.4, std(shell, { roughness: 0.4 })), 0, 0.72 * s, -0.1));
    g.add(at(box(1.75, 0.2, 1.55, bas(roof)), 0, 1.5 * s, -0.1));
    g.add(at(box(0.9, 0.18, 0.55, bas(0xffd166)), 0, 0.65, 0.72));
    g.add(at(box(0.65, 0.06, 0.5, bas(0xef233c)), 0, 0.04, 0.75));
    const sign = at(new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), bas(0xffd166)), 0, 2.05 * s, -0.1);
    spin(sign); g.add(sign);
    return g;
  },
  hotel(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const shell = ctx && ctx.theme ? ctx.theme.shell : 0x00bbf9;
    g.add(at(box(1.45, 2.7 * s, 0.95, std(shell, { metalness: 0.5, roughness: 0.2 })), 0, 1.35 * s, -0.35));
    g.add(at(box(1.55, 0.2, 1.05, bas(0xffd166)), 0, 2.75 * s, -0.35));
    g.add(at(box(1.35, 0.12, 0.75, std(0xf8f9fa)), 0, 0.06, 0.48));
    g.add(at(box(1.05, 0.15, 0.5, bas(0x00f5d4)), 0, 0.07, 0.48));
    for (let i = 0; i < 4; i++) {
      const win = at(box(0.28, 0.3, 0.05, bas(0xffe08a)), -0.5 + i * 0.33, 1.5 * s, 0.13);
      g.add(win);
    }
    return g;
  },
  chapel(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.2, 0.95 * s, 1.4, std(0xffffff)), 0, 0.48 * s, -0.1));
    const roof = cone(1.05, 0.75, 4, std(0xff9ebb));
    roof.rotation.y = Math.PI / 4;
    g.add(at(roof, 0, 1.3 * s, -0.1));
    g.add(at(box(0.45, 1.55 * s, 0.45, std(0xffe5ec)), 0, 0.78 * s, 0.55));
    g.add(at(box(0.45, 0.06, 0.45, bas(0xff2a85)), 0, 0.04, 0.78));
    g.add(at(sphere(0.1, 8, bas(0xffd166)), 0, 1.62 * s, 0.55));
    return g;
  },
  fountain(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(cyl(0.82, 0.88, 0.32, 16, std(0x00f5d4)), 0, 0.16, 0));
    const jet = at(cone(0.32, 1.4 * s, 12, new THREE.MeshBasicMaterial({ color: 0x90e0ef, wireframe: true })), 0, 0.85 * s, 0);
    spin(jet); g.add(jet);
    g.add(at(box(1.3, 1.1, 0.18, std(0xffd166, { metalness: 0.6 })), 0, 0.55, -0.65));
    return g;
  },
  generator(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.3, 0.85, 1.1, std(0x555b6e)), 0, 0.42, -0.1));
    g.add(at(box(0.7, 0.5, 0.15, bas(0x00f5d4)), 0, 0.45, 0.46));
    const rotor = at(new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 8, 16), bas(0xffd166)), 0, 1.05, -0.1);
    spin(rotor); g.add(rotor);
    return g;
  },
  parking(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.7, 0.16, 1.6, std(0x3a3f52)), 0, 0.08, 0));
    for (let i = 1; i <= 2; i++) g.add(at(box(1.7, 0.12, 1.6, std(0x4a5068)), 0, 0.16 + i * 0.55 * s, 0));
    g.add(at(cyl(0.05, 0.05, 1.4, 6, bas(0x00bbf9)), 0, 0.7, 0.8));
    g.add(at(box(0.5, 0.5, 0.06, bas(0x00f5d4)), 0, 1.45, 0.8));
    return g;
  },
  restaurant(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.5, 0.95 * s, 1.3, std(0x7a4a2b)), 0, 0.48 * s, -0.1));
    g.add(at(box(1.65, 0.18, 1.45, std(0x5a3320)), 0, 1.0 * s, -0.1));
    g.add(at(box(1.2, 0.12, 0.4, bas(0xef233c)), 0, 0.62, 0.7));
    g.add(at(box(0.5, 0.7, 0.08, bas(0xffd166)), 0, 0.38, 0.68));
    return g;
  },
  solar(item, level) {
    const g = new THREE.Group();
    for (let r = -1; r <= 1; r++) {
      const p = at(box(1.4, 0.08, 0.5, bas(0x1d3557)), 0, 0.5, r * 0.45);
      p.rotation.x = -0.5;
      g.add(p);
      g.add(at(box(0.09, 0.45, 0.09, std(0x888888)), 0, 0.22, r * 0.45));
    }
    const light = at(sphere(0.2, 10, glow(0x00f5d4, 0.6)), 0, 0.9, -0.7);
    spin(light); g.add(light);
    return g;
  },
  pool(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.9, 0.1, 1.7, std(0xf1f3f8)), 0, 0.05, 0));
    g.add(at(box(1.5, 0.12, 1.2, bas(0x00b4d8)), 0, 0.09, 0));
    for (const [x, z] of [[-0.85, 0.7], [0.85, 0.7], [-0.85, -0.7], [0.85, -0.7]]) {
      g.add(at(box(0.4, 0.12, 0.7, bas(0xffd166)), x, 0.14, z));
    }
    g.add(at(cyl(0.05, 0.05, 0.7, 6, std(0xdddddd)), 0, 0.4, 0.75));
    g.add(at(cyl(0.5, 0.05, 0.2, 8, bas(0xff2a85)), 0, 0.8, 0.75));
    return g;
  },
  gardens(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.9, 0.08, 1.7, std(0x2a5c3a)), 0, 0.04, 0));
    for (let i = 0; i < 5; i++) {
      const x = -0.7 + (i % 3) * 0.7;
      const z = -0.5 + Math.floor(i / 3) * 0.9;
      g.add(at(cyl(0.07, 0.09, 0.5, 6, std(0x6b4423)), x, 0.28, z));
      const crown = at(sphere(0.32, 8, std(0x2ecc71)), x, 0.7, z);
      g.add(crown);
    }
    return g;
  },
  cinema(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.6, 1.0 * s, 1.3, std(0x22223b)), 0, 0.5 * s, -0.1));
    g.add(at(box(1.5, 0.7, 0.08, bas(0x9d4edd)), 0, 0.9 * s, 0.62));
    for (let i = 0; i < 3; i++) g.add(at(sphere(0.06, 6, bas(0xffd166)), -0.5 + i * 0.5, 1.5 * s, -0.1));
    return g;
  },
  mall(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.7, 1.3 * s, 1.4, std(0x9bb1ff, { transparent: true, opacity: 0.75, roughness: 0.1 })), 0, 0.65 * s, -0.1));
    g.add(at(box(1.8, 0.16, 1.5, bas(0xff2a85)), 0, 1.35 * s, -0.1));
    g.add(at(box(0.6, 0.6, 0.06, bas(0xffd166)), 0, 0.9 * s, 0.62));
    return g;
  },
  aquarium(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(0x00b4d8, { transparent: true, opacity: 0.55 }));
    g.add(at(dome, 0, 0.1, 0));
    g.add(at(cyl(0.95, 1.0, 0.1, 16, std(0x023e8a)), 0, 0.05, 0));
    const fish = at(box(0.2, 0.1, 0.1, bas(0xffd166)), 0, 0.5 * s, 0);
    spin(fish); g.add(fish);
    return g;
  },
  powerplant(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    for (const x of [-0.5, 0.5]) g.add(at(cyl(0.3, 0.4, 1.2 * s, 10, std(0x9aa0b5)), x, 0.6 * s, 0));
    g.add(at(cyl(0.14, 0.16, 1.7 * s, 8, std(0x6b7280)), 0, 0.85 * s, 0.8));
    g.add(at(box(1.2, 0.5, 0.9, std(0x4b5563)), 0, 0.25, -0.7));
    return g;
  },
  marina(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.9, 0.1, 1.6, bas(0x0077b6)), 0, 0.05, 0));
    for (const [x, z] of [[-0.6, 0.5], [0.4, -0.4], [-0.2, -0.6]]) {
      g.add(at(box(0.5, 0.18, 0.25, std(0xffffff)), x, 0.14, z));
      g.add(at(cyl(0.03, 0.03, 0.5, 6, std(0xbbbbbb)), x, 0.45, z));
    }
    g.add(at(cyl(0.25, 0.35, 1.3, 8, std(0xffd166)), 0.7, 0.65, 0.6));
    g.add(at(sphere(0.14, 8, bas(0xff2a85)), 0.7, 1.35, 0.6));
    return g;
  },
  golf(item, level) {
    const g = new THREE.Group();
    g.add(at(box(1.9, 0.08, 1.7, std(0x3fa34d)), 0, 0.04, 0));
    g.add(at(cyl(0.35, 0.35, 0.06, 12, bas(0xf1e05a)), -0.6, 0.09, -0.5));
    g.add(at(cyl(0.03, 0.03, 0.7, 6, std(0xffffff)), 0.4, 0.4, 0.3));
    g.add(at(box(0.35, 0.22, 0.03, bas(0xff2a85)), 0.55, 0.7, 0.3));
    return g;
  },
  ferris(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(cyl(0.1, 0.1, 1.0, 8, std(0x999999)), 0, 0.5, 0));
    const wheel = at(new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 8, 24), bas(0x00f5d4)), 0, 1.45 * s, 0);
    spin(wheel);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const cabin = box(0.22, 0.22, 0.22, bas(i % 2 ? 0xff2a85 : 0xffd166));
      cabin.position.set(Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0);
      wheel.add(cabin);
    }
    g.add(wheel);
    return g;
  },
  rollercoaster(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const trackColor = 0xff2a85;
    for (let i = 0; i < 3; i++) {
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.5 - i * 0.05, 0.05, 6, 16, Math.PI * 1.5), bas(trackColor));
      t.rotation.y = i * 0.6;
      at(t, 0, 0.6 + i * 0.25 * s, 0);
      g.add(t);
    }
    g.add(at(box(1.0, 0.1, 0.8, std(0x555b6e)), 0, 0.05, 0));
    const car = at(box(0.3, 0.2, 0.2, bas(0xffd166)), 0.5, 0.6, 0);
    spin(car); g.add(car);
    return g;
  },
  convention(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.9, 1.1 * s, 1.5, std(0x495057)), 0, 0.55 * s, -0.1));
    g.add(at(box(2.0, 0.2, 1.6, bas(0x00f5d4)), 0, 1.15 * s, -0.1));
    g.add(at(box(1.3, 0.7, 0.1, bas(0x90e0ef)), 0, 0.5, 0.66));
    return g;
  },
  stadium(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(cyl(1.5, 1.7, 0.7, 12, std(0x2a2f45)), 0, 0.35, 0));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.14, 8, 16), bas(0xffd166));
    rim.rotation.x = Math.PI / 2;
    g.add(at(rim, 0, 0.75 * s, 0));
    g.add(at(cyl(1.1, 1.1, 0.1, 12, bas(0x06d6a0)), 0, 0.72 * s, 0));
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      g.add(at(box(0.12, 0.9, 0.12, bas(0xffffff)), Math.cos(a) * 1.7, 1.1 * s, Math.sin(a) * 1.7));
    }
    return g;
  },
  helipad(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.6, 0.16, 1.6, std(0x2b2d42)), 0, 0.08, 0));
    g.add(at(cyl(0.8, 0.8, 0.04, 16, bas(0x00f5d4)), 0, 0.18, 0));
    g.add(at(box(0.5, 0.5, 0.5, std(0x444a5a)), -0.6, 0.5 * s + 0.2, -0.6));
    const rotor = at(box(1.2, 0.03, 0.12, bas(0xcccccc)), 0, 1.0 * s, 0);
    spin(rotor); g.add(rotor);
    return g;
  },
  observatory(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(cyl(0.45, 0.6, 2.6 * s, 12, std(0x5c677d)), 0, 1.3 * s, 0));
    g.add(at(sphere(0.6, 14, std(0x33415c)), 0, 2.6 * s, 0));
    const beam = at(cone(0.2, 1.0, 8, glow(0x00f5d4, 0.5)), 0.3, 3.1 * s, 0.3);
    spin(beam); g.add(beam);
    return g;
  },
  statue(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const c = ctx && ctx.theme ? ctx.theme.accent : 0x2ecc71;
    g.add(at(box(0.9, 0.4, 0.9, std(0xd9d9d9)), 0, 0.2, 0));
    g.add(at(cyl(0.18, 0.28, 2.4 * s, 10, std(c)), 0, 1.6 * s, 0));
    g.add(at(sphere(0.22, 10, std(c)), 0, 2.9 * s, 0));
    const torch = at(cone(0.12, 0.5, 8, glow(0xffd166, 0.9)), 0.25, 3.2 * s, 0);
    spin(torch); g.add(torch);
    return g;
  },
  titanic(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const c = ctx && ctx.theme ? ctx.theme.shell : 0x023e8a;
    g.add(at(box(2.0, 0.7 * s, 0.8, std(c)), 0, 0.5, 0));
    g.add(at(box(1.6, 0.35, 0.55, std(0xffffff)), 0, 1.05 * s, 0));
    for (const x of [-0.5, 0, 0.5]) g.add(at(cyl(0.1, 0.14, 0.6 * s, 8, std(0xd62828)), x, 1.5 * s, 0));
    return g;
  },
  rocket(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(cyl(0.35, 0.5, 2.4 * s, 12, std(0xe0e0e0)), 0, 1.2 * s, 0));
    g.add(at(cone(0.35, 0.8, 12, std(0xff2a85)), 0, 2.75 * s, 0));
    g.add(at(cone(0.2, 0.7, 8, glow(0xff8c00, 0.9)), 0, -0.05, 0));
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      g.add(at(box(0.1, 0.6, 0.5, std(0x00f5d4)), Math.cos(a) * 0.5, 0.3, Math.sin(a) * 0.5));
    }
    return g;
  },
  trex(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(0.5, 1.1 * s, 0.9, std(0x3f7d2e)), 0, 0.75 * s, -0.2));
    g.add(at(box(0.5, 0.5, 0.6, std(0x2e6b2e)), 0.1, 1.5 * s, 0.2));
    g.add(at(box(0.7, 0.2, 0.2, std(0x2e6b2e)), 0.5, 1.55 * s, 0.3));
    g.add(at(cyl(0.06, 0.16, 1.4 * s, 6, std(0x3f7d2e)), -0.1, 0.5, 0.7));
    return g;
  },
  pagoda(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const c = ctx && ctx.theme ? ctx.theme.shell : 0x9d0208;
    for (let i = 0; i < 3; i++) {
      const w = 1.4 - i * 0.35;
      g.add(at(box(w, 0.4, w, std(c)), 0, 0.4 + i * 0.75 * s, 0));
      const roof = cone(w * 0.8, 0.4, 4, std(0xffd166));
      roof.rotation.y = Math.PI / 4;
      g.add(at(roof, 0, 0.75 + i * 0.75 * s, 0));
    }
    return g;
  },
  pyramid(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const c = ctx && ctx.theme ? ctx.theme.shell : 0xc9a227;
    const p = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.0 * s, 4), std(c));
    p.rotation.y = Math.PI / 4;
    g.add(at(p, 0, 1.0 * s, 0));
    g.add(at(box(0.3, 0.4, 0.1, bas(0x111111)), 0, 0.4, 0.75));
    const glowTop = at(cone(0.15, 0.3, 4, glow(0xffd166, 0.9)), 0, 2.05 * s, 0);
    spin(glowTop); g.add(glowTop);
    return g;
  },
  saloon(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.6, 1.1 * s, 1.2, std(0x8f5a30)), 0, 0.55 * s, 0));
    g.add(at(box(1.8, 0.2, 1.4, std(0x5a3320)), 0, 1.15 * s, 0));
    g.add(at(cyl(0.05, 0.05, 1.2, 6, std(0x4a2c17)), 0, 0.9, -0.6));
    g.add(at(box(0.8, 0.35, 0.05, bas(0xd9822b)), 0, 0.9, 0.61));
    return g;
  },
  volcano(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(cone(1.2, 1.8 * s, 8, std(0x4a3520)), 0, 0.9 * s, 0));
    const lava = at(cone(0.35, 0.5, 8, glow(0xff4d00, 0.95)), 0, 1.9 * s, 0);
    spin(lava); g.add(lava);
    return g;
  },
  castle(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    g.add(at(box(1.8, 1.4 * s, 1.4, std(0x777f8c)), 0, 0.7 * s, 0));
    for (const [x, z] of [[-0.8, -0.6], [0.8, -0.6], [-0.8, 0.6], [0.8, 0.6]]) {
      g.add(at(cyl(0.22, 0.22, 1.8 * s, 8, std(0x5c6672)), x, 0.9 * s, z));
    }
    g.add(at(box(0.5, 0.6, 0.1, bas(0x3d4450)), 0, 0.4, 0.72));
    return g;
  },
  robot(item, level, ctx) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const c = ctx && ctx.theme ? ctx.theme.accent : 0xff2a85;
    g.add(at(box(0.2, 0.8, 0.2, std(0x8a8f98)), -0.3, 0.4, 0));
    g.add(at(box(0.2, 0.8, 0.2, std(0x8a8f98)), 0.3, 0.4, 0));
    g.add(at(box(1.0, 1.0 * s, 0.8, std(0x2b2d42)), 0, 1.3 * s, 0));
    g.add(at(box(0.7, 0.5, 0.7, std(0x33365a)), 0, 2.15 * s, 0));
    const eye = at(sphere(0.1, 8, glow(c, 1.0)), 0, 2.2 * s, 0.36);
    g.add(eye);
    const ring = at(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 6, 20), glow(0x00f5d4, 0.8)), 0, 1.3 * s, 0);
    ring.rotation.x = Math.PI / 2;
    spin(ring); g.add(ring);
    return g;
  }
};
