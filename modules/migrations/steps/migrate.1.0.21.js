export function migrateActor(actor) {
  if(actor.data.type === 'trainer' && actor.data.data.stats.hp.bonus === undefined) {
    actor.update({
      data: {
        stats: {
          hp: {
            bonus: 0,
          },
          atk: {
            bonus: 0,
          },
          def: {
            bonus: 0,
          },
          spatk: {
            bonus: 0,
          },
          spdef: {
            bonus: 0,
          },
          spd: {
            bonus: 0,
          },
        }
      }
    });
  }
}