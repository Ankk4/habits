import { Habit, HabitType } from "../types/habit";

export const TYPE_META: Record<HabitType, { label: string; textClass: string }> = {
    positive: { label: "Positive", textClass: "text-emerald-500" },
    negative: { label: "Negative", textClass: "text-rose-500" },
    neutral: { label: "Neutral", textClass: "text-yellow-500" },
  };

export const getHabitMeta = (habit: Habit) => {
    return TYPE_META[habit.type];
}