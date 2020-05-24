import { STAT_SHORT_NAMES, STAT_FULL_NAMES, SKILL_NAMES } from '../utils/constants.js';
import { getTagsForItem } from '../utils/items.js';

export default class TrainerSheet extends ActorSheet {
  constructor(...args) {
    super(...args);
  }

  static get defaultOptions() {
    return mergeObject(
      super.defaultOptions,
      {
        classes: ["pta", "sheet", "actor", "trainer"],
        width: 672,
        height: 736,
        tabs: [
          {
            navSelector: ".tabs",
            contentSelector: ".sheet-content",
            initial: "skills"
          }
        ]
      }
    );
  }

  get template() {
    return 'systems/pta/templates/sheets/actors/trainer.html';
  }

  getData() {        
    return {
      editable: this.isEditable,
      owner: this.entity.owner,
      actor: this.actor,
      data: this.insertDerivedData(this.actor.data.data),
    };
  }

  activateListeners(html) {
    html.find('.item .item-list-name').click(this.handleItemSummary.bind(this));

    if (this.isEditable) {
      html.find('.trained-toggle').click(this.handleSkillTrainedToggle.bind(this));

      html.find('.add-feature').click(this.handleAddFeature.bind(this));

      html.find('.edit-item').click(this.handleEditItem.bind(this));

      html.find('.delete-item').click(this.handleDeleteItem.bind(this));

      html.find('.item-uses input').click(ev => ev.target.select()).change(this.handleUsesChange.bind(this));

      html.find('.add-class').click(this.handleAddClass.bind(this));

      html.find('.restore-feature-uses').click(this.handleRestoreFeatureUses.bind(this));
      
      html.find('.add-carriable').click(this.handleAddCarriable.bind(this));
    }

    if(this.actor.owner) {
      html.find('.skill-name.rollable:not(.disabled)').click(this.handleRollSkill.bind(this));
    }

    super.activateListeners(html);
  }

  insertDerivedData(data) {
    return this.processItems(this.insertDerivedSkillData(this.insertDerivedStatData({
      ...data,
      derived: {
        stab: Math.max(1, Math.floor(data.level / 5)),
        maxHP: data.stats.hp.value * 4 + data.level * 4,
      },
    })));
  }

  processItems(data) {
    const items = this.actor.items.map(i => {
      i.data.labels = i.labels;

      return i.data;
    });

    const features = items.filter(item => item.type === 'feature').reduce((acc, feature) => {
      const featureClass = feature.data.trainerClass?.trim().length > 0 ? feature.data.trainerClass : '(No class)';    
      return {
        ...acc,
        [featureClass]: [
          ...(acc[featureClass] ?? []),
          {
            ...feature,
            data: {
              ...feature.data,
              maxUses: this.calculateFeatureUses(feature, data),
              leagueLegalLabel: feature.data.isLeagueLegal ? 'Legal' : 'Illegal'
            },
          },
        ],
      };
    }, {});

    const carriables = items.filter(item => item.type === 'carriable');

    return {
      ...data,
      features,
      carriables,
    };
  }

  calculateFeatureUses(feature, actorData) {
    return feature.data.additionalUseLevelCount > 0 ? 1 + Math.floor(actorData.level / feature.data.additionalUseLevelCount) : 1;
  }

  insertDerivedStatData(data) {
    return {
      ...data,
      stats: Object.entries(data.stats).reduce((acc, [stat, statData]) => {
        const modifier = statData.value < 10 ? -10 + statData.value : Math.floor((statData.value - 10) / 2);

        return {
          ...acc,
          [stat]: {
            ...statData,
            modifier,
            modifierCSSClass: this.getModifierCSSClass(modifier),
            shortName: STAT_SHORT_NAMES[stat],
          },
        };
      }, {}),
    };
  }

  insertDerivedSkillData(data) {
    return {
      ...data,
      skills: Object.entries(data.skills).reduce((acc, [stat, statSkillData]) => ({
        ...acc,
        [stat]: {
          ...statSkillData,
          statName: STAT_FULL_NAMES[stat],
          items: Object.entries(data.skills[stat].items).reduce((acc, [skill, skillData]) => ({
            ...acc,
            [skill]: {
              ...skillData,
              icon: `<i class="${skillData.trained ? 'fas fa-check' : 'far fa-circle'}"></i>`,
              modifier: skillData.trained ? 2 + data.stats[stat].modifier : Math.min(data.stats[stat].modifier, data.derived.stab),
              skillName: SKILL_NAMES[skill],
            },
          }), {}),
        },
      }), {}),
    };
  }

