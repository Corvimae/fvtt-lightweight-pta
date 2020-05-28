export function migrateActor(actor) {
  if(actor.data.type === 'trainer' && !actor.data.data.skills.hp) {
    actor.update({
      data: {
        skills: {
          hp: {
            items: {
              breathless: {
                trained: false
              },
              fasting: {
                trained: false
              },
              endurance: {
                trained: false
              },
              resistant: {
                trained: false
              }
            }
          }
        }
      }
    });
  }
}