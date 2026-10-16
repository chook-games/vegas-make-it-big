import { state } from '../core/state.js';
import { openModal, closeModal } from './modals.js';
import { leaderboard, playerRank, competitionFactor } from '../game/npc.js';

export function openRivalsScreen() {
  const lb = leaderboard();
  const rank = playerRank();
  const comp = Math.round((1 - competitionFactor()) * 100);

  const rows = lb.map((e, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    const color = e.isPlayer ? '#06d6a0' : (e.color || '#ccc');
    return `<div class="list-row ${e.isPlayer ? 'done' : ''}">
      <div class="list-icon">${e.icon}</div>
      <div class="list-main">
        <div class="list-name" style="color:${color}">${medal} ${e.name}${e.isPlayer ? ' (you)' : ''}</div>
        <div class="list-desc">Value $${e.value.toLocaleString()} · Rep ${e.reputation} · ${e.buildings} buildings</div>
      </div>
    </div>`;
  }).join('');

  const body = `
    <div class="center muted">Resort value leaderboard. Rivals grow over time and steal guests when they lead.</div>
    <div class="spacer"></div>
    ${rows}
    <div class="spacer"></div>
    <div class="center muted">${comp > 0
      ? `Rivals currently siphon about ${comp}% of your guests.`
      : 'You lead the Strip — no guest drain right now.'}</div>
  `;

  openModal({
    title: `🏁 Rivals — Rank #${rank.rank}/${rank.total}`,
    bodyHTML: body,
    actions: [{ label: 'Close', cls: 'btn-ghost', onClick: closeModal }]
  });
}
