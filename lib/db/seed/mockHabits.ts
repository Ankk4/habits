import {
  HabitCadence,
  HabitCompletionMode,
  HabitCueKind,
  HabitRewardKind,
  HabitType,
  type IsoWeekday,
} from "../../types/habit";

/** Fixed timestamp so seed data is reproducible across reloads. */
export const MOCK_SEED_TIMESTAMP = "2026-01-01T12:00:00.000Z";

export const mockHabitSeed = [
  {
    id: 1,
    name: "Habit 1",
    description: "Log each urge or slip (negative habit tracking)",
    type: HabitType.NEGATIVE,
    cadence: HabitCadence.DAILY,
    daysOfWeek: [] as IsoWeekday[],
    completionMode: HabitCompletionMode.COUNTER,
    dailyTarget: null,
    scheduledTimes: [] as string[],
  },
  {
    id: 2,
    name: "Habit 2",
    description: "Take meds three times daily",
    type: HabitType.POSITIVE,
    cadence: HabitCadence.DAILY,
    daysOfWeek: [] as IsoWeekday[],
    completionMode: HabitCompletionMode.SCHEDULED,
    dailyTarget: null,
    scheduledTimes: ["08:00", "13:00", "20:00"],
  },
  {
    id: 3,
    name: "Habit 3",
    description: "Stretch session (3× on scheduled days)",
    type: HabitType.NEUTRAL,
    cadence: HabitCadence.WEEKLY,
    daysOfWeek: [1, 3, 5] as IsoWeekday[],
    completionMode: HabitCompletionMode.COUNTER,
    dailyTarget: 3,
    scheduledTimes: ["08:00"],
  },
] as const;

export const mockCueSeed = [
  { id: 1, habitId: 1, kind: HabitCueKind.TEXT, text: "Urge after dinner" },
  { id: 2, habitId: 2, kind: HabitCueKind.TEXT, text: "With meals" },
  { id: 3, habitId: 3, kind: HabitCueKind.TEXT, text: "After morning coffee" },
] as const;

export const mockRewardSeed = [
  { id: 1, habitId: 1, kind: HabitRewardKind.POINTS, points: 5 },
  { id: 2, habitId: 2, kind: HabitRewardKind.POINTS, points: 8 },
] as const;

/** Habit 1 → Habit 2 (after 1, do 2). */
export const mockStackSeed = {
  id: 1,
  predecessorId: 1,
  successorId: 2,
} as const;

export const mockCompletionSeed = [
  { id: 1, habitId: 1, completedAt: MOCK_SEED_TIMESTAMP, slotTime: null },
] as const;

export function encodeDaysOfWeek(days: readonly number[]): string | null {
  return days.length > 0 ? JSON.stringify([...days]) : null;
}

export function encodeScheduledTimes(times: readonly string[]): string | null {
  return times.length > 0 ? JSON.stringify([...times]) : null;
}

export function encodeDailyTarget(target: number | null | undefined): string {
  if (target === null || target === undefined) return "NULL";
  return String(target);
}
