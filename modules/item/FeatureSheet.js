import { handleChangeInputDelta } from "../utils/sheetUtils.js";

export default class FeatureSheet extends ItemSheet {
  constructor(...args) {
    super(...args);
  }

  static get defaultOptions() {
    return mergeObject(
      super.defaultOptions,
      {
        classes: ["pta", "sheet", "item", "feature"],
        width: 500,
        height: 550,
        tabs: [
          {
            navSelector: ".tabs",
            contentSelector: ".sheet-content",
            initial: "description"
          }
        ]
      },
    );
  }

  get template() {
    return 'systems/pta/templates/sheets/items/feature.html';
  }

  getData() {        
    return {
      editable: this.isEditable,
      owner: this.entity.owner,
      item: this.item,
      data: this.insertDerivedData(this.item.data.data),
    };
  }

  activateListeners(html) {
    if (this.isEditable) {
      const handleNumericChangeEvent = event => handleChangeInputDelta(this.item.data, event);

      html.find('input[data-dtype="Number"]').change(handleNumericChangeEvent);
    }

    super.activateListeners(html);
  }

  insertDerivedData(data) {
    return {
      ...data,
      derived: {
        leagueLegalLabel: data.isLeagueLegal ? 'League Legal' : 'League Illegal',
        triggerOrTargetLabel: data.isReaction ? 'Trigger' : 'Target',
      },
    };
  }

}