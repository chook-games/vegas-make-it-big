import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { openModal, closeModal } from './modals.js';
import { QUESTS } from '../data/quests.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { questProgress } from '../game/quests.js';
import { prestigeGoal, canPrestige, previewPoints, doPrestige } from '../game/prestige.js';
import { playSound, refreshMusic } from '../audio/audio.js';

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
      progressHTML = `<div class="list-reward" style="color:#889;">Κλειδωμένο</div>`;
    }
    const rewardTxt = q.reward && q.reward.cash ? `Ανταμοιβή: $${q.reward.cash}` : '';
    return `<div class="list-row ${done ? 'done' : ''} ${!done && !current ? 'locked' : ''}">
      <div class="list-icon">${q.icon}</div>
      <div class="list-main">
        <div class="list-name">${q.title}</div>
        <div class="list-desc">${q.desc}</div>
        <div class="list-reward">${rewardTxt}</div>
        ${progressHTML}
      </div>
      <div class="list-check">${done ? '✅' : current ? '▶️' : '🔒'}</div>
    </div>`;
  }).join('');

  const doneCount = Math.min(state.questIndex, QUESTS.length);
  openModal({
    title: `📜 Αποστολές (${doneCount}/${QUESTS.length})`,
    bodyHTML: rows
  });
}

export function openAchievementsScreen() {
  const unlocked = ACHIEVEMENTS.filter(a => state.achievements[a.id]).length;
  const rows = ACHIEVEMENTS.map(a => {
    const done = !!state.achievements[a.id];
    return `<div class="list-row ${done ? 'done' : ''}">
      <div class="list-icon">${a.icon}</div>
      <div class="list-main">
        <div class="list-name">${a.title}</div>
        <div class="list-desc">${a.desc}</div>
        <div class="list-reward">Ανταμοιβή: $${a.reward.cash}</div>
      </div>
      <div class="list-check">${done ? '🏆' : '🔒'}</div>
    </div>`;
  }).join('');

  openModal({
    title: `🏆 Επιτεύγματα (${unlocked}/${ACHIEVEMENTS.length})`,
    bodyHTML: rows
  });
}

export function openPrestigeScreen() {
  const goal = prestigeGoal();
  const ready = canPrestige();
  const pts = previewPoints();
  const body = `
    <div class="big-stat">💎 Prestige ${state.prestigeLevel}</div>
    <div class="center muted">Μόνιμο bonus: +${state.prestigeLevel * 15}% σε όλα τα έσοδα & επισκέπτες</div>
    <div class="spacer"></div>
    <div class="settings-row"><span class="settings-label">Πόντοι Prestige</span><span>${state.prestigePoints}</span></div>
    <div class="settings-row"><span class="settings-label">Στόχος Ταμείου</span><span>$${goal.toLocaleString()}</span></div>
    <div class="settings-row"><span class="settings-label">Πόντοι αν κάνεις τώρα</span><span>+${pts}</span></div>
    <div class="spacer"></div>
    <div class="muted">Το Prestige πουλάει το Resort: ξεκινάς από την αρχή με $${(5000).toLocaleString()} αλλά κρατάς τα επιτεύγματα, τις αποστολές και τα μόνιμα bonuses. Χρησιμοποίησέ το όταν κολλήσεις.</div>
  `;

  openModal({
    title: '💎 Prestige - Ξανά από την Αρχή',
    bodyHTML: body,
    actions: [
      { label: ready ? `Prestige τώρα (+${pts} πόντοι)` : `Χρειάζεσαι $${goal.toLocaleString()}`, cls: 'btn-gold', onClick: () => {
        if (!ready) { playSound('error'); return; }
        doPrestige();
        closeModal();
      } },
      { label: 'Κλείσιμο', cls: 'btn-ghost', onClick: closeModal }
    ]
  });
}

export function openOfflineScreen(awayMs, earned) {
  const mins = Math.floor(awayMs / 60000);
  const timeTxt = mins >= 60 ? `${Math.floor(mins / 60)}ω ${mins % 60}λ` : `${mins}λ`;
  const body = `
    <div class="center big-stat">$${earned.toLocaleString()}</div>
    <div class="center muted">Έλειπες ${timeTxt}. Το Resort δούλευε με ${50}% απόδοση (όριο 8 ώρες).</div>
  `;
  openModal({
    title: '💤 Κέρδη εν απουσία',
    bodyHTML: body,
    actions: [{ label: 'Μάζεψε', cls: 'btn-green', onClick: closeModal }]
  });
}

const TUTORIAL_PREVIEW = [
  { icon: '🏨', text: 'Χτίσε Ξενοδοχεία για να αυξήσεις τους επισκέπτες.' },
  { icon: '🎰', text: 'Βάλε τραπέζια και κουλοχέρηδες για κέρδος.' },
  { icon: '⭐', text: 'Κράτα τη Φήμη ψηλά — φέρνει VIP πελάτες.' },
  { icon: '🎲', text: 'Ρύθμισε το House Edge: ισορροπία κέρδους και πελατών.' },
  { icon: '💎', text: 'Κάνε Prestige για μόνιμα bonuses και νέα κτίρια.' }
];

export function openWelcomeScreen({ hasSave, onContinue, onNew }) {
  const preview = TUTORIAL_PREVIEW.map(t => `<div class="list-row"><div class="list-icon">${t.icon}</div><div class="list-main"><div class="list-name">${t.text}</div></div></div>`).join('');
  openModal({
    title: 'Vegas: Make It Big',
    closable: false,
    bodyHTML: `
      <div class="center muted">Χτίσε το απόλυτο Καζίνο-Resort στην καρδιά της Vegas.</div>
      <div class="spacer"></div>
      ${preview}
    `,
    actions: [
      hasSave ? { label: 'Συνέχεια', cls: 'btn-green', onClick: () => { closeModal(); onContinue && onContinue(); } } : null,
      { label: hasSave ? 'Νέο Παιχνίδι' : 'Ξεκίνα', cls: 'btn-primary', onClick: () => { closeModal(); onNew && onNew(); } }
    ].filter(Boolean)
  });
}

export function initScreens() {}
