export function migrateActor(actor) {
  if(actor.data.type === 'trainer' && actor.data.data.stats.hp.hpMaxBonus === undefined) {
    actor.update({
      data: {
        stats: {
          hp: {
            hpMaxBonus: 0,
          },
        }
      }
    });
  }
}