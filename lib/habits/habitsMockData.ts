import type { Habit, HabitCompletion, HabitDto, HabitLoop } from "../types/habit";

export const habitsMockData: Habit[] = [
  {
    id: 1,
    name: "Habit 1",
    description: "Habit 1 description",
    type: "negative",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Habit 2",
    description: "Habit 2 description",
    type: "positive",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Habit 3",
    description: "Habit 3 description",
    type: "neutral",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const loopsMockData: Record<number, HabitLoop> = {
  1: {
    cue: { type: "text", value: "Urge after dinner" },
    routine: { type: "text", value: "Go for a short walk instead of smoking" },
    reward: { type: "text", value: "Clear lungs, calm mind" },
  },
  2: {
    cue: { type: "text", value: "Alarm at 7:00" },
    routine: { type: "text", value: "Drink a glass of water" },
    reward: { type: "number", value: "8" },
  },
  3: {
    cue: { type: "media", value: "https://placehold.co/80x80" },
    routine: { type: "text", value: "Write three priorities for the day" },
    reward: { type: "text", value: "Sense of direction" },
  },
};

export const completionsMockData: HabitCompletion[] = [
  {
    id: 1,
    habitId: 1,
    date: new Date(),
  },
];

const completionsForHabit = (habitId: number) =>
  completionsMockData.filter((c) => c.habitId === habitId);

const loopForHabit = (habitId: number): HabitLoop =>
  loopsMockData[habitId] ?? {
    cue: { type: "text", value: "" },
    routine: { type: "text", value: "" },
    reward: { type: "text", value: "" },
  };

export const habitDtosMockData: HabitDto[] = [
  {
    habit: habitsMockData[0],
    completions: completionsForHabit(habitsMockData[0].id),
    loop: loopForHabit(habitsMockData[0].id),
  },
  {
    habit: habitsMockData[1],
    completions: completionsForHabit(habitsMockData[1].id),
    loop: loopForHabit(habitsMockData[1].id),
  },
];