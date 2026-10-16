import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { openModal, closeModal } from './modals.js';
import { QUESTS } from '../data/quests.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { questProgress } from '../game/quests.js';
import { prestigeGoal, canPrestige, previewPoints, doPrestige } from '../game/prestige.js';
import { playSound } from '../audio/audio.js';
import { rankFor } from '../data/levels.js';
import { allItems } from '../data/buildings.js';
import { STAFF } from '../data/staff.js';
import { t } from '../i18n/i18n.js';

export function openQuestsScreen() {
  const rows = QUESTS.map((q, i) => {
    const done = i < state.questIndex;
    const current = i === state.questIndex;
    let progressHTML = '';
    if (current) {
      const p = questProgress(q);
      const pct = Math.min(100, Math.round((p.current / p.target) * 100));
      progressHTML = `<div class="list-progress"><i style="width:${pct}%"></i></div>
        <div class="list-reward">${p.current} / ${p.target}</div>`;
    } else if (!done) {
      progressHTML = `<div class="list-reward" style="color:#889;">Locked</div>`;
    }
    const rewardTxt = q.reward && q.reward.cash ? `Reward: $${q.reward.cash.toLocaleString()}` : '';
    return `<div class="list-row ${done ? 'done' : ''} ${!done && !current ? 'locked' : ''}">
      <div class="list-icon">${q.icon}</div>
      <div class="list-main">
        <div class="list-name">${t(q.title)}</div>
        <div class="list-desc">${t(q.desc)}</div>
        <div class="list-reward">${rewardTxt}</div>
        ${progressHTML}
      </div>
      <div class="list-check">${done ? '✅' : current ? '▶️' : '🔒'}</div>
    </div>`;
  }).join('');

  const doneCount = Math.min(state.questIndex, QUESTS.length);
  openModal({ title: `📜 Quests (${doneCount}/${QUESTS.length})`, bodyHTML: rows });
}

export function openAchievementsScreen() {
  const unlocked = ACHIEVEMENTS.filter(a => state.achievements[a.id]).length;
  const rows = ACHIEVEMENTS.map(a => {
    const done = !!state.achievements[a.id];
    return `<div class="list-row ${done ? 'done' : ''}">
      <div class="list-icon">${a.icon}</div>
      <div class="list-main">
        <div class="list-name">${t(a.title)}</div>
        <div class="list-desc">${t(a.desc)}</div>
        <div class="list-reward">Reward: $${a.reward.cash.toLocaleString()}</div>
      </div>
      <div class="list-check">${done ? '🏆' : '🔒'}</div>
    </div>`;
  }).join('');

  openModal({ title: `🏆 Achievements (${unlocked}/${ACHIEVEMENTS.length})`, bodyHTML: rows });
}

export function openPrestigeScreen() {
  const goal = prestigeGoal();
  const ready = canPrestige();
  const pts = previewPoints();
  const body = `
    <div class="big-stat">💎 Prestige ${state.prestigeLevel}</div>
    <div class="center muted">Permanent bonus: +${state.prestigeLevel * 15}% on all income & guests</div>
    <div class="spacer"></div>
    <div class="settings-row"><span class="settings-label">Prestige points</span><span>${state.prestigePoints}</span></div>
    <div class="settings-row"><span class="settings-label">Cash goal</span><span>$${goal.toLocaleString()}</span></div>
    <div class="settings-row"><span class="settings-label">Points if you prestige now</span><span>+${pts}</span></div>
    <div class="spacer"></div>
    <div class="muted">Prestige sells the resort: you start over with $5,000 but keep achievements, quests and permanent bonuses. Use it when you stall.</div>
  `;

  openModal({
    title: '💎 Prestige - Back to the Start',
    bodyHTML: state.gameMode === 'campaign'
      ? '<div class="center muted">Prestige is only available in Free Play.</div>'
      : body,
    actions: state.gameMode === 'campaign'
      ? [{ label: 'Close', cls: 'btn-ghost', onClick: closeModal }]
      : [
          { label: ready ? `Prestige now (+${pts} points)` : `Need $${goal.toLocaleString()}`, cls: 'btn-gold', onClick: () => {
            if (!ready) { playSound('error'); return; }
            doPrestige();
            closeModal();
          } },
          { label: 'Close', cls: 'btn-ghost', onClick: closeModal }
        ]
  });
}

