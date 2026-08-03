import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Habit } from "./Habit";

export const HabitStack = defineEntity({
  name: "HabitStack",
  properties: {
    id: p.integer().primary().autoincrement(),
    predecessor: () =>
      p.manyToOne(Habit).inversedBy("stacksAsPredecessor"),
    /** At most one stack anchor per successor habit. */
    successor: () =>
      p.oneToOne(Habit).inversedBy("stackAsSuccessor").owner(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type HabitStack = InferEntity<typeof HabitStack>;
