import { state } from '../core/state.js';
import { SCENARIOS } from '../data/campaign.js';
import { themeById } from '../data/themes.js';
import { campaignProgress, isScenarioUnlocked, startScenario } from '../game/campaign.js';
import { menuSceneMarkup } from './mainMenu.js';
import { playSound } from '../audio/audio.js';

function stars(count) {
  return '★'.repeat(count) + '☆'.repeat(3 - count);
}

function detailHTML(i) {
  const sc = SCENARIOS[i];
  if (!sc) return '';
  const th = themeById(sc.theme);
  const unlocked = isScenarioUnlocked(i);
  const got = state.campaignStars[sc.id];
  const reward = sc.reward
    ? `$${sc.reward.cash.toLocaleString()}${sc.reward.gold ? ` + ${sc.reward.gold} gold` : ''}`
    : '—';
  return `
    <div class="sc-detail-title">${sc.title}</div>
    <div class="sc-detail-desc">${unlocked ? sc.desc : 'Finish the previous scenario to unlock this one.'}</div>
    <div class="sc-detail-row"><span>Theme</span><b>${th.icon} ${th.name}</b></div>
    <div class="sc-detail-row"><span>Reward</span><b>${reward}</b></div>
    <div class="sc-detail-row"><span>Stars</span><b>${got ? stars(got) : (unlocked ? '—' : '🔒')}</b></div>`;
}

export function openCampaignScreen(opts) {
  const o = opts || {};
  const fromMenu = !!o.fromMenu;
  if (!fromMenu && state.gameMode !== 'campaign') {
    // Opening from the in-game Options panel without a running campaign.
    // Keep it usable: selecting a scenario will start it.
  }

  let selected = Math.min(state.campaignIndex || 0, SCENARIOS.length - 1);

  const el = document.createElement('div');
  el.className = 'main-menu campaign-menu';

  const render = () => {
    const rows = SCENARIOS.map((sc, i) => {
      const unlocked = isScenarioUnlocked(i);
      const done = i < state.campaignIndex;
      const cls = [
        'scenario-row',
        i === selected ? 'selected' : '',
        unlocked ? '' : 'locked',
        done ? 'done' : ''
      ].filter(Boolean).join(' ');
      const mark = done ? '✔' : (unlocked ? '' : '🔒');
      return `<button class="${cls}" data-i="${i}" ${unlocked ? '' : 'disabled'}>
        <span class="scenario-num">${i + 1}</span>
        <span class="scenario-name">${sc.title}</span>
        <span class="scenario-mark">${mark}</span>
      </button>`;
    }).join('');

    const prog = campaignProgress();
    el.innerHTML = `
      ${menuSceneMarkup()}
      <div class="mm-panel campaign-panel">
        <div class="mm-title">Choose Scenario</div>
        <div class="scenario-list" id="scenario-list">${rows}</div>
        <div class="scenario-detail" id="scenario-detail">${detailHTML(selected)}</div>
        <div class="mm-actions">
          <button class="mm-icon" data-act="cancel" title="Back">&#10005;</button>
          <span class="sc-progress">${prog.stars}/${prog.maxStars} ★</span>
          <button class="mm-icon" data-act="accept" title="Start scenario">&#10003;</button>
        </div>
      </div>`;
    wire();
  };

  const accept = () => {
    if (!isScenarioUnlocked(selected)) { playSound('error'); return; }
    playSound('confirm');
    const i = selected;
    el.remove();
    startScenario(i);
    if (o.onStarted) o.onStarted();
  };

  const cancel = () => {
    playSound('cancel');
    el.remove();
    if (o.onBack) o.onBack();
  };

  const wire = () => {
    el.querySelectorAll('.scenario-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.i, 10);
        if (!isScenarioUnlocked(i)) { playSound('error'); return; }
        selected = i;
        playSound('preview');
        render();
      });
      btn.addEventListener('dblclick', () => {
        const i = parseInt(btn.dataset.i, 10);
        if (!isScenarioUnlocked(i)) return;
        selected = i;
        accept();
      });
    });
    const c = el.querySelector('[data-act="cancel"]');
    const a = el.querySelector('[data-act="accept"]');
    if (c) c.addEventListener('click', cancel);
    if (a) a.addEventListener('click', accept);
  };

  render();
  document.body.appendChild(el);

  return { close: () => el.remove() };
}