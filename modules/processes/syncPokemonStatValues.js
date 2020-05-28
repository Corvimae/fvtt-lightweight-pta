import { fetchPokemonData } from '../utils/pokemon-utils.js';

export function restartPokemonStatSyncInterval() {
  if (game.pta.statSyncIntervalId) clearInterval(game.pta.statSyncIntervalId);

  syncAllPokemonStatValues();

  game.pta.statSyncIntervalId = setInterval(
    syncAllPokemonStatValues,
    game.settings.get('pta', 'statSyncInterval') * 1000
  );
}

export async function syncAllPokemonStatValues() {
  if (CONFIG.debug.pta.logSync) console.info('[PTA] Syncing Pokemon stat values...');

  const pokemonWithSheets = game.actors.entries.filter(actor => actor.data.type === 'pokemon' && actor.data.data.sheetID);

  const pokemonData = await fetch(`https://pokemon.maybreak.com/api/v2/pokemon/mass?ids=${pokemonWithSheets.map(actor => actor.data.data.sheetID).join(',')}`);
    
  const pokemonDataBySheetId = (await pokemonData.json()).reduce((acc, data) => ({
    ...acc,
    [data.id]: data,
  }), {});
  
  pokemonWithSheets.map(async actor => await updatePokemonStatValues(actor, pokemonDataBySheetId[actor.data.data.sheetID]));

  await Promise.all(pokemonWithSheets);
}

export async function syncPokemonStatValues(sheetID) {
  const actor = game.actors.entries.find(actor => actor.data.type === 'pokemon' && actor.data.data.sheetID === sheetID);
  
  if (!actor) {
    console.info(`[PTA] Unable to sync sheet data with ID ${sheetID}: sheet does not exist.`);

    return;
  }

  const pokemonData = await fetchPokemonData(actor.data.data.sheetID);

  await updatePokemonStatValues(actor, pokemonData);
}

export async function updatePokemonStatValues(actor, sheetData) {
  await actor.update({
    data: {
      resources: {
        health: {
          value: sheetData.currentHealth,
        },
      },
      stats: {
        hp: {
          value: sheetData.stats.base.hp + sheetData.stats.added.hp,
        },
        atk: {
          value: sheetData.stats.base.attack + sheetData.stats.added.attack,
          combatStages: {
            value: sheetData.stats.combatStages.attack,
          },
        },
        def: {
          value: sheetData.stats.base.defense + sheetData.stats.added.defense,
          combatStages: {
            value: sheetData.stats.combatStages.defense,
          },
        },
        spatk: {
          value: sheetData.stats.base.spattack + sheetData.stats.added.spattack,
          combatStages: {
            value: sheetData.stats.combatStages.spattack,
          },
        },
        spdef: {
          value: sheetData.stats.base.spdefense + sheetData.stats.added.spdefense,
          combatStages: {
            value: sheetData.stats.combatStages.spdefense,
          },
        },
        spd: {
          value: sheetData.stats.base.speed + sheetData.stats.added.speed,
        }
      },
      type1: sheetData.types[0].name,
      type2: sheetData.types[1].name,
      experience: sheetData.experience,
    },
  });

  actor.getActiveTokens().forEach(token => {
    token.update({
      'bar1.attribute': 'resources.health',
    });
  }); 
}