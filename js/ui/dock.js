import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { CATALOG, isUnlocked, lockLabel } from '../data/buildings.js';
import { categoriesFor, categoryOf, majorsFor } from '../data/categories.js';
import { playSound } from '../audio/audio.js';
import { cancelPendingPlacement } from '../game/placement.js';
import { activeLot, switchLot } from '../game/lots.js';
import { t } from '../i18n/i18n.js';
import { renderPeoplePanel, renderFinancePanel, renderStaffPanel, renderWorldPanel } from './peoplePanel.js';
import { pendingLotPrice, buyPendingLot } from '../game/lotTutorial.js';

export function renderDock() {
  const grid = document.getElementById('build-grid');
  const tabs = document.getElementById('dock-tabs');
  const subtabs = document.getElementById('dock-subtabs');
  const panels = {
    world: document.getElementById('world-panel'),
    people: document.getElementById('people-panel'),
    finance: document.getElementById('finance-panel'),
    staff: document.getElementById('staff-panel')
  };
  const buyPrice = pendingLotPrice();
  const mode = buyPrice ? 'lot' : (state.dockMode || 'lot');
  const wi = document.getElementById('world-info');
  const fs = document.getElementById('finance-strip');
  const modesEl = document.querySelector('.dock-modes');
  if (buyPrice) {
    if (wi) wi.style.display = 'none';
    if (fs) fs.style.display = 'none';
    if (modesEl) modesEl.style.display = 'none';
  } else {
    if (wi) wi.style.display = '';
    if (fs) fs.style.display = '';
    if (modesEl) modesEl.style.display = '';
  }

  document.querySelectorAll('[data-dmode]').forEach(b => {
    b.classList.toggle('active', b.dataset.dmode === mode);
  });
  const wbtn = document.getElementById('btn-world');
  const lbtn = document.getElementById('btn-lot');
  const pbtn = document.getElementById('btn-people');
  const fbtn = document.getElementById('btn-finance');
  const sbtn = document.getElementById('btn-staff');
  if (wbtn) wbtn.classList.toggle('active', mode === 'world');
  if (lbtn) lbtn.classList.toggle('active', mode === 'lot');
  if (pbtn) pbtn.classList.toggle('active', mode === 'people');
  if (fbtn) fbtn.classList.toggle('active', mode === 'finance');
  if (sbtn) sbtn.classList.toggle('active', mode === 'staff');

  if (buyPrice) {
    tabs.innerHTML = '';
    if (subtabs) { subtabs.innerHTML = ''; subtabs.style.display = 'none'; }
    Object.keys(panels).forEach(k => { if (panels[k]) panels[k].style.display = 'none'; });
    grid.style.display = 'block';
    grid.style.maxHeight = 'none';
    grid.style.overflow = 'visible';
    grid.innerHTML = `<div class="lot-buy">
      <div class="lot-buy-title">${activeLot() ? activeLot().name : 'Lot'}</div>
      <div class="lot-buy-price">This lot is available to buy for $${buyPrice}</div>
      <button class="lot-buy-btn" id="lot-buy-btn" title="Buy this Lot">💵</button>
    </div>`;
    const buyBtn = grid.querySelector('#lot-buy-btn');
    if (buyBtn) buyBtn.addEventListener('click', () => buyPendingLot());
    document.getElementById('dock-title').textContent = `i ${activeLot() ? activeLot().name : 'Lot'}`;
    document.getElementById('dock-status').textContent = '';
    return;
  }

  const PANEL_TITLES = { world: 'World Info', people: 'People', finance: 'Finance', staff: 'Staff' };

  if (panels[mode]) {
    tabs.innerHTML = '';
    if (subtabs) subtabs.innerHTML = '';
    grid.innerHTML = '';
    grid.style.display = 'none';
    if (subtabs) subtabs.style.display = 'none';
    Object.keys(panels).forEach(k => {
      if (!panels[k]) return;
      panels[k].style.display = k === mode ? 'block' : 'none';
    });
    if (mode === 'world') renderWorldPanel(panels.world);
    else if (mode === 'people') renderPeoplePanel(panels.people);
    else if (mode === 'finance') renderFinancePanel(panels.finance);
    else if (mode === 'staff') renderStaffPanel(panels.staff);
    document.getElementById('dock-title').textContent = PANEL_TITLES[mode] || '';
    document.getElementById('dock-status').textContent = '';
    return;
  }

  grid.style.display = '';
  grid.style.maxHeight = '';
  grid.style.overflow = '';
  if (subtabs) subtabs.style.display = '';
  Object.keys(panels).forEach(k => { if (panels[k]) panels[k].style.display = 'none'; });
  grid.innerHTML = '';
  tabs.innerHTML = '';
  if (subtabs) subtabs.innerHTML = '';

  const world = state.mode;
  const theme = activeLot() ? activeLot().theme : 'american';
  const majors = majorsFor(world);
  let major = majors.find(m => m.id === state.dockMajor[world]) || majors[0];
  state.dockMajor[world] = major.id;

  const minors = categoriesFor(world).filter(c => major.subgroups.includes(c.id));
  let cat = state.dockCategory[world];
  if (!minors.find(c => c.id === cat)) {
    cat = minors.length ? minors[0].id : major.subgroups[0];
    state.dockCategory[world] = cat;
  }

  majors.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'dock-major' + (m.id === major.id ? ' active' : '');
    btn.innerHTML = `<span class="dock-major-icon">${m.icon}</span><span class="dock-major-name">${t(m.name)}</span>`;
    btn.addEventListener('click', () => {
      state.dockMajor[world] = m.id;
      state.dockCategory[world] = m.subgroups[0];
      playSound('preview');
      renderDock();
    });
    tabs.appendChild(btn);
  });

  minors.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'dock-tab' + (c.id === cat ? ' active' : '');
    btn.innerHTML = `<span class="dock-tab-icon">${c.icon}</span><span class="dock-tab-name">${t(c.name)}</span>`;
    btn.addEventListener('click', () => {
      state.dockCategory[world] = c.id;
      playSound('preview');
      renderDock();
    });
    if (subtabs) subtabs.appendChild(btn);
  });

  const statusEl = document.getElementById('dock-status');
  if (state.selectedTool) {
    const all = CATALOG[world];
    const sel = all.find(x => x.id === state.selectedTool);
    statusEl.textContent = sel ? `${t('Selected')}: ${t(sel.name)}` : t('Select a building');
    statusEl.style.color = '#ffd166';
  } else {
    statusEl.textContent = t('Tap a building for options');
    statusEl.style.color = '#00f5d4';
  }

  const lot = activeLot();
  document.getElementById('dock-title').textContent = lot
    ? `i ${lot.name}`
    : (world === 'exterior' ? t('Resort Buildings') : t('Casino Equipment'));

  const list = CATALOG[world].filter(item =>
    (!item.themeOnly || item.themeOnly === theme) && categoryOf(world, item.id) === cat
  );

  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'dock-empty';
    empty.textContent = t('Nothing available here yet.');
    grid.appendChild(empty);
    return;
  }

  list.forEach(item => {
    const unlocked = isUnlocked(item, state);
    const card = document.createElement('div');
    card.className = `build-card ${state.selectedTool === item.id ? 'active' : ''} ${unlocked ? '' : 'locked'}`;
    const badge = item.tier ? `<span class="build-badge">T${item.tier}</span>` : '';
    const lock = unlocked ? '' : `<span class="build-lock">🔒</span>`;
    const costTxt = unlocked ? `$${item.cost.toLocaleString()}` : (lockLabel(item) || t('Locked'));
    card.innerHTML = `
      ${badge}${lock}
      <div class="build-icon">${item.icon}</div>
      <div class="build-name">${t(item.name)}</div>
      <div class="build-cost ${unlocked ? '' : 'locked-txt'}">${costTxt}</div>
    `;
    card.addEventListener('click', () => selectTool(item, unlocked));
    grid.appendChild(card);
  });
}

