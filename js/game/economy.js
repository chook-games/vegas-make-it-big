import { state } from '../core/state.js';
import { BASE_GUESTS, BASE_POWER, BASE_WATER } from '../core/constants.js';
import { getTimeFactors, seasonInfo } from './daynight.js';
import { addXP } from './leveling.js';
import { XP } from '../data/levels.js';
import { utilOf } from '../data/utilities.js';
import { stationIncomeFactor, isGambling } from '../data/betting.js';
import { staffEffects, totalWages } from './staff.js';
import { getLotHeat } from './lots.js';
import { getPaths } from './paths.js';
import { competitionFactor } from './npc.js';

function getNeighbors(grid, gx, gz) {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const res = [];
  for (const [dx, dz] of dirs) {
    const n = grid[`${gx + dx},${gz + dz}`];
    if (n) res.push(n);
  }
  return res;
}

export function evaluateTileStats(world, cell, grid, heat, openSet, staffing) {
  const item = cell.item;
  let inc = item.income * cell.level;
  const notes = [];
  const key = cell.key;

  if (!item.isPath && openSet && !openSet.has(key) && item.income > 0) {
    return { income: 0, notes: ['Closed: entrance not connected to a path.'] };
  }

  if (world === 'interior') {
    const neighbors = getNeighbors(grid, cell.gx, cell.gz);
    const wall = neighbors.some(n => n.item.isWall);
    const security = neighbors.some(n => n.item.isSecurity);

    const hNoise = heat && heat.noise ? (heat.noise[key] || 0) : 0;
    const hSmell = heat && heat.smell ? (heat.smell[key] || 0) : 0;

    if (item.isVip) {
      let pressure = Math.min(1, hNoise * 0.7 + hSmell * 0.6);
      if (wall) pressure *= 0.5;
      inc *= (1 - pressure * 0.6);
      if (pressure > 0.4) notes.push('Noise/Smell annoy the VIPs (-income). Build a wall or add plants.');
      else if (wall) notes.push('Soundproof wall: VIP protected.');
    } else if (inc > 0) {
      const nuisance = Math.min(0.5, (hNoise + hSmell) * 0.35);
      inc *= (1 - nuisance);
      if (nuisance > 0.2) notes.push('Annoying noise/smell (-income).');
    }

    if (security && inc > 0) {
      inc *= 1.35;
      notes.push('Security coverage (+35% income).');
    }
  } else {
    if (item.isGenerator) notes.push('Produces power for the lot.');
    if (item.id === 'fountain') {
      const neigh = getNeighbors(grid, cell.gx, cell.gz);
      if (neigh.length >= 2) {
        inc *= 1.2;
        notes.push('Busy spot (+20%).');
      }
    }
  }

  if (isGambling(world, cell.item.id)) {
    inc *= stationIncomeFactor(world, cell);
    if (staffing != null && staffing < 0.999) {
      inc *= staffing;
      if (staffing < 0.6) notes.push('Not enough croupiers - stations run slow.');
    }
  }
  return { income: Math.round(inc), notes };
}

function lotTotals(lot, staffing) {
  const heat = getLotHeat(lot);
  const openExt = getPaths(lot, 'exterior').open;
  const openInt = null;
  let powerDemand = 0;
  let powerGen = BASE_POWER;
  let waterDemand = 0;
  let waterGen = BASE_WATER;
  let capacity = 0;
  let rawExt = 0;
  let rawInt = 0;
  let noise = 0;
  let smell = 0;
  let cells = 0;

  for (const k in lot.exteriorGrid) {
    const cell = lot.exteriorGrid[k];
    const item = cell.item;
    const u = utilOf(item.id);
    powerGen += (u.gp || 0) * cell.level;
    powerDemand += (u.p || 0) * cell.level;
    waterGen += (u.gw || 0) * cell.level;
    waterDemand += (u.w || 0) * cell.level;
    capacity += (item.guests || 0) * cell.level;
    rawExt += evaluateTileStats('exterior', cell, lot.exteriorGrid, heat.exterior, openExt, staffing).income;
  }
  for (const k in lot.interiorGrid) {
    const cell = lot.interiorGrid[k];
    const item = cell.item;
    const u = utilOf(item.id);
    powerGen += (u.gp || 0) * cell.level;
    powerDemand += (u.p || 0) * cell.level;
    waterGen += (u.gw || 0) * cell.level;
    waterDemand += (u.w || 0) * cell.level;
    capacity += (item.guests || 0) * cell.level;
    rawInt += evaluateTileStats('interior', cell, lot.interiorGrid, heat.interior, openInt, staffing).income;
    noise += heat.interior.noise[k] || 0;
    smell += heat.interior.smell[k] || 0;
    cells++;
  }

  return { powerDemand, powerGen, waterDemand, waterGen, capacity: Math.max(0, capacity), rawExt, rawInt,
    avgNoise: cells ? noise / cells : 0, avgSmell: cells ? smell / cells : 0 };
}

