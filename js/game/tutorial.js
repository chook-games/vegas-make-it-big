import { state } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { save } from '../core/save.js';

const STEPS = [
  {
    text: 'Welcome to Vegas! Pick a building from the menu at the bottom to start building.',
    trigger: 'tool:select'
  },
  {
    text: 'Now tap an empty tile on the map to place it.',
    trigger: ''
  },
  {
    text: 'Nice! Tap the "Casino" button at the top to go inside.',
    trigger: 'view:switch'
  },
  {
    text: 'Inside the casino, build a table (e.g. Slots or Roulette).',
    trigger: 'building:placed'
  },
  {
    text: 'Set the House Edge from the 🎲 button - a low edge draws more VIPs.',
    trigger: 'odds:set'
  },
  {
    text: 'Done! Raise Reputation, finish quests and Prestige for permanent bonuses.',
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
    <div class="tut-step">Guide ${state.tutorial + 1}/${STEPS.length}</div>
    <div>${step.text}</div>
    <button class="tut-skip" id="tut-skip">Skip guide</button>
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
  Bus.emit(EV.TOAST, { text: '✅ Guide complete! Have fun.', kind: 'good' });
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
