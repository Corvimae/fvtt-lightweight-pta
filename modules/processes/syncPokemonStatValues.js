import { fetchPokemonData } from '../utils/pokemon-utils.js';

export function restartPokemonStatSyncInterval() {
  if (game.pta.statSyncIntervalId) clearInterval(game.pta.statSyncIntervalId);

  syncPokemonStatValues();

  game.pta.statSyncIntervalId = setInterval(
    syncPokemonStatValues,
    game.settings.get('pta', 'statSyncInterval') * 1000
  );
}

export async function syncPokemonStatValues() {
  if (CONFIG.debug.pta.logSync) console.info('[PTA] Syncing Pokemon stat values...');

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
          },
        },
        stats: {
          hp: {
            value: dataForSheet.stats.base.hp + dataForSheet.stats.added.hp,
          },
          atk: {
            value: dataForSheet.stats.base.attack + dataForSheet.stats.added.attack,
          },
          def: {
            value: dataForSheet.stats.base.defense + dataForSheet.stats.added.defense,
          },
          spatk: {
            value: dataForSheet.stats.base.spattack + dataForSheet.stats.added.spattack,
          },
          spdef: {
            value: dataForSheet.stats.base.spdefense + dataForSheet.stats.added.spdefense,
          },
          spd: {
            value: dataForSheet.stats.base.speed + dataForSheet.stats.added.speed,
          }
        },
        type1: dataForSheet.types[0].name,
        type2: dataForSheet.types[1].name,
        experience: dataForSheet.experience,
      },
    });
    actor.getActiveTokens().forEach(token => {
      token.update({
        'bar1.attribute': 'resources.health',
      });
    }); 
  });

  await Promise.all(pokemonWithSheets);
}