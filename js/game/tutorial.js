import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { save } from '../core/save.js';

const STEPS = [
  {
    text: 'Καλώς ήρθες στη Vegas! Διάλεξε ένα κτίριο από το κάτω μενού για να το χτίσεις.',
    trigger: 'tool:select'
  },
  {
    text: 'Τώρα πάτησε σε ένα κενό πλακίδιο του χάρτη για να το τοποθετήσεις.',
    trigger: ''
  },
  {
    text: 'Τέλεια! Πάτησε το κουμπί «Καζίνο» πάνω δεξιά για να μπεις μέσα.',
    trigger: 'view:switch'
  },
  {
    text: 'Μέσα στο καζίνο χτίσε ένα τραπέζι (π.χ. Slots ή Ρουλέτα).',
    trigger: 'building:placed'
  },
  {
    text: 'Ρύθμισε το House Edge από το κουμπί 🎲 — χαμηλό φέρνει περισσότερους VIP.',
    trigger: 'odds:set'
  },
  {
    text: 'Έτοιμος! Ανέβασε Φήμη, ολοκλήρωσε αποστολές και κάνε Prestige για μόνιμα bonuses.',
    trigger: 'tutorial:next'
  }
];

let active = false;

export function beginTutorial() {
  if (state.tutorialDone) return;
  active = true;
  state.tutorial = 0;
  render();
}

export function tutorialActive() {
  return active;
}

function render() {
  const el = document.getElementById('tutorial-banner');
  if (!active || state.tutorial >= STEPS.length) {
    el.classList.remove('show');
    return;
  }
  const step = STEPS[state.tutorial];
  el.innerHTML = `
    <div class="tut-step">Οδηγός ${state.tutorial + 1}/${STEPS.length}</div>
    <div>${step.text}</div>
    <button class="tut-skip" id="tut-skip">Παράλειψη οδηγού</button>
  `;
  el.classList.add('show');
  const skip = document.getElementById('tut-skip');
  if (skip) skip.onclick = skipTutorial;
}

function advance() {
  if (!active) return;
  state.tutorial++;
  if (state.tutorial >= STEPS.length) {
    finishTutorial();
    return;
  }
  render();
}

export function skipTutorial() {
  finishTutorial();
}

function finishTutorial() {
  active = false;
  state.tutorialDone = true;
  document.getElementById('tutorial-banner').classList.remove('show');
  Bus.emit(EV.TOAST, { text: '✅ Οδηγός ολοκληρώθηκε! Καλή διασκέδαση.', kind: 'good' });
  save();
}

export function initTutorial() {
  Bus.on('tool:select', () => { if (active && state.tutorial === 0) advance(); });
  Bus.on(EV.VIEW_SWITCH, () => { if (active && state.tutorial === 2) advance(); });
  Bus.on('odds:set', () => { if (active && state.tutorial === 4) advance(); });
  Bus.on(EV.BUILDING_PLACED, () => {
    if (!active) return;
    if (state.tutorial === 1) advance();
    else if (state.tutorial === 3) advance();
  });
}
