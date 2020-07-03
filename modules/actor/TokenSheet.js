import { handleChangeInputDelta } from "../utils/sheetUtils.js";

export default class TokenSheet extends ActorSheet {
  constructor(...args) {
    super(...args);
  }

  static get defaultOptions() {
    return mergeObject(
      super.defaultOptions,
      {
        classes: ["pta", "sheet", "actor", "token"],
        width: 600,
        height: 130,
      },
    );
  }

  get template() {
    return 'systems/pta/templates/sheets/actors/token.html';
  }

  activateListeners(html) {
    if (this.isEditable) {
      const handleNumericChangeEvent = event => handleChangeInputDelta(this.actor.data, event);

      html.find('input[data-dtype="Number"]').change(handleNumericChangeEvent);
    }

    super.activateListeners(html);
  }

  getData() {  
    return {
      editable: this.isEditable,
      owner: this.entity.owner,
      data: this.actor.data.data,
    };
  }
}