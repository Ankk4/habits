import {
  HabitCompletionDto,
  HabitCompletionMode,
  HabitDto,
} from "../types/habit";
import { getStartOfDay } from "../utils/date";

const WEEK_DAYS = 7;

export type ScheduledSlotProgress = {
  time: string;
  done: boolean;
  completionId?: number;
};

export type HabitProgress = {
  completionMode: HabitCompletionMode;
  /** Completions logged today. */
  todayCount: number;
  /** Target for today; null = unlimited. */
  todayTarget: number | null;
  /** All required check-ins done for today. */
  completedToday: boolean;
  /** Still due on today's schedule (may already have partial progress). */
  isDueToday: boolean;
  completedThisWeek: boolean;
  completedThisMonth: boolean;
  completedThisYear: boolean;
  completedTotal: number;
  weekDaysCompletion: {
    done: boolean;
    isToday: boolean;
  }[];
  scheduledSlots: ScheduledSlotProgress[];
  /** Counter / once: can add another completion right now. */
  canIncrement: boolean;
  /** Next scheduled slot time still open today, if any. */
  nextOpenSlot?: string;
};

function completionsOnDate(
  completions: HabitCompletionDto[],
  date: Date,
): HabitCompletionDto[] {
  const key = date.toDateString();
  return completions.filter((c) => c.completedAt.toDateString() === key);
}

/** Returns an array of 7 objects, one for each day of the current calendar week (Mon–Sun). */
function weekCompletionDays(completions: HabitCompletionDto[]) {
  const completedDays = new Set(
    completions.map((c) => getStartOfDay(c.completedAt).getTime()),
  );
  const today = getStartOfDay(new Date());
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

function dayFullyComplete(
  habit: HabitDto,
  completions: HabitCompletionDto[],
): boolean {
  const { schedule } = habit;
  const count = completions.length;

  switch (schedule.completionMode) {
    case HabitCompletionMode.SCHEDULED: {
      const slots = schedule.scheduledTimes;
      if (slots.length === 0) return count > 0;
      return slots.every((time) =>
        completions.some((c) => c.slotTime === time),
      );
    }
    case HabitCompletionMode.COUNTER: {
      if (schedule.dailyTarget == null) return false;
      return count >= schedule.dailyTarget;
    }
    default:
      return count >= 1;
  }
}

export function habitProgress(habit: HabitDto, date = new Date()): HabitProgress {
  const todayCompletions = completionsOnDate(habit.completions, date);
  const { schedule } = habit;
  const weekDaysCompletion = weekCompletionDays(habit.completions);

  let scheduledSlots: ScheduledSlotProgress[] = [];
  let todayTarget: number | null = 1;
  let canIncrement = false;
  let nextOpenSlot: string | undefined;

  switch (schedule.completionMode) {
    case HabitCompletionMode.SCHEDULED: {
      todayTarget = schedule.scheduledTimes.length || null;
      scheduledSlots = schedule.scheduledTimes.map((time) => {
        const match = todayCompletions.find((c) => c.slotTime === time);
        return {
          time,
          done: Boolean(match),
          completionId: match?.id,
        };
      });
      nextOpenSlot = scheduledSlots.find((s) => !s.done)?.time;
      canIncrement = Boolean(nextOpenSlot);
      break;
    }
    case HabitCompletionMode.COUNTER: {
      todayTarget = schedule.dailyTarget ?? null;
      canIncrement =
        todayTarget == null || todayCompletions.length < todayTarget;
      break;
    }
    default: {
      todayTarget = 1;
      canIncrement = todayCompletions.length < 1;
      break;
    }
  }

  const completedToday = dayFullyComplete(habit, todayCompletions);
  const completedThisWeek = weekDaysCompletion.some(
    (day) => day.isToday && day.done,
  );

  return {
    completionMode: schedule.completionMode,
    todayCount: todayCompletions.length,
    todayTarget,
    completedToday,
    isDueToday: !completedToday,
    completedThisWeek,
    completedThisMonth: completedThisWeek,
    completedThisYear: completedThisWeek,
    completedTotal: habit.completions.length,
    weekDaysCompletion,
    scheduledSlots,
    canIncrement,
    nextOpenSlot,
  };
}
