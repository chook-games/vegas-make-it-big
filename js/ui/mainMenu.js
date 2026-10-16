export function openMainMenu({ hasSave, onContinue, onCampaign, onFreePlay, onSettings }) {
  const el = document.createElement('div');
  el.className = 'main-menu';
  el.innerHTML = `
    <div class="mm-inner">
      <div class="mm-logo">VEGAS</div>
      <div class="mm-tag">Make It Big</div>
      <div class="mm-buttons">
        ${hasSave ? '<button class="btn btn-green" data-act="continue">▶ Συνέχεια</button>' : ''}
        <button class="btn btn-primary" data-act="campaign">🎯 Campaign</button>
        <button class="btn btn-gold" data-act="freeplay">🎮 Free Play</button>
        <button class="btn btn-ghost" data-act="settings">⚙️ Ρυθμίσεις</button>
      </div>
      <div class="mm-foot">Παίζει σε κινητό & υπολογιστή</div>
    </div>`;
  document.body.appendChild(el);

  const close = () => el.remove();
  el.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
    const act = b.dataset.act;
    if (act === 'settings') { onSettings && onSettings(); return; }
    close();
    if (act === 'continue') onContinue && onContinue();
    else if (act === 'campaign') onCampaign && onCampaign();
    else if (act === 'freeplay') onFreePlay && onFreePlay();
  }));

  return { close };
}
