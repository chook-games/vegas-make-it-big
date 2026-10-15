import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { exteriorGroup, interiorGroup, walkers } from '../three/scene.js';
import { addXP } from './leveling.js';
import { XP } from '../data/levels.js';

const MAX_GUESTS = 40;

function groupFor(world) {
  return world === 'exterior' ? exteriorGroup : interiorGroup;
}

function makeMesh(isVip) {
  const g = new THREE.Group();
  const bodyColor = isVip ? 0xffd166 : (Math.random() < 0.5 ? 0x00bbf9 : 0xff9ebb);
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 0.46, 8),
    new THREE.MeshStandardMaterial({ color: bodyColor })
  );
  torso.position.y = 0.3;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffcba4 })
  );
  head.position.y = 0.66;
  g.add(torso, head);
  return g;
}

function pickAttraction(world) {
  const grid = world === 'exterior' ? state.exteriorGrid : state.interiorGrid;
  const cells = [];
  for (const k in grid) {
    const c = grid[k];
    if (c.item.isWall || c.item.isSecurity || c.item.isGenerator) continue;
    if (c.item.income > 0) cells.push(c);
  }
  if (!cells.length) return null;
  return cells[Math.floor(Math.random() * cells.length)];
}

function exitPoint(world, from) {
  const r = Math.floor(state.gridSize / 2) * state.tileSize;
  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: (Math.random() - 0.5) * r, z: r };
  if (side === 1) return { x: (Math.random() - 0.5) * r, z: -r };
  if (side === 2) return { x: r, z: (Math.random() - 0.5) * r };
  return { x: -r, z: (Math.random() - 0.5) * r };
}

function spawnGuest(world) {
  const isVip = Math.random() < 0.18;
  const mesh = makeMesh(isVip);
  const r = Math.floor(state.gridSize / 2) * state.tileSize;
  const spawnX = (Math.random() - 0.5) * r;
  const spawnZ = r + 1.5;
  mesh.position.set(spawnX, 0.08, spawnZ);
  groupFor(world).add(mesh);

  const guest = {
    mesh, world, isVip,
    stateId: 'arriving',
    target: null,
    attraction: null,
    speed: 0.9 + Math.random() * 0.7,
    timer: 0,
    playTick: 0,
    budget: isVip ? 3 + Math.random() * 3 : 1 + Math.random() * 2
  };
  chooseAttraction(guest);
  return guest;
}

function chooseAttraction(guest) {
  const cell = pickAttraction(guest.world);
  if (cell) {
    guest.attraction = cell;
    guest.target = { x: cell.tileMesh.position.x, z: cell.tileMesh.position.z };
    guest.stateId = 'arriving';
  } else {
    guest.target = exitPoint(guest.world);
    guest.stateId = 'leaving';
  }
}

function removeGuest(i) {
  const g = walkers[i];
  groupFor(g.world).remove(g.mesh);
  walkers.splice(i, 1);
}

export function updateGuests(dtMs, totals) {
  const desired = Math.max(3, Math.min(MAX_GUESTS, Math.round(totals.guests / 4)));
  const extDesired = Math.round(desired * 0.55);
  const intDesired = desired - extDesired;

  let extCount = walkers.filter(w => w.world === 'exterior').length;
  let intCount = walkers.filter(w => w.world === 'interior').length;

  while (extCount < extDesired && walkers.length < MAX_GUESTS) { walkers.push(spawnGuest('exterior')); extCount++; }
  while (intCount < intDesired && walkers.length < MAX_GUESTS) { walkers.push(spawnGuest('interior')); intCount++; }

  for (let i = walkers.length - 1; i >= 0; i--) {
    const w = walkers[i];
    const over = w.world === 'exterior' ? extCount > extDesired : intCount > intDesired;
    if (over) { removeGuest(i); if (w.world === 'exterior') extCount--; else intCount--; }
  }
}

function payTip(guest, dt) {
  const inc = guest.attraction ? guest.attraction.item.income * guest.attraction.level : 10;
  const vipMul = guest.isVip ? 2.5 : 1;
  const edge = state.houseEdge;
  const edgeMul = edge <= 15 ? 1 : Math.max(0.4, 1 - (edge - 15) * 0.06);
  const amount = Math.max(1, Math.round(inc * 0.04 * vipMul * edgeMul));
  state.cash += amount;
  state.stats.tipsEarned += amount;
  state.stats.guestsServed += 0.1;
  if (guest.isVip && Math.random() < 0.25) {
    Bus.emit(EV.FLOATING, { position: guest.mesh.position, text: `+$${amount}`, color: '#ffd166' });
  }
}

export function animateGuests(dtMs) {
  const dt = dtMs / 1000;
  const highEdge = state.houseEdge > 18;
  const blackout = state._blackout;

  for (let i = walkers.length - 1; i >= 0; i--) {
    const g = walkers[i];
    const t = g.target;
    const dx = t.x - g.mesh.position.x;
    const dz = t.z - g.mesh.position.z;
    const dist = Math.hypot(dx, dz);

    if (g.stateId !== 'playing') {
      if (dist > 0.12) {
        const step = Math.min(dist, g.speed * dt);
        g.mesh.position.x += (dx / dist) * step;
        g.mesh.position.z += (dz / dist) * step;
        g.mesh.position.y = 0.08 + Math.abs(Math.sin(performance.now() * 0.008 + i)) * 0.04;
      } else {
        if (g.stateId === 'arriving') {
          g.stateId = 'playing';
          g.timer = (3 + Math.random() * 5) * (highEdge ? 0.5 : 1) * (blackout ? 0.3 : 1);
          g.playTick = 0;
        } else if (g.stateId === 'leaving') {
          removeGuest(i);
          addXP(XP.guestServed);
          continue;
        }
      }
    } else {
      g.timer -= dt;
      g.playTick += dt;
      if (g.playTick >= 1.5) {
        g.playTick = 0;
        payTip(g, dt);
      }
      if (g.timer <= 0) {
        if (Math.random() < 0.25) {
          chooseAttraction(g);
        } else {
          g.stateId = 'leaving';
          g.target = exitPoint(g.world);
          g.attraction = null;
        }
      }
    }
  }
}

export function clearWalkers() {
  while (walkers.length) removeGuest(0);
}

export function guestCount() {
  return walkers.length;
}
