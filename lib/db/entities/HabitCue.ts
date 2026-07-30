import { defineEntity, p } from "@mikro-orm/core";
import { HabitCueKind } from "../../types/habit";
import { Habit } from "./Habit";

export const HabitCue = defineEntity({
  name: "HabitCue",
  properties: {
    id: p.integer().primary().autoincrement(),
    habit: () => p.manyToOne(Habit).inversedBy("cues"),
    kind: p.enum([HabitCueKind.TEXT] as const),
    payload: p.json().nullable(),
  },
});
