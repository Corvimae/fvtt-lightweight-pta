export function getStatForSkill(actor, skillName) {
  const match = Object.entries(actor.data.data.skills).find(([_stat, value]) => (
    value.items[skillName] !== undefined
  ));

  return match?.[0];
}

export function calculateStatModifier(actor, stat) {
  const statData = actor.data.data.stats[stat];

  return statData.value < 10 ? -10 + statData.value : Math.floor((statData.value - 10) / 2);
}

export function calculateSkillModifier(actor, skillName) {
  actor.prepareData();
  
  const data = actor.data.data;

  const associatedStat = getStatForSkill(actor, skillName);
  const statModifier = calculateStatModifier(actor, associatedStat);
  const skillData = data.skills[associatedStat].items[skillName];
  
  return skillData.trained ? 2 + statModifier : Math.min(statModifier, 1 + data.stab);
}