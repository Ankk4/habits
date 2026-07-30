import type {
  Habit,
  HabitCompletion,
  HabitCue,
  HabitDto,
  HabitReward,
  HabitStack,
} from "../types/habit";
import {
  HabitCueKind,
  HabitRewardKind,
  HabitType,
} from "../types/habit";

export const habitsMockData: Habit[] = [
  {
    id: 1,
    name: "Habit 1",
    description: "Habit 1 description",
    type: HabitType.NEGATIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Habit 2",
    description: "Habit 2 description",
    type: HabitType.POSITIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Habit 3",
    description: "Habit 3 description",
    type: HabitType.NEUTRAL,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const cuesMockData: Record<number, HabitCue> = {
  1: {
    id: 1,
    habit: habitsMockData[0],
    kind: HabitCueKind.TEXT,
    payload: "Urge after dinner",
  },
  2: {
    id: 2,
    habit: habitsMockData[1],
    kind: HabitCueKind.TEXT,
    payload: "Alarm at 7:00",
  },
  3: {
    id: 3,
    habit: habitsMockData[2],
    kind: HabitCueKind.TEXT,
    payload: "After morning coffee",
  },
};

export const rewardsMockData: Record<number, HabitReward> = {
  1: {
    id: 1,
    habit: habitsMockData[0],
    kind: HabitRewardKind.POINTS,
    payload: { points: 5 },
  },
  2: {
    id: 2,
    habit: habitsMockData[1],
    kind: HabitRewardKind.POINTS,
    payload: { points: 8 },
  },
};

/** Habit 1 → Habit 2 (after 1, do 2). */
export const stacksMockData: HabitStack[] = [
  {
    id: 1,
    predecessor: habitsMockData[0],
    successor: habitsMockData[1],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const completionsMockData: HabitCompletion[] = [
  {
    id: 1,
    habit: habitsMockData[0],
    date: new Date(),
  },
];

const completionsForHabit = (habitId: number): HabitCompletion[] =>
  completionsMockData.filter((c) => c.habit.id === habitId);

const cuesForHabit = (habitId: number): HabitCue[] =>
  Object.values(cuesMockData).filter((c) => c.habit.id === habitId);

const rewardsForHabit = (habitId: number): HabitReward[] =>
  Object.values(rewardsMockData).filter((r) => r.habit.id === habitId);

const stackedAfterForHabit = (habitId: number): HabitStack | undefined =>
  stacksMockData.find((s) => s.successor.id === habitId);

const stackedIntoForHabit = (habitId: number): HabitStack[] =>
  stacksMockData.filter((s) => s.predecessor.id === habitId);

const toHabitDto = (habit: Habit): HabitDto => ({
  habit,
  completions: completionsForHabit(habit.id),
  cues: cuesForHabit(habit.id),
  rewards: rewardsForHabit(habit.id),
  stackedAfter: stackedAfterForHabit(habit.id),
  stackedInto: stackedIntoForHabit(habit.id),
});

export const habitDtosMockData: HabitDto[] = [
  toHabitDto(habitsMockData[0]),
  toHabitDto(habitsMockData[1]),
];
