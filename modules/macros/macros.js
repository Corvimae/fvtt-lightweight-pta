import { syncPokemonStatValues } from '../processes/syncPokemonStatValues.js';
import { calculateCombatStageMultiplier } from '../utils/pokemonUtils.js';
import { getStatForSkill, calculateSkillModifier, calculateStatModifier } from '../utils/trainerUtils.js';
import { SKILL_NAMES, STAT_FULL_NAMES } from '../utils/constants.js';

export async function rollMetronome() {
  const allMoves = game.items.filter(item => item.data.type === 'move');

  const {_id: id} = allMoves[Math.floor(Math.random() * allMoves.length)];

  const selectedMove = await game.items.get(id);

  await ChatMessage.create({
    content: `<div class="pokemon-move"><div class="pokemon-move-name">${ChatMessage.getSpeaker().alias} uses Metronome!</div></div>`,
    speaker: ChatMessage.getSpeaker(),
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
  });

  game.pta.macros.rollMove(
    selectedMove.data.name,
    selectedMove.data.data.type,
    selectedMove.data.data.frequency,
    selectedMove.data.data.range,
    selectedMove.data.data.damage,
    selectedMove.data.data.accuracy,
    selectedMove.data.data.attackType,
    selectedMove.data.data.effects.replace(/'/g, '\\\''),
  );
}

export async function rollMove(name, type, frequency, range, damage, accuracy, attackType, effects, addedDamage = 0) {
  const speaker = ChatMessage.getSpeaker();

  let actor = game.actors.get(speaker.actor);

  try {
    await syncPokemonStatValues(actor.data.data.sheetID);
  } catch (error) {
    ui.notifications.warn('Unable to sync Pokemon data. Move damage may not be correct.');
    console.warn('[PTA] Unable to sync Pokemon data for move macro', error);
  }

  // Get updated actor data.
  actor = game.actors.get(speaker.actor);

  const accuracyCheck = new Die({ faces: 20, number: 1}).evaluate();
  
  const [_, dice, dieSize, flat] = /([0-9]+)d([0-9]+)\s*\+\s*([0-9]+)/.exec(damage) ?? [0, 0, 0, 0];

  const content = await renderTemplate('/systems/pta/templates/macros/move.html', {
    name,
    type,
    frequency,
    range,
    damage,
    critDamage: `${dice * 2}d${dieSize} + ${flat * 2}`,
    accuracy,
    effects,
    addedDamage,
    attackTypeName: attackType === 0 ? 'Physical' : 'Special',
    hasEffects: effects !== '-' && effects.trim().length > 0,
    hasValidAttackRoll: dice !== 0 && dieSize !== 0 && flat !== 0 && attackType !== 2,
    shouldRollDamage: game.settings.get('pta', 'rollDamageDice'),
    hasAccuracyCheck: range.indexOf('No Target') === -1 || attackType !== 2,
    accuracyCheck: accuracyCheck.rolls[0].result,
    relevantStatValue: attackType === 0 ? '@stats.atk.value' : '@stats.spatk.value',
    combatStageMultiplier: calculateCombatStageMultiplier(attackType === 0 ? actor.data.data.stats.atk.combatStages.value : actor.data.data.stats.spatk.combatStages.value),
    isCrit: accuracyCheck.rolls[0].result === 20,
    isStab: actor.data.data.type1 === type || actor.data.data.type2 === type,
    speaker,
  });

  
  await ChatMessage.create({
    content,
    speaker: ChatMessage.getSpeaker(),
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
  });
}

export function buildCommandForMove(move) {
  switch(move.name) {
    case 'Metronome':
      return 'game.pta.macros.rollMetronome()';
      
    default:
      return `game.pta.macros.rollMove('${move.name}', '${move.data.type}', '${move.data.frequency}', '${move.data.range}', '${move.data.damage}', ${move.data.accuracy}, ${move.data.attackType}, '${move.data.effects.replace(/'/g, '\\\'')}')`;
  }
}

export async function rollSkill(actorId, skillName) {
  const actor = game.actors.get(actorId);

  const modifierValue = calculateSkillModifier(actor, skillName);

  await ChatMessage.create({
    content: `<div class="larger-chat-message">${actor.name} attempts ${SKILL_NAMES[skillName]}... [[1d20 + ${modifierValue}]]!</div>`,
    speaker: ChatMessage.getSpeaker({ actor }),
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
  });
}

export async function rollStat(actorId, statName) {
  const actor = game.actors.get(actorId);

  const modifierValue = calculateStatModifier(actor, statName);

  await ChatMessage.create({
    content: `<div class="larger-chat-message">${actor.name} rolls ${STAT_FULL_NAMES[statName]}... [[1d20 + ${modifierValue}]]!</div>`,
    speaker: ChatMessage.getSpeaker({ actor }),
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
  });
}