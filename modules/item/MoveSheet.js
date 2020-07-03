import { handleChangeInputDelta } from "../utils/sheetUtils.js";

export default class MoveSheet extends ItemSheet {
  constructor(...args) {
    super(...args);
  }

  static get defaultOptions() {
    return mergeObject(
      super.defaultOptions,
      {
        classes: ["pta", "sheet", "item", "move"],
        width: 600,
        height: 350,
      },
    );
  }

  get template() {
    return 'systems/pta/templates/sheets/items/move.html';
  }

  getData() {        
    return {
      editable: this.isEditable,
      owner: this.entity.owner,
      item: this.item,
      data: {
        ...this.item.data.data,
        derived: {
          damageTypeName: this.item.data.data.attackType === 0 ? 'Attack' : (this.item.data.data.attackTime === 1 ? 'Special' : 'Status'),
        }
      },
    };
  }

  activateListeners(html) {
    if (this.isEditable) {
      const handleNumericChangeEvent = event => handleChangeInputDelta(this.item.data, event);

      html.find('input[data-dtype="Number"]').change(handleNumericChangeEvent);
    }

    super.activateListeners(html);
  }
}