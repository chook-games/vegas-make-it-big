import { animatedObjects } from './scene.js';

const scaleFor = (level) => 1 + (level - 1) * 0.25;

function std(color, opts) {
  return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.5 }, opts || {}));
}
function bas(color) {
  return new THREE.MeshBasicMaterial({ color });
}
function box(w, h, d, material) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}
function cyl(rt, rb, h, seg, material) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
}
function at(obj, x, y, z) { obj.position.set(x, y, z); return obj; }

const BUILDERS = {
  casino(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const base = box(1.6, 1.45 * s, 1.4, std(0x2b0938, { roughness: 0.4 }));
    at(base, 0, 0.72 * s, -0.1);
    const roof = box(1.75, 0.2, 1.55, bas(0xff2a85));
    at(roof, 0, 1.5 * s, -0.1);
    const canopy = box(0.9, 0.18, 0.55, bas(0xffd166));
    at(canopy, 0, 0.65, 0.72);
    const carpet = box(0.65, 0.06, 0.5, bas(0xef233c));
    at(carpet, 0, 0.04, 0.75);
    const sign = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), bas(0xffd166));
    at(sign, 0, 2.05 * s, -0.1);
    animatedObjects.push({ mesh: sign, type: 'spin' });
    g.add(base, roof, canopy, carpet, sign);
    return g;
  },
  hotel(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const tower = box(1.45, 2.7 * s, 0.95, std(0x00bbf9, { metalness: 0.5, roughness: 0.2 }));
    at(tower, 0, 1.35 * s, -0.35);
    const crown = box(1.55, 0.2, 1.05, bas(0xffd166));
    at(crown, 0, 2.75 * s, -0.35);
    const deck = box(1.35, 0.12, 0.75, std(0xf8f9fa));
    at(deck, 0, 0.06, 0.48);
    const water = box(1.05, 0.15, 0.5, bas(0x00f5d4));
    at(water, 0, 0.07, 0.48);
    g.add(tower, crown, deck, water);
    return g;
  },
  chapel(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const body = box(1.2, 0.95 * s, 1.4, std(0xffffff));
    at(body, 0, 0.48 * s, -0.1);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.05, 0.75, 4), std(0xff9ebb));
    roof.rotation.y = Math.PI / 4;
    at(roof, 0, 1.3 * s, -0.1);
    const steeple = box(0.45, 1.55 * s, 0.45, std(0xffe5ec));
    at(steeple, 0, 0.78 * s, 0.55);
    const carpet = box(0.45, 0.06, 0.45, bas(0xff2a85));
    at(carpet, 0, 0.04, 0.78);
    g.add(body, roof, steeple, carpet);
    return g;
  },
  fountain(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const pool = cyl(0.82, 0.88, 0.32, 16, std(0x00f5d4));
    at(pool, 0, 0.16, 0);
    const jet = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.4 * s, 12), new THREE.MeshBasicMaterial({ color: 0x90e0ef, wireframe: true }));
    at(jet, 0, 0.85 * s, 0);
    const arch = box(1.3, 1.1, 0.18, std(0xffd166, { metalness: 0.6 }));
    at(arch, 0, 0.55, -0.65);
    animatedObjects.push({ mesh: jet, type: 'spin' });
    g.add(pool, jet, arch);
    return g;
  },
  generator(item, level) {
    const g = new THREE.Group();
    const unit = box(1.3, 0.85, 1.1, std(0x555b6e));
    at(unit, 0, 0.42, -0.1);
    const panel = box(0.7, 0.5, 0.15, bas(0x00f5d4));
    at(panel, 0, 0.45, 0.46);
    const rotor = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 8, 16), bas(0xffd166));
    at(rotor, 0, 1.05, -0.1);
    animatedObjects.push({ mesh: rotor, type: 'spin' });
    g.add(unit, panel, rotor);
    return g;
  },
  parking(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const slab = box(1.7, 0.16, 1.6, std(0x3a3f52));
    at(slab, 0, 0.08, 0);
    for (let i = 1; i <= 2; i++) {
      const deck = box(1.7, 0.12, 1.6, std(0x4a5068));
      at(deck, 0, 0.16 + i * 0.55 * s, 0);
      g.add(deck);
    }
    const signPole = cyl(0.05, 0.05, 1.4, 6, bas(0x00bbf9));
    at(signPole, 0, 0.7, 0.8);
    const sign = box(0.5, 0.5, 0.06, bas(0x00f5d4));
    at(sign, 0, 1.45, 0.8);
    g.add(slab, signPole, sign);
    return g;
  },
  restaurant(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const body = box(1.5, 0.95 * s, 1.3, std(0x7a4a2b));
    at(body, 0, 0.48 * s, -0.1);
    const roof = box(1.65, 0.18, 1.45, std(0x5a3320));
    at(roof, 0, 1.0 * s, -0.1);
    const awning = box(1.2, 0.12, 0.4, bas(0xef233c));
    at(awning, 0, 0.62, 0.7);
    const door = box(0.5, 0.7, 0.08, bas(0xffd166));
    at(door, 0, 0.38, 0.68);
    g.add(body, roof, awning, door);
    return g;
  },
  pool(item, level) {
    const g = new THREE.Group();
    const deck = box(1.9, 0.1, 1.7, std(0xf1f3f8));
    at(deck, 0, 0.05, 0);
    const water = box(1.5, 0.12, 1.2, bas(0x00b4d8));
    at(water, 0, 0.09, 0);
    for (const [x, z] of [[-0.85, 0.7], [0.85, 0.7], [-0.85, -0.7], [0.85, -0.7]]) {
      const lounger = box(0.4, 0.12, 0.7, bas(0xffd166));
      at(lounger, x, 0.14, z);
      g.add(lounger);
    }
    const umbrella = cyl(0.05, 0.05, 0.7, 6, std(0xdddddd));
    at(umbrella, 0, 0.4, 0.75);
    const top = cyl(0.5, 0.05, 0.2, 8, bas(0xff2a85));
    at(top, 0, 0.8, 0.75);
    g.add(deck, water, umbrella, top);
    return g;
  },
  ferris(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const hub = cyl(0.1, 0.1, 1.0, 8, std(0x999999));
    at(hub, 0, 0.5, 0);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 8, 24), bas(0x00f5d4));
    at(wheel, 0, 1.45 * s, 0);
    animatedObjects.push({ mesh: wheel, type: 'spin' });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const cabin = box(0.22, 0.22, 0.22, bas(i % 2 ? 0xff2a85 : 0xffd166));
      cabin.position.set(Math.cos(a) * 0.95, 1.45 * s + Math.sin(a) * 0.95, 0);
      wheel.add(cabin);
    }
    g.add(hub, wheel);
    return g;
  },
  stadium(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const bowl = cyl(1.5, 1.7, 0.7, 12, std(0x2a2f45));
    at(bowl, 0, 0.35, 0);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.14, 8, 16), bas(0xffd166));
    rim.rotation.x = Math.PI / 2;
    at(rim, 0, 0.75 * s, 0);
    const pitch = cyl(1.1, 1.1, 0.1, 12, bas(0x06d6a0));
    at(pitch, 0, 0.72 * s, 0);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const light = box(0.12, 0.9, 0.12, bas(0xffffff));
      light.position.set(Math.cos(a) * 1.7, 1.1 * s, Math.sin(a) * 1.7);
      g.add(light);
    }
    g.add(bowl, rim, pitch);
    return g;
  },

  slots(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    for (let i = -0.48; i <= 0.48; i += 0.48) {
      const cab = box(0.36, 1.05 * s, 0.45, std(0xffbe0b));
      at(cab, i, 0.52 * s, -0.15);
      const screen = box(0.28, 0.3, 0.1, bas(0x00f5d4));
      at(screen, i, 0.68 * s, 0.08);
      const stool = cyl(0.13, 0.1, 0.35, 8, std(0xef233c));
      at(stool, i, 0.18, 0.38);
      g.add(cab, screen, stool);
    }
    return g;
  },
  roulette(item, level) {
    const g = new THREE.Group();
    const table = box(1.5, 0.62, 0.95, std(0x06d6a0));
    at(table, 0, 0.31, 0);
    const wheel = cyl(0.34, 0.34, 0.15, 14, std(0xffd166));
    at(wheel, -0.32, 0.68, 0);
    animatedObjects.push({ mesh: wheel, type: 'spin' });
    g.add(table, wheel);
    for (let x = -0.45; x <= 0.45; x += 0.45) {
      const seat = cyl(0.13, 0.1, 0.35, 8, std(0xffd166));
      at(seat, x, 0.18, 0.68);
      g.add(seat);
    }
    return g;
  },
  vip_bj(item, level) {
    const g = new THREE.Group();
    const base = cyl(0.72, 0.62, 0.65, 12, std(0xef233c));
    at(base, 0, 0.32, 0);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 8, 20), bas(0xffd166));
    ring.rotation.x = Math.PI / 2;
    at(ring, 0, 0.66, 0);
    g.add(base, ring);
    for (let angle = -0.7; angle <= 0.7; angle += 0.7) {
      const chair = cyl(0.15, 0.12, 0.42, 8, std(0xffd166));
      at(chair, Math.sin(angle) * 0.85, 0.21, Math.cos(angle) * 0.85);
      g.add(chair);
    }
    return g;
  },
  wall(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const wall = box(1.95, 1.55 * s, 0.38, std(0xd4af37, { metalness: 0.6, roughness: 0.3 }));
    at(wall, 0, 0.77 * s, 0);
    g.add(wall);
    return g;
  },
  security(item, level) {
    const g = new THREE.Group();
    const desk = box(1.2, 0.85, 0.9, std(0x1d3557));
    at(desk, 0, 0.42, 0);
    const monitor = box(0.8, 0.35, 0.12, bas(0x00f5d4));
    at(monitor, 0, 0.68, 0.42);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), new THREE.MeshBasicMaterial({ color: 0x3a86ff, wireframe: true }));
    at(dome, 0, 1.15, 0);
    animatedObjects.push({ mesh: dome, type: 'spin' });
    g.add(desk, monitor, dome);
    return g;
  },
  cashier(item, level) {
    const g = new THREE.Group();
    const counter = box(1.4, 0.75, 0.7, std(0x2b2d42));
    at(counter, 0, 0.37, 0);
    const glass = box(1.3, 0.35, 0.06, new THREE.MeshBasicMaterial({ color: 0x90e0ef, transparent: true, opacity: 0.4 }));
    at(glass, 0, 0.95, -0.1);
    const tray = box(0.4, 0.12, 0.3, bas(0xffd166));
    at(tray, 0, 0.8, 0.2);
    animatedObjects.push({ mesh: tray, type: 'spin' });
    g.add(counter, glass, tray);
    return g;
  },
  bar(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const counter = box(1.136, 0.7, 0.6, std(0x4a2c17));
    at(counter, 0, 0.35, 0);
    const shelf = box(1.1, 0.9, 0.25, std(0x6b4423));
    at(shelf, 0, 0.95 * s, -0.4);
    for (let i = -0.4; i <= 0.4; i += 0.4) {
      const bottle = cyl(0.06, 0.06, 0.3, 6, bas(i % 2 ? 0x00f5d4 : 0xff2a85));
      at(bottle, i, 1.15 * s, -0.28);
      g.add(bottle);
    }
    g.add(counter, shelf);
    return g;
  },
  poker(item, level) {
    const g = new THREE.Group();
    const table = cyl(0.75, 0.75, 0.6, 12, std(0x0b6e4f));
    at(table, 0, 0.3, 0);
    const felt = cyl(0.7, 0.7, 0.08, 12, std(0x0a9e6f));
    at(felt, 0, 0.64, 0);
    g.add(table, felt);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const chair = cyl(0.14, 0.11, 0.4, 8, std(0xef233c));
      at(chair, Math.cos(a) * 0.95, 0.2, Math.sin(a) * 0.95);
      g.add(chair);
    }
    return g;
  },
  craps(item, level) {
    const g = new THREE.Group();
    const table = box(1.6, 0.6, 0.85, std(0x0a9396));
    at(table, 0, 0.3, 0);
    for (let i = -0.5; i <= 0.5; i += 0.5) {
      const dice = box(0.16, 0.16, 0.16, bas(0xffffff));
      at(dice, i, 0.68, 0.2);
      g.add(dice);
    }
    g.add(table);
    return g;
  },
  sportsbook(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const wall = box(1.8, 1.6, 0.3, std(0x1b263b));
    at(wall, 0, 0.8 * s, -0.5);
    const screen = box(1.6, 0.9, 0.06, bas(0x00f5d4));
    at(screen, 0, 0.9 * s, -0.33);
    for (let x = -0.5; x <= 0.5; x += 0.5) {
      const seat = box(0.4, 0.4, 0.4, std(0x415a77));
      at(seat, x, 0.2, 0.3);
      g.add(seat);
    }
    g.add(wall, screen);
    return g;
  },
  buffet(item, level) {
    const g = new THREE.Group();
    const s = scaleFor(level);
    const table = box(1.7, 0.7, 0.7, std(0x8d5524));
    at(table, 0, 0.35, 0);
    for (let x = -0.6; x <= 0.6; x += 0.4) {
      const tray = cyl(0.16, 0.16, 0.12, 10, bas(0xffd166));
      at(tray, x, 0.76 * s, 0.05);
      g.add(tray);
    }
    const sign = box(0.9, 0.3, 0.06, bas(0xff2a85));
    at(sign, 0, 1.15 * s, -0.3);
    g.add(table, sign);
    return g;
  }
};

export function createBuildingMesh(item, level = 1, isGhost = false) {
  const builder = BUILDERS[item.id];
  const group = builder ? builder(item, level) : new THREE.Group();
  if (isGhost) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.05, 24), new THREE.MeshBasicMaterial({ color: 0x00f5d4, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2;
    at(ring, 0, 0.06, 0);
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.45, 4), bas(0x00f5d4));
    arrow.rotation.x = Math.PI / 2;
    at(arrow, 0, 0.18, 1.12);
    group.add(ring, arrow);
  }
  return group;
}
