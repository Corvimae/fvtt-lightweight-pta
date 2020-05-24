export function getInitiativeFormula(combatant) {
  if (combatant.actor.data.type === 'trainer') return '@stats.spd.value * 100';

  return '@stats.spd.value';
}