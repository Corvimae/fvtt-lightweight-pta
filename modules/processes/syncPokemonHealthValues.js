import { fetchPokemonData, calculateMaxHealth } from '../utils/pokemon-utils.js';

export function restartPokemonHealthSyncInterval() {
  if (game.pta.healthSyncIntervalId) clearInterval(game.pta.healthSyncIntervalId);

  syncPokemonHealthValues();

  game.pta.healthSyncIntervalId = setInterval(
    syncPokemonHealthValues,
    game.settings.get('pta', 'healthSyncInterval') * 1000
  );
}

export async function syncPokemonHealthValues() {
  if (CONFIG.debug.pta.logSync) console.info('[PTA] Syncing Pokemon health values...');

  const pokemonWithSheets = game.actors.entries.filter(actor => actor.data.type === 'pokemon' && actor.data.data.sheetID);

  const pokemonDataRequests = pokemonWithSheets.map(async actor => await fetchPokemonData(actor.data.data.sheetID));
  const pokemonData = await Promise.all(pokemonDataRequests);
    
  const pokemonDataBySheetId = pokemonData.reduce((acc, data) => ({
    ...acc,
    [data.id]: data,
  }), {});
  
  pokemonWithSheets.map(async actor => {
    const dataForSheet = pokemonDataBySheetId[actor.data.data.sheetID];

    actor.update({
      data: {
        resources: {
          health: {
            value: dataForSheet.currentHealth,
            max: calculateMaxHealth(dataForSheet),
          },
        },
      },
    });
    actor.getActiveTokens().forEach(token => {
      token.update({
        displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        'bar1.attribute': 'resources.health',
      });
    }); 
  });

  await Promise.all(pokemonWithSheets);
}