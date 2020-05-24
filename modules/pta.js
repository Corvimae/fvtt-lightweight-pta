import { preloadTemplates } from './preload/templates.js';
import TrainerSheet from './actor/TrainerSheet.js';
import FeatureSheet from './item/FeatureSheet.js';
import CarriableSheet from './item/CarriableSheet.js';
import MoveSheet from './item/MoveSheet.js';
import { rollMove, rollMetronome } from './macros/macros.js';
import { handleItemDrop } from './hooks/handleItemDrop.js';
import PokemonManagerSheet from './actor/PokemonManagerSheet.js';
import { renderEntitySheetConfig } from './hooks/handleRenderEntitySheetConfig.js';

Hooks.once('init', function() {
  console.info('Initializing Lightweight PTA...');

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('pta', TrainerSheet, { types: ['trainer'], makeDefault: true });
  Actors.registerSheet('pta', PokemonManagerSheet, { types: ['pokemon'], makeDefault: false });
  
  Items.registerSheet('pta', FeatureSheet, { types: ['feature'], makeDefault: true });
  Items.registerSheet('pta', CarriableSheet, { types: ['carriable'], makeDefault: true });
  Items.registerSheet('pta', MoveSheet, { types: ['move'], makeDefault: true });
  
  game.pokemon = {
    rollMetronome,
    rollMove
  };

  preloadTemplates();

  console.info('Lightweight PTA initialized.');
});

Hooks.on('hotbarDrop', (_hotbar, { type, id }, position) => {
  if (type === 'Item') {
    handleItemDrop(game.items.get(id), position);
  }
});

Hooks.on('renderEntitySheetConfig', renderEntitySheetConfig);
