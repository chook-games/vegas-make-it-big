import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { QUESTS } from '../data/quests.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { playSound } from '../audio/audio.js';
import { save } from '../core/save.js';
import { addXP } from './leveling.js';
import { XP } from '../data/levels.js';
import { inCampaign } from './campaign.js';

function grantReward(reward, xpAmount) {
  if (reward && !inCampaign()) {
    if (reward.cash) state.cash += reward.cash;
    if (reward.rep) state.reputation = Math.min(100, state.reputation + reward.rep);
  }
  if (xpAmount) addXP(xpAmount);
}

export function activeQuest() {
  return QUESTS[state.questIndex] || null;
}

export function checkQuests() {
  let advanced = false;
  while (state.questIndex < QUESTS.length) {
    const q = QUESTS[state.questIndex];
    if (!q.goal(state)) break;
    grantReward(q.reward, XP.quest);
    state.questIndex++;
    advanced = true;
    playSound('quest');
    const rewardTxt = q.reward && q.reward.cash ? ` +$${q.reward.cash}` : '';
    Bus.emit(EV.TOAST, { text: `📜 Quest complete: ${q.title}!${rewardTxt}`, kind: 'good' });
    Bus.emit('quest:completed', q);
  }
  if (advanced) {
    Bus.emit(EV.QUEST_PROGRESS);
    Bus.emit(EV.UI_REFRESH);
    save();
  }
}

export function checkAchievements() {
  let unlocked = 0;
  for (const a of ACHIEVEMENTS) {
    if (state.achievements[a.id]) continue;
    if (a.check(state)) {
      state.achievements[a.id] = true;
      grantReward(a.reward, XP.achievement);
      unlocked++;
      playSound('achievement');
      const rewardTxt = a.reward && a.reward.cash ? ` +$${a.reward.cash}` : '';
      Bus.emit(EV.TOAST, { text: `🏆 Achievement: ${a.title}!${rewardTxt}`, kind: 'good' });
    }
  }
  if (unlocked) {
    Bus.emit(EV.UI_REFRESH);
    save();
  }
}

export function unlockedCount() {
  return ACHIEVEMENTS.filter(a => state.achievements[a.id]).length;
}

export function checkProgress() {
  if (inCampaign()) return;
  checkQuests();
  checkAchievements();
}

export function questProgress(q) {
  try { return q.progress(state); } catch (e) { return { current: 0, target: 1 }; }
}