export function openOfflineScreen(awayMs, earned) {
  const mins = Math.floor(awayMs / 60000);
  const timeTxt = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
  const body = `
    <div class="center big-stat">$${earned.toLocaleString()}</div>
    <div class="center muted">You were away ${timeTxt}. The resort ran at 50% rate (8h cap).</div>
  `;
  openModal({
    title: '💤 Offline Earnings',
    bodyHTML: body,
    actions: [{ label: 'Collect', cls: 'btn-green', onClick: closeModal }]
  });
}

const TUTORIAL_PREVIEW = [
  { icon: '🏨', text: 'Build Hotels to increase guest capacity.' },
  { icon: '🎰', text: 'Add tables and slots to earn money.' },
  { icon: '⭐', text: 'Keep Reputation high - it brings VIP guests.' },
  { icon: '🎲', text: 'Tune the House Edge: balance profit and guests.' },
  { icon: '💎', text: 'Prestige for permanent bonuses and new buildings.' }
];

export function openWelcomeScreen({ hasSave, onContinue, onNew, onCampaign }) {
  const preview = TUTORIAL_PREVIEW.map(tx => `<div class="list-row"><div class="list-icon">${tx.icon}</div><div class="list-main"><div class="list-name">${tx.text}</div></div></div>`).join('');
  openModal({
    title: 'Vegas: Make It Big',
    closable: false,
    bodyHTML: `
      <div class="center muted">Build the ultimate Casino Resort in the heart of Vegas.</div>
      <div class="spacer"></div>
      ${preview}
    `,
    actions: [
      hasSave ? { label: 'Continue', cls: 'btn-green', onClick: () => { closeModal(); onContinue && onContinue(); } } : null,
      { label: '🎯 Campaign', cls: 'btn-primary', onClick: () => { closeModal(); onCampaign && onCampaign(); } },
      { label: hasSave ? '🎮 Free Play' : '🎮 Start Free Play', cls: 'btn-ghost', onClick: () => { closeModal(); onNew && onNew(); } }
    ].filter(Boolean)
  });
}

export function openLevelUpScreen({ level, reward }) {
  const unlockedBuildings = allItems().filter(i => i.requires && i.requires.level === level);
  const unlockedStaff = STAFF.filter(s => s.requires && s.requires.level === level);
  let unlockHTML = '';
  if (unlockedBuildings.length) {
    unlockHTML += '<div class="spacer"></div><div class="muted">🔓 New buildings:</div>' +
      unlockedBuildings.map(i => `<div class="list-row"><div class="list-icon">${i.icon}</div><div class="list-main"><div class="list-name">${t(i.name)}</div></div></div>`).join('');
  }
  if (unlockedStaff.length) {
    unlockHTML += '<div class="spacer"></div><div class="muted">🔓 New staff:</div>' +
      unlockedStaff.map(s => `<div class="list-row"><div class="list-icon">${s.icon}</div><div class="list-main"><div class="list-name">${t(s.name)}</div></div></div>`).join('');
  }
  openModal({
    title: `🆙 Level ${level}!`,
    bodyHTML: `
      <div class="center big-stat">${rankFor(level)}</div>
      <div class="center muted">Reward: +$${reward.cash.toLocaleString()}${reward.gold ? ` · +${reward.gold} 💎` : ''}</div>
      ${unlockHTML}
    `,
    actions: [{ label: 'Great!', cls: 'btn-green', onClick: closeModal }]
  });
}

export function initScreens() {
  Bus.on('campaign:complete', ({ scenario, stars, reward, hasNext }) => {
    const rewardTxt = reward && reward.cash ? `+$${reward.cash.toLocaleString()}${reward.gold ? ` · +${reward.gold} 💎` : ''}` : '';
    openModal({
      title: '🎉 Scenario Complete!',
      bodyHTML: `
        <div class="center big-stat">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <div class="center">"${t(scenario.title)}" complete!</div>
        <div class="center muted">Reward: ${rewardTxt}</div>
        <div class="spacer"></div>
        <div class="center muted">${hasNext ? 'The next scenario is now unlocked.' : 'You finished the whole Campaign!'}</div>
      `,
      actions: [{ label: hasNext ? 'Next ▶' : 'Great!', cls: 'btn-green', onClick: closeModal }]
    });
  });
}
