import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { exteriorGroup, interiorGroup, walkers } from '../three/scene.js';
import { addXP } from './leveling.js';
import { XP } from '../data/levels.js';
import { pickArchetype, CATEGORY } from './archetypes.js';
import { heatAt } from './noise.js';
import { activeLot } from './lots.js';

const MAX_GUESTS = 40;

function gridFor(world) {
  return world === 'exterior' ? state.exteriorGrid : state.interiorGrid;
}
function groupFor(world) {
  return world === 'exterior' ? exteriorGroup : interiorGroup;
}

function venueCells(world, category) {
  const grid = gridFor(world);
  const set = CATEGORY[category];
  if (!set) return [];
  const out = [];
  for (const k in grid) {
    const c = grid[k];
    if (c.item.isWall || c.item.isSecurity || c.item.isGenerator || c.item.isDecor) continue;
    if (set.has(c.item.id)) out.push(c);
  }
  return out;
}

function makeMesh(arch) {
  const g = new THREE.Group();
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 0.46, 8),
    new THREE.MeshStandardMaterial({ color: arch.color })
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

function exitPoint() {
  const r = Math.floor(state.gridSize / 2) * state.tileSize;
  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: (Math.random() - 0.5) * r, z: r };
  if (side === 1) return { x: (Math.random() - 0.5) * r, z: -r };
  if (side === 2) return { x: r, z: (Math.random() - 0.5) * r };
  return { x: -r, z: (Math.random() - 0.5) * r };
}

function securityStrength() {
  let s = 0;
  for (const k in state.interiorGrid) {
    if (state.interiorGrid[k].item.isSecurity) s += 0.25;
  }
  s += (state.staff.security || 0) * 0.06;
  return Math.min(0.9, s);
}

function spawnGuest(world) {
  const arch = pickArchetype(state);
  const mesh = makeMesh(arch);
  const r = Math.floor(state.gridSize / 2) * state.tileSize;
  mesh.position.set((Math.random() - 0.5) * r, 0.08, r + 1.5);
  groupFor(world).add(mesh);

  const guest = {
    mesh, world, arch,
    plan: arch.activities.slice(),
    planIndex: 0,
    stateId: 'idle',
    venue: null,
    target: exitPoint(),
    speed: 0.9 + Math.random() * 0.7,
    timer: 0,
    usingTick: 0
  };
  nextActivity(guest);
  return guest;
}

function nextActivity(guest) {
  while (guest.planIndex < guest.plan.length) {
    const category = guest.plan[guest.planIndex];
    const cells = venueCells(guest.world, category);
    if (cells.length) {
      const cell = cells[Math.floor(Math.random() * cells.length)];
      guest.venue = cell;
      guest.target = { x: cell.tileMesh.position.x, z: cell.tileMesh.position.z };
      guest.stateId = 'arriving';
      return;
    }
    guest.planIndex++;
  }
  guest.venue = null;
  guest.stateId = 'leaving';
  guest.target = exitPoint();
}

function spend(guest) {
  const lot = activeLot();
  const cell = guest.venue;
  if (!cell) return;
  const inc = cell.item.income * cell.level;
  const edge = state.houseEdge;
  const edgeMul = edge <= 15 ? 1 : Math.max(0.4, 1 - (edge - 15) * 0.05);
  let amount = Math.max(1, Math.round(inc * 0.04 * guest.arch.tipMul * edgeMul));

  if (guest.arch.noiseSensitive) {
    const h = heatAt(lot, guest.world, cell.gx, cell.gz);
    const pressure = Math.min(1, (h.noise + h.smell) * 0.8);
    amount = Math.round(amount * (1 - pressure * 0.7));
    if (pressure > 0.55 && Math.random() < 0.4) {
      guest.venue = null;
      guest.stateId = 'leaving';
      guest.target = exitPoint();
      Bus.emit(EV.TOAST, { text: '🎩 A High Roller left because of noise/smell!', kind: 'bad' });
      return;
    }
  }

  if (guest.arch.cheater) {
    if (Math.random() < 0.5) {
      if (Math.random() < securityStrength()) {
        state.cash += amount * 3;
        guest.cheatCaught = true;
        Bus.emit(EV.FLOATING, { position: guest.mesh.position, text: 'Cheater caught!', color: '#00f5d4' });
      } else {
        const loss = amount * 2;
        state.cash -= loss;
        state.reputation = Math.max(0, state.reputation - 0.05);
        Bus.emit(EV.FLOATING, { position: guest.mesh.position, text: `-$${loss}`, color: '#ff4d4d' });
      }
      return;
    }
  }

  if (amount <= 0) return;
  state.cash += amount;
  state.stats.tipsEarned += amount;
  state.stats.guestsServed += 0.1;
  if (guest.arch.noiseSensitive && Math.random() < 0.3) {
    Bus.emit(EV.FLOATING, { position: guest.mesh.position, text: `+$${amount}`, color: '#ffd166' });
  } else if (Math.random() < 0.06) {
    Bus.emit(EV.FLOATING, { position: guest.mesh.position, text: `+$${amount}`, color: '#06d6a0' });
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

export function animateGuests(dtMs) {
  const dt = dtMs / 1000;
  for (let i = walkers.length - 1; i >= 0; i--) {
    const g = walkers[i];
    const t = g.target;
    const dx = t.x - g.mesh.position.x;
    const dz = t.z - g.mesh.position.z;
    const dist = Math.hypot(dx, dz);

    if (g.stateId !== 'using') {
      if (dist > 0.12) {
        const step = Math.min(dist, g.speed * dt);
        g.mesh.position.x += (dx / dist) * step;
        g.mesh.position.z += (dz / dist) * step;
        g.mesh.position.y = 0.08 + Math.abs(Math.sin(performance.now() * 0.008 + i)) * 0.04;
      } else {
        if (g.stateId === 'arriving') {
          g.stateId = 'using';
          g.timer = 2.5 + Math.random() * 3;
          g.usingTick = 0;
        } else if (g.stateId === 'leaving') {
          removeGuest(i);
          addXP(XP.guestServed);
          continue;
        }
      }
    } else {
      g.timer -= dt;
      g.usingTick += dt;
      if (g.usingTick >= 1.3 && g.venue) {
        g.usingTick = 0;
        spend(g);
      }
      if (g.timer <= 0) {
        g.planIndex++;
        nextActivity(g);
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
