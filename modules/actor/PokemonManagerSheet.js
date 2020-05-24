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
}