export const preloadTemplates = async function() {
  const templatePaths = [
    'systems/pta/templates/apps/pokemonManagerLogin.html',
    'systems/pta/templates/macros/move.html',
    'systems/pta/templates/sheets/actors/token.html',
    'systems/pta/templates/sheets/actors/trainer.html',
    'systems/pta/templates/sheets/actors/partials/skills.html',
    'systems/pta/templates/sheets/actors/partials/background.html',
    'systems/pta/templates/sheets/actors/partials/features.html',
    'systems/pta/templates/sheets/actors/partials/inventory.html',
    'systems/pta/templates/sheets/items/carriable.html',
    'systems/pta/templates/sheets/items/feature.html',
    'systems/pta/templates/sheets/items/move.html',
  ]

  // Load the template parts
  return loadTemplates(templatePaths);
};
