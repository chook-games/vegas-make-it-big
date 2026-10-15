import { state } from '../core/state.js';
import {
  exteriorGroup, interiorGroup, pickableTilesExt, pickableTilesInt, vehicles
} from './scene.js';

const MAX_HALF = 6;

let stripGroup = null;
let interiorWalls = null;

export function findTile(list, gx, gz) {
  return list.find(t => t.userData.gx === gx && t.userData.gz === gz);
}

function makeTile(gx, gz, world, colorA, colorB) {
  const ts = state.tileSize;
  const checker = (gx + gz) % 2 === 0;
  const tile = new THREE.Mesh(
    new THREE.BoxGeometry(ts * 0.92, 0.16, ts * 0.92),
    new THREE.MeshStandardMaterial({ color: checker ? colorA : colorB, roughness: world === 'exterior' ? 0.8 : 0.6 })
  );
  tile.position.set(gx * ts, 0, gz * ts);
  tile.userData = { gx, gz, key: `${gx},${gz}`, world };
  return tile;
}

function addRing(radius, world) {
  const group = world === 'exterior' ? exteriorGroup : interiorGroup;
  const list = world === 'exterior' ? pickableTilesExt : pickableTilesInt;
  const cA = world === 'exterior' ? 0x231d3c : 0x4a154b;
  const cB = world === 'exterior' ? 0x1d1833 : 0x3b0d3c;
  for (let gx = -radius; gx <= radius; gx++) {
    for (let gz = -radius; gz <= radius; gz++) {
      if (Math.max(Math.abs(gx), Math.abs(gz)) !== radius) continue;
      const tile = makeTile(gx, gz, world, cA, cB);
      group.add(tile);
      list.push(tile);
    }
  }
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

export function createWorlds() {
  const half = Math.floor(state.gridSize / 2);
  const ts = state.tileSize;

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(64, 64),
    new THREE.MeshStandardMaterial({ color: 0x120e24, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  exteriorGroup.add(ground);

  stripGroup = new THREE.Group();
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.12, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x1c1c28, roughness: 0.7 })
  );
  road.position.y = -0.02;
  stripGroup.add(road);
  for (let i = -18; i <= 18; i += 2.5) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.15), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
    stripe.position.set(i, -0.01, 0);
    stripGroup.add(stripe);
  }
  exteriorGroup.add(stripGroup);
  updateStrip();

  for (let gx = -half; gx <= half; gx++) {
    for (let gz = -half; gz <= half; gz++) {
      const tile = makeTile(gx, gz, 'exterior', 0x231d3c, 0x1d1833);
      exteriorGroup.add(tile);
      pickableTilesExt.push(tile);
    }
  }

  const floorBase = new THREE.Mesh(
    new THREE.PlaneGeometry(52, 52),
    new THREE.MeshStandardMaterial({ color: 0x1a081f, roughness: 0.85 })
  );
  floorBase.rotation.x = -Math.PI / 2;
  floorBase.position.y = -0.1;
  interiorGroup.add(floorBase);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x3c096c, roughness: 0.5 });
  interiorWalls = {
    back: new THREE.Mesh(new THREE.BoxGeometry(0.4 + MAX_HALF * ts * 2, 2.5, 0.4), wallMat),
    left: new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.5, 0.4 + MAX_HALF * ts * 2), wallMat)
  };
  interiorWalls.back.position.y = 1.25;
  interiorWalls.left.position.y = 1.25;
  interiorGroup.add(interiorWalls.back, interiorWalls.left);
  updateInteriorWalls();

  for (let gx = -half; gx <= half; gx++) {
    for (let gz = -half; gz <= half; gz++) {
      const tile = makeTile(gx, gz, 'interior', 0x4a154b, 0x3b0d3c);
      interiorGroup.add(tile);
      pickableTilesInt.push(tile);
    }
  }

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
    car.position.set((Math.random() - 0.5) * 26, 0.05, dir * 0.85);
    car.userData.dir = dir;
    exteriorGroup.add(car);
    vehicles.push({ mesh: car, speed: (0.06 + Math.random() * 0.05) * dir });
  }
}

export function expandWorld() {
  const newHalf = Math.floor(state.gridSize / 2);
  addRing(newHalf, 'exterior');
  addRing(newHalf, 'interior');
  updateStrip();
  updateInteriorWalls();
}

export function worldRadius() {
  return Math.floor(state.gridSize / 2);
}
