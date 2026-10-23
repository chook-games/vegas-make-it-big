import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { exteriorGroup, interiorGroup, walkers } from '../three/scene.js';
import { addXP } from './leveling.js';
import { XP } from '../data/levels.js';
import { pickArchetype, CATEGORY } from './archetypes.js';
import { heatAt } from './noise.js';
import { activeLot } from './lots.js';
import { getPaths, entranceKey, bfsPath, keyAt, nearestWalkable } from './paths.js';
import { iconTexture, CATEGORY_ICON } from '../three/icons.js';

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
  const lot = activeLot();
  const open = world === 'exterior' ? getPaths(lot, 'exterior').open : null;
  const out = [];
  for (const k in grid) {
    const c = grid[k];
    if (c.item.isWall || c.item.isSecurity || c.item.isGenerator || c.item.isDecor || c.item.isPath) continue;
    if (open && !open.has(k)) continue;
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

  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTexture('🎰'), transparent: true, depthTest: false }));
  sprite.scale.set(0.5, 0.5, 0.5);
  sprite.position.y = 1.05;
  sprite.visible = false;
  g.add(sprite);
  g.userData.sprite = sprite;
  return g;
}

function setGuestIcon(guest, icon) {
  const sprite = guest.mesh.userData.sprite;
  if (!sprite) return;
  const tex = iconTexture(icon);
  if (sprite.material) sprite.material.map = tex;
  sprite.visible = needsVisible;
}

let needsVisible = true;

export function setNeedsVisible(v) {
  needsVisible = !!v;
  for (const g of walkers) {
    const s = g.mesh.userData.sprite;
    if (s) s.visible = needsVisible;
  }
}

function spawnPos(world) {
  const lot = activeLot();
  const r = Math.floor(state.gridSize / 2) * state.tileSize;
  if (world === 'exterior') {
    const p = getPaths(lot, 'exterior');
    const candidates = [];
    for (const k of p.connected) {
      const pos = p.walkable.get(k);
      if (pos) candidates.push(pos);
    }
    if (!candidates.length) return null;
    const pos = candidates[Math.floor(Math.random() * candidates.length)];
    return { x: pos.x, z: pos.z };
  }
  return { x: (Math.random() - 0.5) * r, z: r + 1.5 };
}

function spawnGuest(world) {
  const pos = spawnPos(world);
  if (!pos) return null;
  const arch = pickArchetype(state);
  const mesh = makeMesh(arch);
  mesh.position.set(pos.x, 0.08, pos.z);
  groupFor(world).add(mesh);

  const guest = {
    mesh, world, arch,
    plan: arch.activities.slice(),
    planIndex: 0,
    stateId: 'idle',
    venue: null,
    path: null,
    pi: 0,
    target: { x: pos.x, z: pos.z },
    speed: 1.1 + Math.random() * 0.7,
    timer: 0,
    usingTick: 0
  };
  nextActivity(guest);
  return guest;
}

function nextActivity(guest) {
  const lot = activeLot();
  while (guest.planIndex < guest.plan.length) {
    const category = guest.plan[guest.planIndex];
    const cells = venueCells(guest.world, category);
    if (cells.length) {
      const cell = cells[Math.floor(Math.random() * cells.length)];
      guest.venue = cell;
      setGuestIcon(guest, CATEGORY_ICON[category] || '🎲');
      if (guest.world === 'exterior') {
        const ek = entranceKey(cell);
        const startKey = keyAt(guest.mesh.position.x, guest.mesh.position.z);
        const wp = bfsPath(lot, 'exterior', startKey, ek);
        if (wp.length) {
          guest.path = wp;
          guest.pi = 0;
          guest.target = wp[wp.length - 1];
          guest.stateId = 'arriving';
          return;
        }
      } else {
        const ts = state.tileSize;
        const cxp = (cell.cx != null ? cell.cx : cell.gx) * ts;
        const czp = (cell.cz != null ? cell.cz : cell.gz) * ts;
        guest.path = [{ x: cxp, z: czp }];
        guest.pi = 0;
        guest.target = guest.path[0];
        guest.stateId = 'arriving';
        return;
      }
    }
    guest.planIndex++;
  }
  leave(guest);
}

function leave(guest) {
  const lot = activeLot();
  guest.venue = null;
  setGuestIcon(guest, CATEGORY_ICON.leaving);
  if (guest.world === 'exterior') {
    const p = getPaths(lot, 'exterior');
    let front = null, fz = -Infinity;
    for (const k of p.connected) {
      const pos = p.walkable.get(k);
      const c = lot.exteriorGrid[k];
      if (c && c.gz > fz) { fz = c.gz; front = pos; }
    }
    const startKey = keyAt(guest.mesh.position.x, guest.mesh.position.z);
    const targetKey = front ? keyAt(front.x, front.z) : startKey;
    const wp = bfsPath(lot, 'exterior', startKey, targetKey);
    guest.path = wp.length ? wp : [{ x: guest.mesh.position.x, z: guest.mesh.position.z }];
    guest.pi = 0;
    guest.target = guest.path[guest.path.length - 1];
    guest.stateId = 'leaving';
    return;
  }
  guest.stateId = 'leaving';
  guest.target = { x: guest.mesh.position.x, z: guest.mesh.position.z + 2 };
  guest.path = [guest.target];
  guest.pi = 0;
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
      leave(guest);
      Bus.emit(EV.TOAST, { text: '🎩 A High Roller left because of noise/smell!', kind: 'bad' });
      return;
    }
  }

  if (guest.arch.cheater) {
    if (Math.random() < 0.5) {
      if (Math.random() < securityStrength()) {
        state.cash += amount * 3;
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

function securityStrength() {
  let s = 0;
  for (const k in state.interiorGrid) {
    if (state.interiorGrid[k].item.isSecurity) s += 0.25;
  }
  s += (state.staff.security || 0) * 0.06;
  return Math.min(0.9, s);
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

  while (extCount < extDesired && walkers.length < MAX_GUESTS) {
    const g = spawnGuest('exterior');
    if (!g) break;
    walkers.push(g);
    extCount++;
  }
  while (intCount < intDesired && walkers.length < MAX_GUESTS) {
    const g = spawnGuest('interior');
    if (!g) break;
    walkers.push(g);
    intCount++;
  }

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
    if (!g.path || g.pi >= g.path.length) {
      if (g.stateId === 'arriving') {
        g.stateId = 'using';
        g.timer = 2.5 + Math.random() * 3;
        g.usingTick = 0;
        continue;
      }
      if (g.stateId === 'leaving') {
        removeGuest(i);
        addXP(XP.guestServed);
        continue;
      }
      continue;
    }

    const wp = g.path[g.pi];
    const dx = wp.x - g.mesh.position.x;
    const dz = wp.z - g.mesh.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 0.12) {
      const step = Math.min(dist, g.speed * dt);
      g.mesh.position.x += (dx / dist) * step;
      g.mesh.position.z += (dz / dist) * step;
      g.mesh.position.y = 0.08 + Math.abs(Math.sin(performance.now() * 0.008 + i)) * 0.04;
    } else {
      g.pi++;
    }

    if (g.stateId === 'using') {
      g.timer -= dt;
      g.usingTick += dt;
      if (g.usingTick >= 1.3 && g.venue) { g.usingTick = 0; spend(g); }
      if (g.timer <= 0) { g.planIndex++; nextActivity(g); }
    }
  }
}

export function clearWalkers() {
  while (walkers.length) removeGuest(0);
}

export function guestCount() {
  return walkers.length;
}
