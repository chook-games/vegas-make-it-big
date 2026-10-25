import { state, activeLot } from '../core/state.js';
import { Bus, EV } from '../core/events.js';
import { openModal, closeModal } from '../ui/modals.js';
import { openThemeSelect } from '../ui/themeSelect.js';
import { switchLot } from './lots.js';
import { currentScenario } from './campaign.js';
import { applyThemeToTiles } from '../three/worlds.js';
import { currentTheme } from './lots.js';
import { save } from '../core/save.js';
import { startLotTutorial } from './lotTutorial.js';

const LOT_PRICE = 16000;

function text(body) {
  return `<div class="modal-text">${body}</div>`;
}

export function runCampaignIntro() {
  let pathHintArmed = false;
  let pathHintShown = false;
  openModal({
    title: 'Welcome to the Strip!',
    className: 'green-modal',
    closable: false,
    bodyHTML: text(`
      <p>This is <b>Vegas: Make It Big!</b></p>
      <p>Let's begin with a few tips to help you through the game's controls.</p>
      <p>At any time you can view your objectives by clicking on the <b>Objectives</b> icon in the top left panel.</p>
      <p>The <b>i</b> icon will give you further details on individual tasks.</p>
    `),
    actions: [{ label: '\u2713', cls: 'btn-green', onClick: () => { closeModal(); showObjectives(); } }]
  });

  function showObjectives() {
    const body = `<table class="obj-table">
      <thead><tr><th>Objective</th><th>Progress</th><th>Status</th><th>Link</th></tr></thead>
      <tbody>
        <tr>
          <td>Buy your first Lot.</td>
          <td class="obj-prog-cell"><div class="obj-prog-bar"><i style="width:0%"></i></div></td>
          <td style="text-align:center;color:#ffb4a2">✘</td>
          <td style="text-align:center"><button class="obj-info-btn" data-info>ℹ</button></td>
        </tr>
      </tbody>
    </table>`;
    openModal({
      title: 'Objectives',
      className: 'green-modal objectives-window',
      closable: false,
      bodyHTML: `<div class="center muted">All construction takes place on a piece of land called a Lot. It will be highlighted when the cursor is over it.</div><div class="spacer"></div>${body}`,
      actions: [{ label: '\u2713', cls: 'btn-green', onClick: () => { closeModal(); showLotPurchase(); } }],
      onOpen: (bodyEl) => {
        const btn = bodyEl.querySelector('[data-info]');
        if (btn) btn.addEventListener('click', () => {
          openModal({
            title: 'Objectives',
            className: 'green-modal',
            bodyHTML: text(`
              <p>In Vegas: Make It Big! all construction takes place on an area of land referred to as a Lot.</p>
              <p>There is only one available Lot at this time and it will become highlighted when the cursor is over it.</p>
              <p>Left click to select the Lot.</p>`),
            actions: [{ label: 'Back', cls: 'btn-ghost', onClick: showObjectives }]
          });
        });
      }
    });
  }

  function showLotPurchase() {
    openModal({
      title: 'Lot Purchase.',
      className: 'green-modal',
      closable: false,
      bodyHTML: text(`
        <p>To buy this Lot click the <b>Buy</b> 💵 icon in the panel below.</p>
        <p>You will be given a choice of themes for your Lot. Choose one of the available themes, then click on the <b>Accept</b> ✓ icon.</p>`),
      actions: [{
        label: '\u2713',
        cls: 'btn-green',
        onClick: () => {
          closeModal();
          startLotTutorial(LOT_PRICE, showTheme);
          Bus.emit(EV.UI_REFRESH);
          const hint = document.getElementById('ui-hint');
          if (hint) hint.innerHTML = `🏷️ Select the highlighted Lot, then press <b>Buy</b> in the bottom-left panel.`;
        }
      }]
    });
  }

  function showTheme() {
    openThemeSelect({
      defaultId: currentScenario() ? currentScenario().theme : 'american',
      onPick: (theme) => {
        const lot = activeLot();
        lot.theme = theme;
        applyThemeToTiles(currentTheme());
        switchLot(0, true);
        save();
        showBuilding();
      }
    });
  }

  function showBuilding() {
    state.dockMajor.exterior = 'facilities';
    state.dockCategory.exterior = 'hotel';
    Bus.emit(EV.UI_REFRESH);
    openModal({
      title: 'Building.',
      className: 'green-modal',
      closable: false,
      bodyHTML: text(`
        <p>Well done, you've bought your first Lot!</p>
        <p>Now let's build a Hotel for your guests. First select the Lot, then click on the <b>Construction</b> icon.</p>
        <p>Select the <b>Infrastructure → Hotels</b> tab and select a <b>Small Hotel</b>.</p>
        <p>Use the mouse to position the Hotel in the Lot and use the <b>Space</b> bar to rotate it.</p>
      `),
      actions: [{
        label: '\u2713',
        cls: 'btn-green',
        onClick: () => {
          closeModal();
          const hint = document.getElementById('ui-hint');
          if (hint) hint.innerHTML = '🏨 Build a <b>Small Hotel</b> from Infrastructure → Hotels below.';
        }
      }]
    });
    armPathHint();
  }

  function armPathHint() {
    if (pathHintArmed) return;
    pathHintArmed = true;
    const onPlaced = (data) => {
      if (!data || !data.item || data.item.id !== 'hotel' || data.world !== 'exterior') return;
      if (pathHintShown) return;
      pathHintShown = true;
      Bus.off(EV.BUILDING_PLACED, onPlaced);
      setTimeout(showPaths, 450);
    };
    Bus.on(EV.BUILDING_PLACED, onPlaced);
  }

  function showPaths() {
    openModal({
      title: 'Paths.',
      className: 'green-modal',
      closable: false,
      bodyHTML: text(`
        <p>Guests must be able to reach the Hotel from the street.</p>
        <p>Open <b>Paths &amp; Scenery</b> - <b>Paths</b> and lay path tiles from the road up to the Hotel entrance.</p>
        <p>Once connected, the Hotel starts earning money.</p>
      `),
      actions: [{
        label: '\u2713',
        cls: 'btn-green',
        onClick: () => {
          closeModal();
          state.dockMajor.exterior = 'scenery';
          state.dockCategory.exterior = 'paths';
          Bus.emit(EV.UI_REFRESH);
          const hint = document.getElementById('ui-hint');
          if (hint) hint.innerHTML = 'Lay path tiles from the street to the Hotel entrance.';
        }
      }]
    });
  }
}