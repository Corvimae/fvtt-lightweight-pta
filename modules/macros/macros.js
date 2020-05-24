export async function rollMetronome() {
  const compendium = game.packs.find(x => x.collection === 'world.pokemon-moves');
  const options = await compendium.getData();

  const {_id: id} = options.index[Math.floor(Math.random() * options.index.length)];

  const moveMacro = await compendium.getEntity(id);

  await ChatMessage.create({
    content: `<div class="pokemon-move"><div class="pokemon-move-name">${ChatMessage.getSpeaker().alias} uses Metronome!</div></div>`,
    speaker: ChatMessage.getSpeaker(),
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
  });

  moveMacro.execute();
}

export async function rollMove(name, type, frequency, range, damage, accuracy, attackType, effects) {
  const accuracyCheck = new Die(20);
  
  accuracyCheck.roll(1);

  const [_, dice, dieSize, flat] = /([0-9]+)d([0-9]+)\s*\+\s*([0-9]+)/.exec(damage) ?? [0, 0, 0, 0];

  const content = await renderTemplate('/systems/pta/templates/macros/move.html', {
    name,
    type,
    frequency,
    range,
    damage,
    critDamage:`${dice * 2}d${dieSize} + ${flat * 2}`,
    accuracy,
    effects,
    attackTypeName: attackType === 0 ? 'Physical' : 'Special',
    hasAccuracyRoll: range.indexOf('No Target') === -1,
    hasEffects: effects !== '-' && effects.trim().length > 0,
    hasValidAttackRoll: dice !== 0 && dieSize !== 0 && flat !== 0 && attackType !== 2,
    hasAccuracyCheck: range.indexOf('No Target') === -1,
    accuracyCheck: accuracyCheck.results[0],
    isCrit: accuracyCheck.results[0] === 20,
    speaker: ChatMessage.getSpeaker(),
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
      return 'game.pokemon.rollMetronome()';
      
    default:
      return `game.pokemon.rollMove('${move.name}', '${move.type}', '${move.frequency}', '${move.range}', '${move.damage}', ${move.accuracy}, ${move.attackType}, '${move.effects}')`;
  }
}