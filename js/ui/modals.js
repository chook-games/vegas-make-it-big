let currentOverlay = null;

export function closeModal() {
  if (currentOverlay) {
    currentOverlay.remove();
    currentOverlay = null;
  }
}

export function openModal({ title, bodyHTML, bodyEl, actions, closable = true, onOpen }) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const card = document.createElement('div');
  card.className = 'modal-card';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', closeModal);
  if (closable) card.appendChild(closeBtn);

  if (title) {
    const h = document.createElement('h2');
    h.className = 'modal-title';
    h.textContent = title;
    card.appendChild(h);
  }

  const body = document.createElement('div');
  body.className = 'modal-text';
  if (bodyEl) body.appendChild(bodyEl);
  else body.innerHTML = bodyHTML || '';
  card.appendChild(body);

  if (actions) {
    actions.forEach(a => {
      const btn = document.createElement('button');
      btn.className = `btn ${a.cls || 'btn-ghost'}`;
      btn.textContent = a.label;
      btn.addEventListener('click', () => a.onClick && a.onClick());
      card.appendChild(btn);
    });
  }

  overlay.appendChild(card);
  overlay.addEventListener('click', (e) => { if (e.target === overlay && closable) closeModal(); });
  document.getElementById('modal-root').appendChild(overlay);
  currentOverlay = overlay;

  if (onOpen) onOpen(body, card);
  return { card, body, close: closeModal };
}

export function modalOpen() {
  return !!currentOverlay;
}
