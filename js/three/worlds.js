import { state } from '../core/state.js';
import { themeById } from '../data/themes.js';
import {
  exteriorGroup, interiorGroup, pickableTilesExt, pickableTilesInt, vehicles
} from './scene.js';

const MAX_HALF = 11;

let stripGroup = null;
let interiorWalls = null;
const allExt = [];
export const cityPeds = [];
const allInt = [];
let groundMesh = null;
let floorMesh = null;

const extMatA = new THREE.MeshStandardMaterial({ color: 0x231d3c, roughness: 0.8 });
const extMatB = new THREE.MeshStandardMaterial({ color: 0x1d1833, roughness: 0.8 });
const intMatA = new THREE.MeshStandardMaterial({ color: 0x4a154b, roughness: 0.6 });
const intMatB = new THREE.MeshStandardMaterial({ color: 0x3b0d3c, roughness: 0.6 });
const extGeo = new THREE.BoxGeometry(state.tileSize * 0.92, 0.16, state.tileSize * 0.92);

export function findTile(list, gx, gz) {
  return list.find(t => t.userData.gx === gx && t.userData.gz === gz);
}

function makeTile(gx, gz, world) {
  const ts = state.tileSize;
  const checker = (gx + gz) % 2 === 0;
  const mat = world === 'exterior' ? (checker ? extMatA : extMatB) : (checker ? intMatA : intMatB);
  const tile = new THREE.Mesh(extGeo, mat);
  tile.position.set(gx * ts, 0, gz * ts);
  tile.userData = { gx, gz, key: `${gx},${gz}`, world };
  return tile;
}

function updateStrip() {
  if (!stripGroup) return;
  stripGroup.position.z = 0;
}

function updateInteriorWalls() {
  if (!interiorWalls) return;
  const half = Math.floor(state.gridSize / 2);
  const d = half * state.tileSize + 1.5;
  interiorWalls.back.position.z = -d;
  interiorWalls.left.position.x = -d;
}

export function applyRadius(radius) {
  pickableTilesExt.length = 0;
  pickableTilesInt.length = 0;
  for (const t of allExt) {
    const vis = Math.max(Math.abs(t.userData.gx), Math.abs(t.userData.gz)) <= radius;
    t.visible = vis;
    if (vis) pickableTilesExt.push(t);
  }
  for (const t of allInt) {
    const vis = Math.max(Math.abs(t.userData.gx), Math.abs(t.userData.gz)) <= radius;
    t.visible = vis;
    if (vis) pickableTilesInt.push(t);
  }
  updateStrip();
  updateInteriorWalls();
}

export function applyThemeToTiles(theme) {
  extMatA.color.setHex(theme.groundA);
  extMatB.color.setHex(theme.groundB);
  intMatA.color.setHex(theme.groundA).offsetHSL(0, 0, 0.05);
  intMatB.color.setHex(theme.groundB).offsetHSL(0, 0, 0.05);
  if (groundMesh) groundMesh.material.color.setHex(theme.groundB).offsetHSL(0, 0, -0.03);
  if (floorMesh) floorMesh.material.color.setHex(theme.groundA).offsetHSL(0, 0, 0.02);
}

