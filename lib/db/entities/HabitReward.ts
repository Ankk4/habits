import { defineEntity, p } from "@mikro-orm/core";
import { HabitRewardKind } from "../../types/habit";
import { Habit } from "./Habit";

export const HabitReward = defineEntity({
  name: "HabitReward",
  properties: {
    id: p.integer().primary().autoincrement(),
    habit: () => p.manyToOne(Habit).inversedBy("rewards"),
    kind: p.enum([HabitRewardKind.POINTS] as const),
    payload: p.json().nullable(),
  },
});
