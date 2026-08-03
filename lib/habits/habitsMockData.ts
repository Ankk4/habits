import type {
  HabitCompletionDto,
  HabitCueDto,
  HabitDto,
  HabitRewardDto,
  HabitStackLinkDto,
} from "../types/habit";
import {
  HabitCueKind,
  HabitRewardKind,
  HabitType,
} from "../types/habit";

const now = new Date();

const habits: Array<
  Pick<HabitDto, "id" | "name" | "description" | "type" | "createdAt" | "updatedAt">
> = [
  {
    id: 1,
    name: "Habit 1",
    description: "Habit 1 description",
    type: HabitType.NEGATIVE,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "Habit 2",
    description: "Habit 2 description",
    type: HabitType.POSITIVE,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "Habit 3",
    description: "Habit 3 description",
    type: HabitType.NEUTRAL,
    createdAt: now,
    updatedAt: now,
  },
];

const cues: HabitCueDto[] = [
  { id: 1, habitId: 1, kind: HabitCueKind.TEXT, text: "Urge after dinner" },
  { id: 2, habitId: 2, kind: HabitCueKind.TEXT, text: "Alarm at 7:00" },
  { id: 3, habitId: 3, kind: HabitCueKind.TEXT, text: "After morning coffee" },
];

const rewards: HabitRewardDto[] = [
  { id: 1, habitId: 1, kind: HabitRewardKind.POINTS, points: 5 },
  { id: 2, habitId: 2, kind: HabitRewardKind.POINTS, points: 8 },
];

/** Habit 1 → Habit 2 (after 1, do 2). */
const stack: HabitStackLinkDto = {
  id: 1,
  habitId: 1,
  name: "Habit 1",
};

const completions: HabitCompletionDto[] = [
  { id: 1, habitId: 1, completedAt: now },
];

function toHabitDto(
  habit: (typeof habits)[number],
): HabitDto {
  return {
    ...habit,
    completions: completions.filter((c) => c.habitId === habit.id),
    cues: cues.filter((c) => c.habitId === habit.id),
    rewards: rewards.filter((r) => r.habitId === habit.id),
    stackedAfter:
      habit.id === 2
        ? { id: stack.id, habitId: 1, name: "Habit 1" }
        : undefined,
    stackedInto:
      habit.id === 1
        ? [{ id: stack.id, habitId: 2, name: "Habit 2" }]
        : [],
  };
}

export const habitDtosMockData: HabitDto[] = [
  toHabitDto(habits[0]),
  toHabitDto(habits[1]),
];
