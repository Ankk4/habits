import {
  HabitCadence,
  type HabitDto,
} from "../types/habit";
import { habitProgress } from "./progress";
import { isScheduledToday, sortHabitsBySchedule } from "./schedule";

export type HabitFilter =
  | "all"
  | "today"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export function filterHabits(
  habits: HabitDto[],
  filter: HabitFilter,
): HabitDto[] {
  let filtered = habits;

  if (filter !== "all") {
    filtered = habits.filter((habit) => {
      const progress = habitProgress(habit);
      const { cadence } = habit.schedule;

      switch (filter) {
        case "today":
          return isScheduledToday(habit.schedule) && progress.isDueToday;
        case "daily":
          return cadence === HabitCadence.DAILY && progress.isDueToday;
        case "weekly":
          return cadence === HabitCadence.WEEKLY && !progress.completedThisWeek;
        case "monthly":
          return cadence === HabitCadence.MONTHLY && !progress.completedThisMonth;
        case "yearly":
          return cadence === HabitCadence.YEARLY && !progress.completedThisYear;
        default:
          return true;
      }
    });
  }

  return sortHabitsBySchedule(filtered);
}
