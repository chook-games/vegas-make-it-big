import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { goalStatus, currentScenario, inCampaign } from '../game/campaign.js';
import { activeQuest, questProgress } from '../game/quests.js';
import { openQuestsScreen } from './screens.js';

function buildRows() {
  const list = [];
  if (inCampaign()) {
    const sc = currentScenario();
    if (sc) {
      goalStatus().forEach(g => list.push({
        name: g.label,
        current: g.current,
        target: g.target,
        done: g.done
      }));
    }
  } else {
    const q = activeQuest();
    if (q) {
      const p = questProgress(q);
      list.push({ name: q.title, current: p.current, target: p.target, done: p.current >= p.target });
    }
  }
  return list;
}

export function openObjectivesScreen() {
  const list = buildRows();
  const body = list.length
    ? `<table class="obj-table">
        <thead><tr><th>Objective</th><th>Progress</th><th>Status</th><th>Link</th></tr></thead>
        <tbody>
          ${list.map((o, i) => {
            const pct = Math.min(100, Math.round((o.current / Math.max(1, o.target)) * 100));
            return `<tr>
              <td>${o.name}</td>
              <td class="obj-prog-cell"><div class="obj-prog-bar"><i style="width:${pct}%"></i></div></td>
              <td style="color:${o.done ? '#6fe3b0' : '#ffb4a2'};text-align:center">${o.done ? '✔' : '✘'}</td>
              <td style="text-align:center"><button class="obj-info-btn" data-i="${i}">ℹ</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`
    : '<div class="center muted">No objectives right now.</div>';

  openModal({
    title: 'Objectives',
    className: 'green-modal objectives-window',
    bodyHTML: body,
    actions: [
      { label: 'Quests & Missions', cls: 'btn-ghost', onClick: () => { closeModal(); openQuestsScreen(); } },
      { label: 'Close', cls: 'btn-ghost', onClick: closeModal }
    ],
    onOpen: (bodyEl) => {
      bodyEl.querySelectorAll('[data-i]').forEach(btn => {
        btn.addEventListener('click', () => {
          const o = list[parseInt(btn.dataset.i, 10)];
          if (!o) return;
          openModal({
            title: 'Objective',
            className: 'green-modal',
            bodyHTML: `<div class="modal-text"><b>${o.name}</b><br><br>Progress: ${Math.min(o.current, o.target)} / ${o.target}<br>Status: ${o.done ? 'Completed ✔' : 'In progress'}</div>`,
            actions: [{ label: 'Back', cls: 'btn-ghost', onClick: () => { closeModal(); openObjectivesScreen(); } }]
          });
        });
      });
    }
  });
}