function selectTool(item, unlocked) {
  if (!unlocked) {
    playSound('error');
    Bus.emit(EV.TOAST, { text: `🔒 ${t('Requires')} ${lockLabel(item)}.`, kind: 'bad' });
    return;
  }
  if (state.pendingPlacement) cancelPendingPlacement();
  Bus.emit(EV.INSPECTOR_CLOSE);

  if (state.selectedTool === item.id) {
    state.selectedTool = null;
    Bus.emit('tool:select', null);
    document.getElementById('ui-hint').innerHTML = t('Tap a building on the map to upgrade or move it.');
  } else {
    state.selectedTool = item.id;
    Bus.emit('tool:select', item.id);
    document.getElementById('ui-hint').innerHTML = `${item.icon} <b>${t(item.name)}:</b> ${t('Tap an empty tile to place and rotate.')}`;
  }
  playSound('preview');
  renderDock();
}

export function initDock() {
  Bus.on(EV.UI_REFRESH, renderDock);
  Bus.on('tool:select', renderDock);
  document.querySelectorAll('[data-dmode]').forEach(b => {
    b.addEventListener('click', () => {
      state.dockMode = b.dataset.dmode;
      playSound('preview');
      renderDock();
    });
  });

  const worldBtn = document.getElementById('btn-world');
  const lotBtn = document.getElementById('btn-lot');
  if (worldBtn) worldBtn.addEventListener('click', () => { state.dockMode = 'world'; renderDock(); });
  if (lotBtn) lotBtn.addEventListener('click', () => { state.dockMode = 'lot'; renderDock(); });
  const peopleBtn = document.getElementById('btn-people');
  const financeBtn = document.getElementById('btn-finance');
  const staffBtn = document.getElementById('btn-staff');
  if (peopleBtn) peopleBtn.addEventListener('click', () => { state.dockMode = 'people'; playSound('preview'); renderDock(); });
  if (financeBtn) financeBtn.addEventListener('click', () => { state.dockMode = 'finance'; playSound('preview'); renderDock(); });
  if (staffBtn) staffBtn.addEventListener('click', () => { state.dockMode = 'staff'; playSound('preview'); renderDock(); });

  const cycleLot = (dir) => {
    if (state.lots.length < 2) return;
    if (state.pendingPlacement) cancelPendingPlacement();
    Bus.emit(EV.INSPECTOR_CLOSE);
    let idx = state.activeLot + dir;
    if (idx < 0) idx = state.lots.length - 1;
    if (idx >= state.lots.length) idx = 0;
    switchLot(idx);
  };
  const prev = document.getElementById('lot-prev');
  const next = document.getElementById('lot-next');
  if (prev) prev.addEventListener('click', () => cycleLot(-1));
  if (next) next.addEventListener('click', () => cycleLot(1));
}
