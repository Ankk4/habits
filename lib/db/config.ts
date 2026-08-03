import { Habit } from "./entities/Habit";
import { HabitCompletion } from "./entities/HabitCompletion";
import { HabitCue } from "./entities/HabitCue";
import { HabitReward } from "./entities/HabitReward";
import { HabitStack } from "./entities/HabitStack";
import { Item } from "./entities/Item";
import { RewardOpenLog } from "./entities/RewardOpenLog";

export default {
  database: {
    path: "habits.db",
  },
  entities: [
    Item,
    RewardOpenLog,
    Habit,
    HabitCompletion,
    HabitCue,
    HabitReward,
    HabitStack,
  ],
};
