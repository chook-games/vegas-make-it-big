import { state } from '../core/state.js';
import { BASE_POWER_CAP, BASE_GUESTS } from '../core/constants.js';
import { getTimeFactors, seasonInfo } from './daynight.js';
import { addXP } from './leveling.js';
import { XP } from '../data/levels.js';
import { staffEffects, totalWages } from './staff.js';
import { getLotHeat } from './lots.js';

function getNeighbors(grid, gx, gz) {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const res = [];
  for (const [dx, dz] of dirs) {
    const n = grid[`${gx + dx},${gz + dz}`];
    if (n) res.push(n);
  }
  return res;
}

export function evaluateTileStats(world, cell, grid, heat) {
  const item = cell.item;
  let inc = item.income * cell.level;
  const notes = [];
  const key = cell.key;

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

  return { income: Math.round(inc), notes };
}

function lotTotals(lot) {
  const heat = getLotHeat(lot);
  let powerUsed = 0;
  let powerCap = 0;
  let capacity = 0;
  let rawExt = 0;
  let rawInt = 0;
  let noise = 0;
  let smell = 0;
  let cells = 0;

  for (const k in lot.exteriorGrid) {
    const cell = lot.exteriorGrid[k];
    const item = cell.item;
    if (item.power > 0) powerCap += item.power * cell.level;
    else powerUsed += Math.abs(item.power);
    capacity += (item.guests || 0) * cell.level;
    rawExt += evaluateTileStats('exterior', cell, lot.exteriorGrid, heat.exterior).income;
  }
  for (const k in lot.interiorGrid) {
    const cell = lot.interiorGrid[k];
    const item = cell.item;
    if (item.power < 0) powerUsed += Math.abs(item.power);
    capacity += (item.guests || 0) * cell.level;
    rawInt += evaluateTileStats('interior', cell, lot.interiorGrid, heat.interior).income;
    noise += heat.interior.noise[k] || 0;
    smell += heat.interior.smell[k] || 0;
    cells++;
  }

  return { powerUsed, powerCap, capacity: Math.max(0, capacity), rawExt, rawInt,
    avgNoise: cells ? noise / cells : 0, avgSmell: cells ? smell / cells : 0 };
}

export function calculateTotals() {
  let powerUsed = 0;
  let powerCap = BASE_POWER_CAP;
  let capacity = BASE_GUESTS;
  let rawExt = 0;
  let rawInt = 0;
  let noiseSum = 0;
  let smellSum = 0;
  let lotCount = 0;

  for (const lot of state.lots) {
    const lt = lotTotals(lot);
    powerUsed += lt.powerUsed;
    powerCap += lt.powerCap;
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
  const edgeIncomeFactor = edge <= 15 ? 0.75 + (edge / 15) * 0.45 : Math.max(0.35, 1.2 - (edge - 15) * 0.06);
  const edgeGuestFactor = edge <= 15 ? 1 + (15 - edge) * 0.02 : Math.max(0.5, 1 - (edge - 15) * 0.05);

  const repFactor = 0.6 + (state.reputation / 100) * 0.9;
  const happyFactor = 0.7 + (state.happiness / 200) + state.lots.length * 0.03;
  const prestigeMul = 1 + state.prestigeLevel * 0.15;

  const hasBlackout = powerUsed > powerCap;
  const powerPenalty = hasBlackout ? 0.4 : 1.0;

  const time = getTimeFactors();
  const season = seasonInfo();
  const event = state.event;
  let eventIncome = event ? (event.effects.incomeMul || 1) : 1;
  const eventGuest = event ? (event.effects.guestMul || 1) : 1;

  const eff = staffEffects();
  const staffIncomeMul = 1 + eff.incomePct;
  if (event && event.id === 'ev_hackers') eventIncome = eventIncome + (1 - eventIncome) * eff.crime;

  const nuisancePenalty = 1 - Math.min(0.25, (avgNoise * 0.15 + avgSmell * 0.12));

  const grossIncome = Math.round(
    (rawExt * time.dayFactor + rawInt * time.nightFactor) *
    edgeIncomeFactor * repFactor * happyFactor * nuisancePenalty *
    season.incomeMul * eventIncome * powerPenalty * prestigeMul * staffIncomeMul
  );

  const wages = totalWages();
  const totalIncome = grossIncome - wages;

  const demandFactor = repFactor * edgeGuestFactor * season.guestMul * time.dayFactor * eventGuest * prestigeMul * (1 + eff.guestPct);
  let guests = Math.round(capacity * Math.min(demandFactor, 3.0));
  if (hasBlackout) guests = Math.round(guests * 0.6);
  guests = Math.max(0, guests);

  const fill = capacity > 0 ? guests / capacity : 0;

  return {
    powerUsed, powerCap, capacity, guests, fill,
    rawExt, rawInt, totalIncome, grossIncome, wages, hasBlackout,
    edgeIncomeFactor, edgeGuestFactor, repFactor, happyFactor,
    prestigeMul, eventIncome, eventGuest, staffEff: eff,
    avgNoise, avgSmell, nuisancePenalty
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
