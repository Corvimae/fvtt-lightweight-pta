import { preloadTemplates } from './preload/templates.js';
import TrainerSheet from './actor/TrainerSheet.js';
import FeatureSheet from './item/FeatureSheet.js';
import CarriableSheet from './item/CarriableSheet.js';
import MoveSheet from './item/MoveSheet.js';
import { rollMove, rollMetronome, rollSkill, rollStat } from './macros/macros.js';
import { handleItemDrop } from './hooks/handleItemDrop.js';
import PokemonManagerSheet from './actor/PokemonManagerSheet.js';
import TokenSheet from './actor/TokenSheet.js';
import { renderEntitySheetConfig } from './hooks/handleRenderEntitySheetConfig.js';
import { handleRenderPokemonManagerSheet } from './hooks/handleRenderPokemonManagerSheet.js';
import { POKEMON_STRING } from './utils/constants.js';
import { restartPokemonStatSyncInterval } from './processes/syncPokemonStatValues.js';
import { getInitiativeFormula } from './utils/getInitiativeFormula.js';
import { migrateActorData, migrateItemData } from './migrations/migrate.js';
import { PTAActor } from './actor/PTAActor.js';

Hooks.once('init', function() {
  console.info('[PTA] Initializing Lightweight PTA...');

  CONFIG.debug.pta = {
    logSync: false,
  }

  CONFIG.Actor.entityClass = PTAActor;

  game.settings.register('pta', 'statSyncInterval', {
    name: 'Stat Sync Interval',
    hint: `The number of seconds to wait before updating ${POKEMON_STRING} health values with their values in Pokemon Manager.`,
    scope: 'world',
    config: true,
    type: Number,
    range: {
      min: 5,
      max: 120,
      step: 1,
    },
    default: 20,
    onChange: restartPokemonStatSyncInterval,
  });

  game.settings.register('pta', 'rollDamageDice', {
    name: 'Roll Damage',
    hint: `If enabled, ${POKEMON_STRING} move macros will roll damage as well.`,
    scope: 'client',
    config: true,
    type: Boolean,
    default: true,
  });

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('pta', TrainerSheet, { types: ['trainer'], makeDefault: false });
  Actors.registerSheet('pta', PokemonManagerSheet, { types: ['pokemon'], makeDefault: true });
  Actors.registerSheet('pta', TokenSheet, { types: ['token'], makeDefault: false });
  
  Items.registerSheet('pta', FeatureSheet, { types: ['feature'], makeDefault: true });
  Items.registerSheet('pta', CarriableSheet, { types: ['carriable'], makeDefault: true });
  Items.registerSheet('pta', MoveSheet, { types: ['move'], makeDefault: true });
  
  Combat.prototype._getInitiativeFormula = getInitiativeFormula;

  game.pta = {
    statSyncIntervalId: undefined,
    macros: {
      rollMetronome,
      rollMove,
      rollSkill,
      rollStat,
    },
  };

  preloadTemplates();

  console.info('[PTA] Lightweight PTA initialized.');
});

Hooks.on('hotbarDrop', (_hotbar, { type, id }, position) => {
  if (type === 'Item') {
    handleItemDrop(game.items.get(id), position);
  }
});

Hooks.on('renderEntitySheetConfig', renderEntitySheetConfig);
Hooks.on('renderPokemonManagerSheet', handleRenderPokemonManagerSheet);

Hooks.once('ready', () => {
  restartPokemonStatSyncInterval();

  game.actors.forEach(migrateActorData);
  game.items.forEach(migrateItemData);

  game.actors.forEach(actor => {
    actor.items.forEach(migrateItemData);
  });
});
