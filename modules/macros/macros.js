export async function rollMetronome() {
  const allMoves = game.items.filter(item => item.data.type === 'move');

  const {_id: id} = allMoves[Math.floor(Math.random() * allMoves.length)];

  const selectedMove = await game.items.get(id);

  await ChatMessage.create({
    content: `<div class="pokemon-move"><div class="pokemon-move-name">${ChatMessage.getSpeaker().alias} uses Metronome!</div></div>`,
    speaker: ChatMessage.getSpeaker(),
    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
  });

  console.log(selectedMove);

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
    hasValidAttackRoll: dice !== 0 && dieSize !== 0 && flat !== 0 && attackType !== 2 && game.settings.get('pta', 'rollDamageDice'),
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
      return 'game.pta.macros.rollMetronome()';
      
    default:
      return `game.pta.macros.rollMove('${move.name}', '${move.data.type}', '${move.data.frequency}', '${move.data.range}', '${move.data.damage}', ${move.data.accuracy}, ${move.data.attackType}, '${move.data.effects.replace(/'/g, '\\\'')}')`;
  }
}