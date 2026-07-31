import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { HabitType } from "../../types/habit";
import { HabitCompletion } from "./HabitCompletion";
import { HabitCue } from "./HabitCue";
import { HabitReward } from "./HabitReward";
import { HabitStack } from "./HabitStack";

export const Habit = defineEntity({
  name: "Habit",
  properties: {
    id: p.integer().primary().autoincrement(),
    name: p.string(),
    description: p.text(),
    type: p.enum([
      HabitType.POSITIVE,
      HabitType.NEGATIVE,
      HabitType.NEUTRAL,
    ] as const),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
    completions: () => p.oneToMany(HabitCompletion).mappedBy("habit"),
    cues: () => p.oneToMany(HabitCue).mappedBy("habit"),
    rewards: () => p.oneToMany(HabitReward).mappedBy("habit"),
    /** Stacks where this habit is the predecessor (leads into others). */
    stacksAsPredecessor: () =>
      p.oneToMany(HabitStack).mappedBy("predecessor"),
    /** Stack where this habit is the successor (comes after another). */
    stackAsSuccessor: () =>
      p.oneToOne(HabitStack).mappedBy("successor").nullable(),
  },
});

export type Habit = InferEntity<typeof Habit>;