export function createWorlds() {
  for (let gx = -MAX_HALF; gx <= MAX_HALF; gx++) {
    for (let gz = -MAX_HALF; gz <= MAX_HALF; gz++) {
      const tExt = makeTile(gx, gz, 'exterior');
      exteriorGroup.add(tExt);
      allExt.push(tExt);
      const tInt = makeTile(gx, gz, 'interior');
      interiorGroup.add(tInt);
      allInt.push(tInt);
    }
  }

  groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(460, 400),
    new THREE.MeshStandardMaterial({ color: 0x120e24, roughness: 0.9 })
  );
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.1;
  exteriorGroup.add(groundMesh);

  stripGroup = new THREE.Group();
  const R = 34;
  const spanX = 400;
  const spanZ = 340;
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x2b2b36, roughness: 0.85 });
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xc2c2c2, roughness: 0.95 });
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff1a8 });
  const postMat = new THREE.MeshStandardMaterial({ color: 0x556070 });
  const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x8d6e4a });
  const palmLeafMat = new THREE.MeshStandardMaterial({ color: 0x2f9e44 });
  const roadZs = [-51, -17, 17, 51];
  const roadXs = [-51, -17, 17, 51];

  for (const z of roadZs) {
    const road = new THREE.Mesh(new THREE.BoxGeometry(spanX, 0.12, 5), roadMat);
    road.position.set(0, -0.02, z);
    stripGroup.add(road);
    for (let x = -180; x <= 180; x += 8) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 0.15), stripeMat);
      stripe.position.set(x, -0.01, z);
      stripGroup.add(stripe);
    }
    for (const sz of [-3.5, 3.5]) {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(spanX, 0.18, 1.6), sidewalkMat);
      sw.position.set(0, 0.03, z + sz);
      stripGroup.add(sw);
    }
    for (let x = -180; x <= 180; x += 30) {
      for (const sz of [-4.4, 4.4]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 2.4, 6), postMat);
        post.position.set(x, 1.2, z + sz);
        stripGroup.add(post);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), lampMat);
        lamp.position.set(x, 2.45, z + sz);
        stripGroup.add(lamp);
      }
    }
    for (let x = -160; x <= 160; x += 52) {
      const palm = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 2.0, 6), palmTrunkMat);
      trunk.position.y = 1.0;
      palm.add(trunk);
      for (let f = 0; f < 6; f++) {
        const a = (f / 6) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.3, 5), palmLeafMat);
        frond.position.set(Math.cos(a) * 0.45, 2.1, Math.sin(a) * 0.45);
        frond.rotation.z = Math.cos(a) * 1.05;
        frond.rotation.x = Math.sin(a) * 1.05;
        palm.add(frond);
      }
      palm.position.set(x, 0.05, z + 4.2);
      stripGroup.add(palm);
    }
  }

  for (const x of roadXs) {
    const road = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, spanZ), roadMat);
    road.position.set(x, -0.02, 0);
    stripGroup.add(road);
    for (let z = -160; z <= 160; z += 8) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.14, 3.4), stripeMat);
      stripe.position.set(x, -0.01, z);
      stripGroup.add(stripe);
    }
    for (const sx of [-3.5, 3.5]) {
      const sw = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, spanZ), sidewalkMat);
      sw.position.set(x + sx, 0.03, 0);
      stripGroup.add(sw);
    }
  }

  const tram = new THREE.Group();
  const tramBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.8, 0.62), new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 }));
  tramBody.position.y = 0.55;
  const tramRoof = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.14, 0.7), new THREE.MeshStandardMaterial({ color: 0xd62828 }));
  tramRoof.position.y = 1.0;
  const tramWin = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.34, 0.66), new THREE.MeshBasicMaterial({ color: 0x9ad0ff }));
  tramWin.position.y = 0.62;
  tram.add(tramBody, tramRoof, tramWin);
  tram.position.set(-80, 0.06, 16.3);
  stripGroup.add(tram);
  vehicles.push({ mesh: tram, speed: 0.05 });

  for (let i = 0; i < 30; i++) {
    const ped = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 0.46, 6),
      new THREE.MeshStandardMaterial({ color: [0x00bbf9, 0xff9ebb, 0xffd166, 0x9b5de5, 0x06d6a0][i % 5] })
    );
    body.position.y = 0.3;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 6, 6), new THREE.MeshStandardMaterial({ color: 0xffcba4 }));
    head.position.y = 0.65;
    ped.add(body, head);
    const roadZ = roadZs[i % roadZs.length];
    const side = i % 2 === 0 ? 1 : -1;
    ped.position.set((Math.random() - 0.5) * 320, 0.06, roadZ + side * 3.6);
    stripGroup.add(ped);
    cityPeds.push({ mesh: ped, speed: (i % 3 === 0 ? -1 : 1) * (0.02 + Math.random() * 0.03) });
  }

  const skyline = new THREE.Group();
  for (let i = 0; i < 40; i++) {
    const h = 6 + Math.random() * 28;
    const w = 6 + Math.random() * 8;
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 8 + Math.random() * 6),
      new THREE.MeshStandardMaterial({ color: [0x1b2436, 0x22304a, 0x2a3550][i % 3], roughness: 0.9 })
    );
    b.position.set(-200 + i * 10 + Math.random() * 4, h / 2, -150 - Math.random() * 20);
    skyline.add(b);
  }
  exteriorGroup.add(skyline);
  exteriorGroup.add(stripGroup);

  floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(58, 58),
    new THREE.MeshStandardMaterial({ color: 0x1a081f, roughness: 0.85 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -0.1;
  interiorGroup.add(floorMesh);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x3c096c, roughness: 0.5 });
  interiorWalls = {
    back: new THREE.Mesh(new THREE.BoxGeometry(0.4 + MAX_HALF * state.tileSize * 2, 2.5, 0.4), wallMat),
    left: new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.5, 0.4 + MAX_HALF * state.tileSize * 2), wallMat)
  };
  interiorWalls.back.position.y = 1.25;
  interiorWalls.left.position.y = 1.25;
  interiorGroup.add(interiorWalls.back, interiorWalls.left);

  for (let i = 0; i < 10; i++) {
    const isLimo = i % 2 === 0;
    const car = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(isLimo ? 2.1 : 1.2, 0.45, 0.7),
      new THREE.MeshStandardMaterial({ color: isLimo ? 0xffffff : [0x00f5d4, 0xff2a85, 0xffd166, 0x9b5de5][i % 4], roughness: 0.3 })
    );
    body.position.y = 0.3;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(isLimo ? 1.3 : 0.65, 0.35, 0.6), new THREE.MeshStandardMaterial({ color: 0x111122 }));
    cabin.position.y = 0.65;
    car.add(body, cabin);
    const dir = i % 2 === 0 ? 1 : -1;
    car.position.set((Math.random() - 0.5) * 300, 0.06, 17 + dir * 0.95);
    car.userData.dir = dir;
    stripGroup.add(car);
    vehicles.push({ mesh: car, speed: (0.06 + Math.random() * 0.05) * dir });
  }

  applyRadius(Math.floor(state.gridSize / 2));
  if (state.lots && state.lots[state.activeLot]) {
    applyThemeToTiles(themeById(state.lots[state.activeLot].theme));
  }
}

export function expandWorld() {
  applyRadius(Math.floor(state.gridSize / 2));
}

export function worldRadius() {
  return Math.floor(state.gridSize / 2);
}

export function animateCityPeds(dtMs) {
  const dt = dtMs / 1000;
  const rep = state.reputation || 0;
  const desired = Math.round(6 + (rep / 100) * 20);
  for (let i = 0; i < cityPeds.length; i++) {
    const p = cityPeds[i];
    p.mesh.visible = i < desired;
    p.mesh.position.x += p.speed * dt * 60;
    if (p.mesh.position.x > 180) p.mesh.position.x = -180;
    if (p.mesh.position.x < -180) p.mesh.position.x = 180;
    p.mesh.position.y = 0.06 + Math.abs(Math.sin(performance.now() * 0.006 + p.mesh.position.x)) * 0.04;
  }
}
