import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { xpForLevel, levelReward, rankFor, MAX_LEVEL } from '../data/levels.js';
import { save } from '../core/save.js';

export function xpToNext() {
  return xpForLevel(state.level);
}

export function addXP(amount) {
  if (state.level >= MAX_LEVEL || amount <= 0) return;
  state.xp += amount;
  let leveled = false;
  while (state.level < MAX_LEVEL && state.xp >= xpForLevel(state.level)) {
    state.xp -= xpForLevel(state.level);
    state.level += 1;
    const reward = levelReward(state.level);
    state.cash += reward.cash;
    state.gold += reward.gold;
    leveled = true;
    Bus.emit('level:up', { level: state.level, reward });
  }
  if (state.level >= MAX_LEVEL) state.xp = 0;
  if (leveled) {
    Bus.emit(EV.UI_REFRESH);
    save();
  }
}

export function levelProgress() {
  const need = xpForLevel(state.level);
  return {
    level: state.level,
    xp: Math.floor(state.xp),
    need,
    pct: state.level >= MAX_LEVEL ? 100 : Math.min(100, (state.xp / need) * 100),
    rank: rankFor(state.level)
  };
}
