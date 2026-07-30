import config from "./config";
import { MikroORM } from "@mikro-orm/sqlite";
import { Habit } from "./entities/Habit";
import { HabitCompletion } from "./entities/HabitCompletion";
import { HabitCue } from "./entities/HabitCue";
import { HabitReward } from "./entities/HabitReward";
import { HabitStack } from "./entities/HabitStack";

export async function createClient(): Promise<MikroORM> {
  return await MikroORM.init({
    entities: [Habit, HabitCompletion, HabitCue, HabitReward, HabitStack],
    dbName: config.database.path,
  });
}
