import { state } from '../core/state.js';
import { themeById } from '../data/themes.js';
import {
  exteriorGroup, interiorGroup, pickableTilesExt, pickableTilesInt, vehicles
} from './scene.js';

const MAX_HALF = 11;

let stripGroup = null;
let interiorWalls = null;
const allExt = [];
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
  const half = Math.floor(state.gridSize / 2);
  stripGroup.position.z = half * state.tileSize + 3.4;
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
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshStandardMaterial({ color: 0x120e24, roughness: 0.9 })
  );
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.1;
  exteriorGroup.add(groundMesh);

  stripGroup = new THREE.Group();
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(44, 0.12, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x2b2b36, roughness: 0.85 })
  );
  road.position.y = -0.02;
  stripGroup.add(road);

  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xc2c2c2, roughness: 0.95 });
  const curbNeg = new THREE.Mesh(new THREE.BoxGeometry(46, 0.18, 1.7), sidewalkMat);
  curbNeg.position.set(0, 0.03, -2.95);
  const curbPos = new THREE.Mesh(new THREE.BoxGeometry(46, 0.18, 1.7), sidewalkMat);
  curbPos.position.set(0, 0.03, 2.95);
  stripGroup.add(curbNeg, curbPos);

  for (let i = -20; i <= 20; i += 2.5) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.15), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
    stripe.position.set(i, -0.01, 0);
    stripGroup.add(stripe);
  }

  const railMat = new THREE.MeshStandardMaterial({ color: 0x6a6f7a, metalness: 0.6, roughness: 0.4 });
  for (const rz of [-0.9, -0.5]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(44, 0.1, 0.09), railMat);
    rail.position.set(0, 0.0, rz);
    stripGroup.add(rail);
  }

  for (const cx of [-9, -3, 3, 9]) {
    for (let cz = -1.7; cz <= 1.7; cz += 0.55) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.15, 0.28), new THREE.MeshBasicMaterial({ color: 0xf2f2f2 }));
      bar.position.set(cx, -0.005, cz);
      stripGroup.add(bar);
    }
  }

  const tram = new THREE.Group();
  const tramBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.8, 0.62),
    new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 })
  );
  tramBody.position.y = 0.55;
  const tramRoof = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.14, 0.7), new THREE.MeshStandardMaterial({ color: 0xd62828 }));
  tramRoof.position.y = 1.0;
  const tramWin = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.34, 0.66), new THREE.MeshBasicMaterial({ color: 0x9ad0ff }));
  tramWin.position.y = 0.62;
  tram.add(tramBody, tramRoof, tramWin);
  tram.position.set(-14, 0.06, -0.7);
  stripGroup.add(tram);
  vehicles.push({ mesh: tram, speed: 0.03 });

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

  for (let i = 0; i < 5; i++) {
    const isLimo = i % 2 === 0;
    const car = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(isLimo ? 2.1 : 1.2, 0.45, 0.7),
      new THREE.MeshStandardMaterial({ color: isLimo ? 0xffffff : 0x00f5d4, roughness: 0.3 })
    );
    body.position.y = 0.3;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(isLimo ? 1.3 : 0.65, 0.35, 0.6), new THREE.MeshStandardMaterial({ color: 0x111122 }));
    cabin.position.y = 0.65;
    car.add(body, cabin);
    const dir = i % 2 === 0 ? 1 : -1;
    car.position.set((Math.random() - 0.5) * 26, 0.06, dir * 0.95);
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
