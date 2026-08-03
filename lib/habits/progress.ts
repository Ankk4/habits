import { HabitCompletionDto, HabitDto } from "../types/habit";
import { getStartOfDay } from "../utils/date";

const WEEK_DAYS = 7;

/** Returns an array of 7 objects, one for each day of the current calendar week (Mon–Sun). */
function weekCompletionDays(completions: HabitCompletionDto[]) {
  const completedDays = new Set(
    completions.map((c) => getStartOfDay(c.completedAt).getTime()),
  );
  const today = getStartOfDay(new Date());
  // getDay(): Sun=0 … Sat=6 → Monday-based offset 0…6
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  return Array.from({ length: WEEK_DAYS }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    const time = day.getTime();
    return {
      done: completedDays.has(time),
      isToday: time === today.getTime(),
    };
  });
}

export const habitProgress = (habit: HabitDto) => {
  const completions = habit.completions;

  const today = new Date().toDateString();
  const completedToday =
    completions.filter(
      (completion) => completion.completedAt.toDateString() === today,
    ).length > 0;

  return {
    completedToday,
    // TODO: implement real week/month/year windows (currently same as today)
    completedThisWeek: completedToday,
    completedThisMonth: completedToday,
    completedThisYear: completedToday,
    completedTotal: completions.length,
    weekDaysCompletion: weekCompletionDays(completions),
  };
};
