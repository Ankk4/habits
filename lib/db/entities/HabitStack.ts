import { defineEntity, p } from "@mikro-orm/core";
import { Habit } from "./Habit";

export const HabitStack = defineEntity({
  name: "HabitStack",
  properties: {
    id: p.integer().primary().autoincrement(),
    predecessor: () =>
      p.manyToOne(Habit).inversedBy("stacksAsPredecessor"),
    /** At most one stack anchor per successor habit. */
    successor: () =>
      p.manyToOne(Habit).inversedBy("stackAsSuccessor").unique(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});
