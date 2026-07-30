import { defineEntity, p } from "@mikro-orm/core";
import { Habit } from "./Habit";

export const HabitCompletion = defineEntity({
  name: "HabitCompletion",
  properties: {
    id: p.integer().primary().autoincrement(),
    habit: () => p.manyToOne(Habit).inversedBy("completions"),
    completedAt: p.datetime().onCreate(() => new Date()),
  },
});
