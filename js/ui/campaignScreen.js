import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { SCENARIOS } from '../data/campaign.js';
import { themeById } from '../data/themes.js';
import { inCampaign, currentScenario, goalStatus, campaignProgress, isScenarioUnlocked, startScenario } from '../game/campaign.js';

function stars(count) {
  return '⭐'.repeat(count) + '☆'.repeat(3 - count);
}

function scenarioRow(sc, i) {
  const th = themeById(sc.theme);
  const done = i < state.campaignIndex;
  const current = i === state.campaignIndex;
  const unlocked = isScenarioUnlocked(i);
  const gotStars = state.campaignStars[sc.id];
  const reward = sc.reward ? `$${sc.reward.cash.toLocaleString()}${sc.reward.gold ? ` +${sc.reward.gold}💎` : ''}` : '';
  const action = unlocked ? `<button class="staff-btn" data-start="${i}">▶️</button>` : '';
  return `<div class="list-row ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}">
    <div class="list-icon">${!unlocked ? '🔒' : th.icon}</div>
    <div class="list-main">
      <div class="list-name">${i + 1}. ${sc.title}</div>
      <div class="list-desc">${unlocked ? sc.desc : 'Unlock it by finishing the previous scenario.'}</div>
      <div class="list-reward">Reward: ${reward} ${done && gotStars ? '· ' + stars(gotStars) : ''}</div>
    </div>
    <div class="list-check">${done ? '✅' : current ? '▶️' : ''}</div>
    ${action}
  </div>`;
}

function currentGoalsHTML() {
  const st = goalStatus();
  if (!st.length) return '';
  return `<div class="spacer"></div>
    <div class="muted">Current scenario goals:</div>
    ${st.map(g => `<div class="list-row ${g.done ? 'done' : ''}">
      <div class="list-main">
        <div class="list-name">${g.done ? '✅ ' : ''}${g.label}</div>
        <div class="list-progress"><i style="width:${g.pct}%"></i></div>
        <div class="list-reward">${Math.min(g.current, g.target).toLocaleString()} / ${g.target.toLocaleString()}</div>
      </div>
    </div>`).join('')}`;
}

function buildBody(fromMenu) {
  const prog = campaignProgress();
  if (fromMenu) {
    return `<div class="center muted">Pick a scenario. They unlock one by one as you finish the previous.</div>
      <div class="center muted">Completed: ${state.campaignIndex}/${SCENARIOS.length} · ⭐ ${prog.stars}/${prog.maxStars}</div>
      <div class="spacer"></div>
      ${SCENARIOS.map((s, i) => scenarioRow(s, i)).join('')}`;
  }
  const sc = currentScenario();
  const header = sc
    ? `<div class="center muted">Scenario ${prog.index + 1}/${prog.total} · ⭐ ${prog.stars}/${prog.maxStars}</div>`
    : `<div class="center big-stat">👑 You finished the Campaign!</div>`;
  return `${header}
    ${currentGoalsHTML()}
    <div class="spacer"></div>
    ${SCENARIOS.map((s, i) => scenarioRow(s, i)).join('')}`;
}

function render(fromMenu, onStarted, onBack) {
  const actions = [];
  if (fromMenu) actions.push({ label: 'Back to Menu', cls: 'btn-ghost', onClick: () => { closeModal(); onBack && onBack(); } });
  else actions.push({ label: 'Close', cls: 'btn-ghost', onClick: closeModal });

  openModal({
    title: '🎯 Campaign',
    bodyHTML: buildBody(fromMenu),
    actions,
    onOpen: (bodyEl) => {
      bodyEl.querySelectorAll('[data-start]').forEach(b => b.addEventListener('click', () => {
        const i = parseInt(b.dataset.start, 10);
        closeModal();
        startScenario(i);
        if (onStarted) onStarted();
      }));
    }
  });
}

export function openCampaignScreen(opts) {
  const o = opts || {};
  const fromMenu = !!o.fromMenu;
  if (!fromMenu && !inCampaign()) {
    render(true, o.onStarted, o.onBack);
    return;
  }
  render(fromMenu, o.onStarted, o.onBack);
}
