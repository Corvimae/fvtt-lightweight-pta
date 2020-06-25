import { fetchPokemonData } from "../utils/pokemon-utils.js";

const UPDATE_DELAY = 1000 * 30; // 30 seconds

export async function handleRenderPokemonManagerSheet(sheet, _element, entity) {
  const actor = game.actors.get(entity.data.id);

  if (Date.now() - actor.data.flags.pta?.lastUpdated < UPDATE_DELAY) return;

  console.info(`[PTA] Syncing stats for ${actor.name}...`);

  const pokemonID = actor.data.data.sheetID;

  if (pokemonID === 0) return;

  const pokemonData = await fetchPokemonData(pokemonID);

  await actor.update({
    flags: {
      'pta.lastUpdated': Date.now(),
    },
    data: {
      stats: {
        'hp.value': pokemonData.stats.base.hp + pokemonData.stats.added.hp,
        'atk.value': pokemonData.stats.base.attack + pokemonData.stats.added.attack,
        'def.value': pokemonData.stats.base.defense + pokemonData.stats.added.defense,
        'spatk.value': pokemonData.stats.base.spattack + pokemonData.stats.added.spattack,
        'spdef.value': pokemonData.stats.base.spdefense + pokemonData.stats.added.spdefense,
        'spd.value': pokemonData.stats.base.speed + pokemonData.stats.added.speed,
      }
    }
  })
}