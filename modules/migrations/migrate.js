import { migrateActor as migrateActor1_0_5 } from './steps/migrate.1.0.5.js'
import { migrateActor as migrateActor1_0_8 } from './steps/migrate.1.0.8.js'
import { migrateItem as migrateItem1_0_14 } from './steps/migrate.1.0.14.js'
import { migrateActor as migrateActor1_0_21 } from './steps/migrate.1.0.21.js'

export function migrateActorData(actor) {
  migrateActor1_0_5(actor);
  migrateActor1_0_8(actor);
  migrateActor1_0_21(actor);
}

export function migrateItemData(item) {
  migrateItem1_0_14(item);
}