  getModifierCSSClass(modifier) {
    if (modifier <= -4) return 'very-low';
    if (modifier < 0) return 'low';
    if (modifier === 0) return 'neutral'
    if (modifier >= 4)  return 'very-high';
  
    return 'high'
  }

  getStatForSkill(skillName) {
    const match = Object.entries(this.actor.data.data.skills).find(([_stat, value]) => (
      value.items[skillName] !== undefined
    ));

    return match?.[0];
  }

  handleSkillTrainedToggle(event) {
    event.preventDefault();

    const skill = event.currentTarget.parentElement.getAttribute('data-skill');
    const associatedStat = this.getStatForSkill(skill);
    const currentTrainedValue = this.actor.data.data.skills[associatedStat].items[skill].trained;

    this.actor.update({
      [`data.skills.${associatedStat}.items.${skill}.trained`]: !currentTrainedValue,
    });
  }

  async handleAddFeature(event) {
    event.preventDefault();

    const trainerClass = event.currentTarget.parentElement.getAttribute('data-trainerclass');

    return await this.actor.createEmbeddedEntity("OwnedItem", {
      name: 'New Feature',
      type: 'feature',
      data: {
        trainerClass,
      },
    }, { renderSheet: true });
  }

  async handleAddClass(event) {
    event.preventDefault();

    return await this.actor.createEmbeddedEntity("OwnedItem", {
      name: 'New Feature',
      type: 'feature',
      data: {
        trainerClass: 'New Class',
      },
    }, { renderSheet: true });
  }

  handleEditItem(event) {
    event.preventDefault();

    const li = event.currentTarget.closest(".item");

    const item = this.actor.getOwnedItem(li.dataset.itemId);

    item.sheet.render(true);
  }
  
  handleDeleteItem(event) {
    event.preventDefault();

    const li = event.currentTarget.closest(".item");

    this.actor.deleteOwnedItem(li.dataset.itemId);
  }

  async handleRollSkill(event) {
    event.preventDefault();

    const skill = event.currentTarget.parentElement.getAttribute('data-skill');
    const associatedStat = this.getStatForSkill(skill);
    const modifierValue = this.getData().data.skills[associatedStat].items[skill].modifier;

    await ChatMessage.create({
      content: `<div class="larger-chat-message">${this.actor.name} attempts ${SKILL_NAMES[skill]}... [[1d20 + ${modifierValue}]]!</div>`,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    });
  }

  handleUsesChange(event) {
    event.preventDefault();

    const itemId = event.currentTarget.closest('.item').getAttribute('data-item-id');
    const item = this.actor.getOwnedItem(itemId);
    const uses = Math.clamped(0, parseInt(event.target.value, 10), this.calculateFeatureUses(item.data, this.actor.data.data));

    event.target.value = uses;

    return item.update({ 'data.uses': uses });
  }

  handleRestoreFeatureUses(event) {
    event.preventDefault();

    Object.values(this.getData().data.features)
      .flatMap(x => x)
      .filter(feature => feature.data.hasUses)
      .forEach(feature => {
        this.actor.getOwnedItem(feature._id).update({ 'data.uses': feature.data.maxUses });
      });
  }

  async handleAddCarriable(event) {
    event.preventDefault();

    return await this.actor.createEmbeddedEntity('OwnedItem', {
      name: 'New Item',
      type: 'carriable',
    }, { renderSheet: true });
  }
  
  handleItemSummary(event) {
    event.preventDefault();
    let li = $(event.currentTarget).parents('.item');
    let item = this.actor.getOwnedItem(li.data('item-id'));

    // Toggle summary
    if (li.hasClass('expanded')) {
      let summary = li.children('.item-summary');

      summary.slideUp(200, () => summary.remove());
    } else {
      let div = $(`<div class="item-summary">${item.data.data.description}</div>`);
      let props = $(`<div class="item-properties"></div>`);

      const tags = getTagsForItem(item);

      tags.forEach(p => props.append(`<span class="tag">${p}</span>`));
      div.append(props);
      li.append(div.hide());
      div.slideDown(200);
    }

    li.toggleClass("expanded");
  }
}