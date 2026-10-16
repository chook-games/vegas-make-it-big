import { openModal, closeModal } from './modals.js';

const EVENTS_OPTS = [
  { label: 'Never', value: 0 },
  { label: 'Rare', value: 0.5 },
  { label: 'Normal', value: 1 },
  { label: 'Frequent', value: 2 },
  { label: 'Very Frequent', value: 3 }
];
const DIS_OPTS = [
  { label: 'Never', value: 0 },
  { label: 'Rare', value: 0.3 },
  { label: 'Normal', value: 1 },
  { label: 'Frequent', value: 2 }
];

export function openSandboxScreen({ onStart, onBack, defaultCash }) {
  const cashDefault = Math.max(5000, Math.round((defaultCash || 8000) / 1000) * 1000);
  let doStart = () => {};

  openModal({
    title: 'Sandbox Settings',
    bodyHTML: `
      <div class="sb-row"><label>Starting Cash</label><span id="sb-cash-val">$${cashDefault.toLocaleString()}</span></div>
      <input type="range" class="odds-slider" id="sb-cash" min="5000" max="500000" step="5000" value="${cashDefault}">
      <div class="sb-row"><label>Max Population</label><span id="sb-pop-val">Unlimited</span></div>
      <input type="range" class="odds-slider" id="sb-pop" min="0" max="5000" step="100" value="0">
      <div class="sb-row"><label>Starting Hour</label><span id="sb-hour-val">08:00</span></div>
      <input type="range" class="odds-slider" id="sb-hour" min="0" max="23" step="1" value="8">
      <div class="sb-row"><label>Events</label><span id="sb-ev-val">Normal</span></div>
      <input type="range" class="odds-slider" id="sb-ev" min="0" max="4" step="1" value="2">
      <div class="sb-row"><label>Weather / Disasters</label><span id="sb-dis-val">Normal</span></div>
      <input type="range" class="odds-slider" id="sb-dis" min="0" max="3" step="1" value="2">
      <label class="sb-check"><input type="checkbox" id="sb-unlock"> Unlock the Build Tree (all buildings allowed)</label>
    `,
    actions: [
      { label: 'Back', cls: 'btn-ghost', onClick: () => { closeModal(); onBack && onBack(); } },
      { label: 'Start', cls: 'btn-green', onClick: () => doStart() }
    ],
    onOpen: (bodyEl) => {
      const cash = bodyEl.querySelector('#sb-cash');
      const pop = bodyEl.querySelector('#sb-pop');
      const hour = bodyEl.querySelector('#sb-hour');
      const ev = bodyEl.querySelector('#sb-ev');
      const dis = bodyEl.querySelector('#sb-dis');
      const unlock = bodyEl.querySelector('#sb-unlock');
      const cashVal = bodyEl.querySelector('#sb-cash-val');
      const popVal = bodyEl.querySelector('#sb-pop-val');
      const hourVal = bodyEl.querySelector('#sb-hour-val');
      const evVal = bodyEl.querySelector('#sb-ev-val');
      const disVal = bodyEl.querySelector('#sb-dis-val');

      const upd = () => {
        const c = Number(cash.value) || cashDefault;
        const p = Number(pop.value) || 0;
        const h = Number.isFinite(Number(hour.value)) ? Number(hour.value) : 8;
        const ei = Math.min(EVENTS_OPTS.length - 1, Math.max(0, Number(ev.value) || 0));
        const di = Math.min(DIS_OPTS.length - 1, Math.max(0, Number(dis.value) || 0));
        cashVal.textContent = '$' + c.toLocaleString();
        popVal.textContent = p === 0 ? 'Unlimited' : String(p);
        hourVal.textContent = String(h).padStart(2, '0') + ':00';
        evVal.textContent = EVENTS_OPTS[ei].label;
        disVal.textContent = DIS_OPTS[di].label;
      };
      [cash, pop, hour, ev, dis].forEach(el => el.addEventListener('input', upd));
      upd();

      doStart = () => {
        const ei = Math.min(EVENTS_OPTS.length - 1, Math.max(0, Number(ev.value) || 0));
        const di = Math.min(DIS_OPTS.length - 1, Math.max(0, Number(dis.value) || 0));
        closeModal();
        onStart && onStart({
          cash: Number(cash.value) || cashDefault,
          maxPopulation: Number(pop.value) || 0,
          startHour: Number.isFinite(Number(hour.value)) ? Number(hour.value) : 8,
          eventsFreq: EVENTS_OPTS[ei].value,
          disastersFreq: DIS_OPTS[di].value,
          unlockAll: !!(unlock && unlock.checked)
        });
      };
    }
  });
}
