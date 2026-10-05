import {
  HabitCadence,
  HabitCompletionMode,
  HabitDto,
  HabitSchedule,
  IsoWeekday,
} from "../types/habit";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const CADENCE_LABELS: Record<HabitCadence, string> = {
  [HabitCadence.DAILY]: "Daily",
  [HabitCadence.WEEKLY]: "Weekly",
  [HabitCadence.MONTHLY]: "Monthly",
  [HabitCadence.YEARLY]: "Yearly",
};

const MODE_LABELS: Record<HabitCompletionMode, string> = {
  [HabitCompletionMode.ONCE]: "Once daily",
  [HabitCompletionMode.COUNTER]: "Target",
  [HabitCompletionMode.SCHEDULED]: "Scheduled",
};

/** ISO weekday: Monday = 1 … Sunday = 7. */
export function isoWeekday(date: Date): IsoWeekday {
  const day = date.getDay();
  return (day === 0 ? 7 : day) as IsoWeekday;
}

export function parseDaysOfWeek(raw: string | null | undefined): IsoWeekday[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (value): value is IsoWeekday =>
        typeof value === "number" && value >= 1 && value <= 7,
    );
  } catch {
    return [];
  }
}

export function parseScheduledTimes(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((value): value is string => typeof value === "string")
      .sort();
  } catch {
    return [];
  }
}

export function encodeDaysOfWeek(days: IsoWeekday[]): string | null {
  return days.length > 0 ? JSON.stringify(days) : null;
}

export function encodeScheduledTimes(times: string[]): string | null {
  return times.length > 0 ? JSON.stringify([...times].sort()) : null;
}

export function defaultSchedule(): HabitSchedule {
  return {
    cadence: HabitCadence.DAILY,
    daysOfWeek: [],
    completionMode: HabitCompletionMode.ONCE,
    dailyTarget: 1,
    scheduledTimes: [],
  };
}

function parseCompletionMode(raw: string | null | undefined): HabitCompletionMode {
  if (
    raw &&
    Object.values(HabitCompletionMode).includes(raw as HabitCompletionMode)
  ) {
    return raw as HabitCompletionMode;
  }
  return HabitCompletionMode.ONCE;
}

export function parseSchedule(row: {
  cadence?: string | null;
  days_of_week?: string | null;
  completion_mode?: string | null;
  daily_target?: number | null;
  scheduled_times?: string | null;
}): HabitSchedule {
  const cadence = Object.values(HabitCadence).includes(row.cadence as HabitCadence)
    ? (row.cadence as HabitCadence)
    : HabitCadence.DAILY;

  const scheduledTimes = parseScheduledTimes(row.scheduled_times);
  const completionMode = parseCompletionMode(row.completion_mode);
  const dailyTarget =
    row.daily_target === null || row.daily_target === undefined
      ? completionMode === HabitCompletionMode.COUNTER
        ? null
        : completionMode === HabitCompletionMode.ONCE
          ? 1
          : null
      : row.daily_target;

  return {
    cadence,
    daysOfWeek: parseDaysOfWeek(row.days_of_week),
    completionMode,
    dailyTarget,
    scheduledTimes,
  };
}

export function formatTimeOfDay(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return time;

  const hours24 = Number(match[1]);
  const minutes = match[2];
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

export function formatWeekdays(days: IsoWeekday[]): string {
  if (days.length === 0) return "Every day";
  return [...days]
    .sort((a, b) => a - b)
    .map((day) => WEEKDAY_LABELS[day - 1])
    .join(", ");
}

/** Short label for cards. */
export function formatScheduleLabel(schedule: HabitSchedule): string {
  const cadence = CADENCE_LABELS[schedule.cadence];
  const days =
    schedule.cadence === HabitCadence.DAILY
      ? "Every day"
      : formatWeekdays(schedule.daysOfWeek);

  switch (schedule.completionMode) {
    case HabitCompletionMode.COUNTER: {
      if (schedule.dailyTarget == null) {
        return `${cadence} · Log anytime`;
      }
      return `${cadence} · ${schedule.dailyTarget}× / day`;
    }
    case HabitCompletionMode.SCHEDULED: {
      const times = schedule.scheduledTimes;
      if (times.length === 0) return `${cadence} · Scheduled`;
      if (times.length === 1) {
        return `${cadence} · ${formatTimeOfDay(times[0])}`;
      }
      return `${cadence} · ${times.length}× / day`;
    }
    default: {
      const time = schedule.scheduledTimes[0];
      return time
        ? `${cadence} · ${formatTimeOfDay(time)}`
        : `${cadence} · ${days}`;
    }
  }
}

export function formatCompletionModeLabel(schedule: HabitSchedule): string {
  return MODE_LABELS[schedule.completionMode];
}

export function timeOfDaySortKey(time?: string): number {
  if (!time) return 24 * 60;
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return 24 * 60;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function scheduleSortKey(habit: HabitDto): number {
  const { schedule } = habit;
  const firstDay =
    schedule.daysOfWeek.length > 0 ? Math.min(...schedule.daysOfWeek) : 0;

  if (schedule.completionMode === HabitCompletionMode.SCHEDULED) {
    const firstTime = schedule.scheduledTimes[0];
    return timeOfDaySortKey(firstTime) * 10 + firstDay;
  }

  const time = schedule.scheduledTimes[0];
  return timeOfDaySortKey(time) * 10 + firstDay;
}

export function sortHabitsBySchedule(habits: HabitDto[]): HabitDto[] {
  return [...habits].sort(
    (a, b) => scheduleSortKey(a) - scheduleSortKey(b),
  );
}

export function isScheduledToday(
  schedule: HabitSchedule,
  date = new Date(),
): boolean {
  switch (schedule.cadence) {
    case HabitCadence.DAILY:
      return true;
    case HabitCadence.WEEKLY: {
      if (schedule.daysOfWeek.length === 0) return true;
      return schedule.daysOfWeek.includes(isoWeekday(date));
    }
    case HabitCadence.MONTHLY:
    case HabitCadence.YEARLY:
      return true;
    default:
      return true;
  }
}

export function weekdayStrip(schedule: HabitSchedule): {
  label: (typeof WEEKDAY_LABELS)[number];
  iso: IsoWeekday;
  active: boolean;
}[] {
  const activeDays = new Set(
    schedule.cadence === HabitCadence.DAILY
      ? ([1, 2, 3, 4, 5, 6, 7] as IsoWeekday[])
      : schedule.daysOfWeek,
  );

  return ([1, 2, 3, 4, 5, 6, 7] as IsoWeekday[]).map((iso) => ({
    label: WEEKDAY_LABELS[iso - 1],
    iso,
    active: activeDays.has(iso),
  }));
}

export { WEEKDAY_LABELS, CADENCE_LABELS, MODE_LABELS };
