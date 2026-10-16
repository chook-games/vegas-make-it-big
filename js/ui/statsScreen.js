import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { calculateTotals } from '../game/economy.js';
import { levelProgress } from '../game/leveling.js';
import { playerRank, playerBuildings, playerValue } from '../game/npc.js';
import { campaignProgress, inCampaign } from '../game/campaign.js';
import { totalStaff, countOf } from '../game/staff.js';
import { isGambling } from '../data/betting.js';
import { DAY_LENGTH_MS, TICK_MS } from '../core/constants.js';

function row(label, value, color) {
  return `<div class="settings-row"><span class="settings-label">${label}</span><span style="color:${color || '#fff'}">${value}</span></div>`;
}

function gamblingStations() {
  let n = 0;
  for (const lot of state.lots) {
    for (const k in lot.interiorGrid) if (isGambling('interior', lot.interiorGrid[k].item.id)) n++;
    for (const k in lot.exteriorGrid) if (isGambling('exterior', lot.exteriorGrid[k].item.id)) n++;
    const up = lot.interiorUpperGrid || {};
    for (const k in up) if (isGambling('interior', up[k].item.id)) n++;
  }
  return n;
}

export function openStatsScreen() {
  const totals = calculateTotals();
  const lp = levelProgress();
  const rank = playerRank();
  const prog = campaignProgress();
  const perDay = Math.round((totals.totalIncome / TICK_MS) * DAY_LENGTH_MS);
  const stations = gamblingStations();

  let ext = 0, int = 0, upper = 0;
  for (const lot of state.lots) {
    ext += Object.keys(lot.exteriorGrid).length;
    int += Object.keys(lot.interiorGrid).length;
    upper += Object.keys(lot.interiorUpperGrid || {}).length;
  }

  const body = `
    ${row('💰 Cash', `$${Math.floor(state.cash).toLocaleString()}`, '#ffd166')}
    ${row('📈 Income / cycle', `$${totals.totalIncome.toLocaleString()}`, totals.totalIncome >= 0 ? '#06d6a0' : '#ff4d4d')}
    ${row('🗓️ Est. income / day', `$${perDay.toLocaleString()}`)}
    ${row('🏦 Total earned', `$${Math.floor(state.stats.totalEarned || 0).toLocaleString()}`)}
    <div class="spacer"></div>
    ${row('🆙 Level', `Lv.${lp.level} · ${lp.rank}`, '#00f5d4')}
    ${row('⭐ Reputation', Math.round(state.reputation))}
    ${row('😊 Happiness', Math.round(state.happiness) + '%')}
    ${row('🛠️ Condition', Math.round(state.condition) + '%')}
    ${row('👥 Guests', `${totals.guests} / ${totals.capacity}`)}
    <div class="spacer"></div>
    ${row('⚡ Power', `${totals.powerUsed}/${totals.powerCap} kW`, totals.powerShort ? '#ff4d4d' : '#00f5d4')}
    ${row('💧 Water', `${totals.waterUsed}/${totals.waterCap}`, totals.waterShort ? '#ff4d4d' : '#4da6ff')}
    ${row('🏗️ Buildings', `Ext ${ext} · Int ${int} · Upper ${upper}`)}
    ${row('🏙️ Lots', state.lots.length)}
    ${row('👔 Staff', `${totalStaff()} · Croupiers ${countOf('dealer')}/${stations}`)}
    ${row('💎 Prestige', `Lv.${state.prestigeLevel} · ${state.prestigePoints} pts`)}
    <div class="spacer"></div>
    ${row('🏁 Rivals rank', `#${rank.rank} / ${rank.total}`, rank.rank === 1 ? '#06d6a0' : '#ff9ebb')}
    ${row('🏗️ Resort value', `$${playerValue().toLocaleString()}`)}
    ${inCampaign() ? row('🎯 Campaign', `${prog.index}/${prog.total} · ⭐ ${prog.stars}/${prog.maxStars}`) : ''}
  `;

  openModal({
    title: '📊 Statistics',
    bodyHTML: body,
    actions: [{ label: 'Close', cls: 'btn-ghost', onClick: closeModal }]
  });
}
