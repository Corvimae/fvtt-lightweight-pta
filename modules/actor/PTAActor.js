import { calculateLevel } from '../utils/pokemon-utils.js';

export class PTAActor extends Actor {
  prepareData() {
    super.prepareData();

    if (this.data.type === 'trainer') this.prepareTrainerData();
    if (this.data.type === 'pokemon') this.preparePokemonData();
  }

  prepareTrainerData() {
    const trainerData = this.data.data;
    
    trainerData.resources.health.max = trainerData.stats.hp.value * 4 + trainerData.level * 4;

    trainerData.stab = Math.floor(trainerData.level / 5);
  }

  preparePokemonData() {
    const pokemonData = this.data.data;

    pokemonData.level = calculateLevel(pokemonData.experience);
    pokemonData.stab = Math.floor(pokemonData.level / 5);

    pokemonData.resources.health.max = pokemonData.level + 10 + pokemonData.stats.hp.value * 3
  }
}