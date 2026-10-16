import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { SCENARIOS } from '../data/campaign.js';
import { themeById } from '../data/themes.js';
import { inCampaign, currentScenario, goalStatus, campaignProgress, startCampaign } from '../game/campaign.js';

function stars(count) {
  return '⭐'.repeat(count) + '☆'.repeat(3 - count);
}

function scenarioRow(sc, i) {
  const th = themeById(sc.theme);
  const done = i < state.campaignIndex;
  const current = i === state.campaignIndex;
  const gotStars = state.campaignStars[sc.id];
  const reward = sc.reward ? `$${sc.reward.cash.toLocaleString()}${sc.reward.gold ? ` +${sc.reward.gold}💎` : ''}` : '';
  return `<div class="list-row ${done ? 'done' : ''} ${!done && !current ? 'locked' : ''}">
    <div class="list-icon">${th.icon}</div>
    <div class="list-main">
      <div class="list-name">${i + 1}. ${sc.title}</div>
      <div class="list-desc">${sc.desc}</div>
      <div class="list-reward">Ανταμοιβή: ${reward} ${done && gotStars ? '· ' + stars(gotStars) : ''}</div>
    </div>
    <div class="list-check">${done ? '✅' : current ? '▶️' : '🔒'}</div>
  </div>`;
}

function currentGoalsHTML() {
  const st = goalStatus();
  if (!st.length) return '';
  return `<div class="spacer"></div>
    <div class="muted">Στόχοι τρέχοντος scenario:</div>
    ${st.map(g => `<div class="list-row ${g.done ? 'done' : ''}">
      <div class="list-main">
        <div class="list-name">${g.done ? '✅ ' : ''}${g.label}</div>
        <div class="list-progress"><i style="width:${g.pct}%"></i></div>
        <div class="list-reward">${Math.min(g.current, g.target).toLocaleString()} / ${g.target.toLocaleString()}</div>
      </div>
    </div>`).join('')}`;
}

function buildBody() {
  const prog = campaignProgress();
  if (!inCampaign()) {
    return `<div class="center big-stat">🎯 Campaign</div>
      <div class="center muted">10 scenarios με στόχους. Ξεκινάς από ένα οικόπεδο και χτίζεις την αυτοκρατορία lot-προς-lot.</div>
      <div class="spacer"></div>
      ${SCENARIOS.map((s, i) => scenarioRow(s, i)).join('')}`;
  }
  const sc = currentScenario();
  const header = sc
    ? `<div class="center muted">Scenario ${prog.index + 1}/${prog.total} · ⭐ ${prog.stars}/${prog.maxStars}</div>`
    : `<div class="center big-stat">👑 Ολοκλήρωσες το Campaign!</div>`;
  return `${header}
    ${currentGoalsHTML()}
    <div class="spacer"></div>
    ${SCENARIOS.map((s, i) => scenarioRow(s, i)).join('')}`;
}

function render() {
  const actions = [];
  if (!inCampaign()) {
    actions.push({ label: 'Ξεκίνα Campaign', cls: 'btn-primary', onClick: () => { closeModal(); startCampaign(); } });
  }
  actions.push({ label: 'Κλείσιμο', cls: 'btn-ghost', onClick: closeModal });
  openModal({ title: '🎯 Campaign', bodyHTML: buildBody(), actions });
}

export function openCampaignScreen() {
  render();
}
