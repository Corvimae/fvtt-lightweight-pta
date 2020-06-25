import { migrateActor as migrateActor1_0_5 } from './steps/migrate.1.0.5.js'
import { migrateActor as migrateActor1_0_8 } from './steps/migrate.1.0.8.js'
import { migrateItem as migrateItem1_1_4 } from './steps/migrate.1.1.4.js'

export function migrateActorData(actor) {
  migrateActor1_0_5(actor);
  migrateActor1_0_8(actor);
}

export function migrateItemData(item) {
  migrateItem1_1_4(item);
}