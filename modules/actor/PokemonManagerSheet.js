import { fetchPokemonData } from "../utils/pokemon-utils.js";
import { createMoveAtHotbarPosition } from '../hooks/handleItemDrop.js';

export default class PokemonManagerSheet extends ActorSheet {
  constructor(...args) {
    super(...args);
  }

  static get defaultOptions() {
    return mergeObject(
      super.defaultOptions,
      {
        classes: ["pta", "sheet", "actor", "pokemon-manager"],
        width: 600,
        height: 350,
      },
    );
  }

  get template() {
    return 'systems/pta/templates/sheets/actors/pokemonManager.html';
  }

  activateListeners(html) {
    html.find('.add-moves-to-hotbar').click(this.handleAddMovesToHotbar.bind(this));
  }

  getData() {  
    const hasAttachedSheet = this.actor.data.data.sheetID !== 0;

    if (hasAttachedSheet) {
      this.position.width = Math.floor(document.body.offsetWidth * 0.8);
      this.position.height = Math.floor(document.body.offsetHeight * 0.8);
      this.position.top = Math.floor(document.body.offsetHeight * 0.1);
      this.position.left = Math.floor(document.body.offsetWidth * 0.1);
    }

    return {
      editable: this.isEditable,
      owner: this.entity.owner,
      actor: this.actor,
      data: {
        ...this.actor.data.data,
        derived: {
          hasAttachedSheet,
        },
      },
    };
  }

  async handleAddMovesToHotbar(event) {
    event.preventDefault();

    const pokemonData = await fetchPokemonData(this.actor.data.data.sheetID);

    pokemonData.moves.forEach((move, index) => {
      const relevantMoveItem = game.items.find(item => item.data.type === 'move' && item.data.flags.pta?.dbId === move.definition.id);

      console.log(relevantMoveItem);
      if (relevantMoveItem) createMoveAtHotbarPosition(relevantMoveItem, index + 1);
    });
  }
}