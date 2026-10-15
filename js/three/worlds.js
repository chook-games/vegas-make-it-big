import { state } from '../core/state.js';
import {
  exteriorGroup, interiorGroup, pickableTilesExt, pickableTilesInt, vehicles
} from './scene.js';

export function findTile(list, gx, gz) {
  return list.find(t => t.userData.gx === gx && t.userData.gz === gz);
}

export function createWorlds() {
  const { gridSize, tileSize } = state;
  const half = Math.floor(gridSize / 2);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(64, 64),
    new THREE.MeshStandardMaterial({ color: 0x120e24, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  exteriorGroup.add(ground);

  const road = new THREE.Mesh(
    new THREE.BoxGeometry(36, 0.12, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x1c1c28, roughness: 0.7 })
  );
  road.position.set(0, -0.02, half * tileSize + 3.4);
  exteriorGroup.add(road);

  for (let i = -14; i <= 14; i += 2.5) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.15), new THREE.MeshBasicMaterial({ color: 0xffd166 }));
    stripe.position.set(i, -0.01, road.position.z);
    exteriorGroup.add(stripe);
  }

  for (let gx = -half; gx <= half; gx++) {
    for (let gz = -half; gz <= half; gz++) {
      const checker = (gx + gz) % 2 === 0;
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(tileSize * 0.92, 0.16, tileSize * 0.92),
        new THREE.MeshStandardMaterial({ color: checker ? 0x231d3c : 0x1d1833, roughness: 0.8 })
      );
      tile.position.set(gx * tileSize, 0, gz * tileSize);
      tile.userData = { gx, gz, key: `${gx},${gz}`, world: 'exterior' };
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
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(17, 2.5, 0.4), wallMat);
  backWall.position.set(0, 1.25, -half * tileSize - 1.5);
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.5, 17), wallMat);
  leftWall.position.set(-half * tileSize - 1.5, 1.25, 0);
  interiorGroup.add(backWall, leftWall);

  for (let gx = -half; gx <= half; gx++) {
    for (let gz = -half; gz <= half; gz++) {
      const checker = (gx + gz) % 2 === 0;
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(tileSize * 0.92, 0.16, tileSize * 0.92),
        new THREE.MeshStandardMaterial({ color: checker ? 0x4a154b : 0x3b0d3c, roughness: 0.6 })
      );
      tile.position.set(gx * tileSize, 0, gz * tileSize);
      tile.userData = { gx, gz, key: `${gx},${gz}`, world: 'interior' };
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
    car.position.set((Math.random() - 0.5) * 26, 0.05, road.position.z + dir * 0.85);
    exteriorGroup.add(car);
    vehicles.push({ mesh: car, speed: (0.06 + Math.random() * 0.05) * dir });
  }
}
