export function migrateActor(actor) {
  if(actor.data.type === 'pokemon' && !actor.data.data.type1) {
    actor.update({
      data: {
        type1: 'None',
        type2: 'None',
      }
    });
  }
}