export function calculateTotals() {
  let powerDemand = 0;
  let powerGen = 0;
  let waterDemand = 0;
  let waterGen = 0;
  let capacity = BASE_GUESTS;
  let rawExt = 0;
  let rawInt = 0;
  let noiseSum = 0;
  let smellSum = 0;
  let lotCount = 0;

  let stations = 0;
  for (const lot of state.lots) {
    for (const k in lot.interiorGrid) if (isGambling('interior', lot.interiorGrid[k].item.id)) stations++;
    for (const k in lot.exteriorGrid) if (isGambling('exterior', lot.exteriorGrid[k].item.id)) stations++;
  }
  const croupiers = (state.staff && state.staff.dealer) || 0;
  const staffed = Math.min(croupiers, stations);
  const staffing = stations > 0 ? (staffed + (stations - staffed) * 0.4) / stations : 1;

  for (const lot of state.lots) {
    const lt = lotTotals(lot, staffing);
    powerDemand += lt.powerDemand;
    powerGen += lt.powerGen;
    waterDemand += lt.waterDemand;
    waterGen += lt.waterGen;
    capacity += lt.capacity;
    rawExt += lt.rawExt;
    rawInt += lt.rawInt;
    noiseSum += lt.avgNoise;
    smellSum += lt.avgSmell;
    lotCount++;
  }

  const avgNoise = lotCount ? noiseSum / lotCount : 0;
  const avgSmell = lotCount ? smellSum / lotCount : 0;

  const edge = state.houseEdge;
  const edgeGuestFactor = edge <= 15 ? 1 + (15 - edge) * 0.02 : Math.max(0.5, 1 - (edge - 15) * 0.05);

  const repFactor = 0.6 + (state.reputation / 100) * 0.9;
  const happyFactor = 0.7 + (state.happiness / 200) + state.lots.length * 0.03;
  const prestigeMul = 1 + state.prestigeLevel * 0.15;

  const powerShort = powerDemand > powerGen;
  const waterShort = waterDemand > waterGen;
  const hasBlackout = powerShort || waterShort;
  const powerPenalty = hasBlackout ? 0.25 : 1.0;

  const time = getTimeFactors();
  const season = seasonInfo();
  const event = state.event;
  let eventIncome = event ? (event.effects.incomeMul || 1) : 1;
  const eventGuest = event ? (event.effects.guestMul || 1) : 1;

  const eff = staffEffects();
  const staffIncomeMul = 1 + eff.incomePct;
  if (event && event.id === 'ev_hackers') eventIncome = eventIncome + (1 - eventIncome) * eff.crime;

  const nuisancePenalty = 1 - Math.min(0.25, (avgNoise * 0.15 + avgSmell * 0.12));
  const condFactor = 0.6 + 0.4 * (Math.max(0, Math.min(100, state.condition)) / 100);

  const grossIncome = Math.round(
    (rawExt * time.dayFactor + rawInt * time.nightFactor) *
    repFactor * happyFactor * nuisancePenalty * condFactor *
    season.incomeMul * eventIncome * powerPenalty * prestigeMul * staffIncomeMul
  );

  const wages = totalWages();
  const totalIncome = grossIncome - wages;

  const demandFactor = repFactor * edgeGuestFactor * season.guestMul * time.dayFactor * eventGuest * prestigeMul * (1 + eff.guestPct) * competitionFactor();
  let guests = Math.round(capacity * Math.min(demandFactor, 3.0));
  if (hasBlackout) guests = Math.round(guests * 0.35);
  if (state.maxPopulation > 0) guests = Math.min(guests, state.maxPopulation);
  guests = Math.max(0, guests);

  const fill = capacity > 0 ? guests / capacity : 0;

  return {
    powerUsed: powerDemand, powerCap: powerGen,
    waterUsed: waterDemand, waterCap: waterGen,
    powerShort, waterShort,
    capacity, guests, fill,
    rawExt, rawInt, totalIncome, grossIncome, wages, hasBlackout,
    edgeGuestFactor, repFactor, happyFactor,
    prestigeMul, eventIncome, eventGuest, staffEff: eff,
    avgNoise, avgSmell, nuisancePenalty, condFactor,
    staffing, stations, croupiers
  };
}

export function calculateLotTotals(lot) {
  return lotTotals(lot);
}

export function updateHappinessAndReputation(totals) {
  let target = 55 + totals.edgeGuestFactor * 30 + (totals.staffEff ? totals.staffEff.happiness : 0);
  target -= (totals.avgNoise * 20 + totals.avgSmell * 18);
  if (totals.hasBlackout) target = 28;
  const overcrowded = totals.fill > 1.15;
  if (overcrowded) target -= 25;
  target = Math.max(0, Math.min(100, target));

  state.happiness += (target - state.happiness) * 0.08;
  state.happiness = Math.max(0, Math.min(100, state.happiness));

  let repDelta = 0;
  if (state.happiness > 62) repDelta = 0.08 + (state.happiness - 62) * 0.004;
  else if (state.happiness < 40) repDelta = -0.06;
  if (overcrowded) repDelta -= 0.05;
  state.reputation = Math.max(0, Math.min(100, state.reputation + repDelta));
}

export function doIncomeTick() {
  const totals = calculateTotals();
  state.cash += totals.totalIncome;
  state.stats.totalEarned += Math.max(0, totals.totalIncome);
  updateHappinessAndReputation(totals);

  let buildings = 0;
  for (const lot of state.lots) {
    buildings += Object.keys(lot.exteriorGrid).length + Object.keys(lot.interiorGrid).length;
  }
  const decay = buildings * 0.06;
  const repair = totals.staffEff ? totals.staffEff.repair : 0;
  state.condition = Math.max(0, Math.min(100, state.condition + (repair - decay) * 0.12));

  if (totals.totalIncome > 0) addXP(Math.max(0.5, totals.totalIncome * XP.income));
  return totals;
}

export function upgradeCost(cell) {
  return Math.round(cell.item.cost * 0.8 * cell.level);
}

export function sellRefund(cell) {
  return Math.round(cell.item.cost * 0.5 * cell.level);
}

export function describeTotals() {
  return calculateTotals();
}
