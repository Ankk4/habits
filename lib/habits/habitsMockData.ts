import type { Habit, HabitCompletion, HabitDto } from "../types/habit";

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

export const completionsMockData: HabitCompletion[] = [
  {
    id: 1,
    habitId: 1,
    date: new Date(),
  },
];

const completionsForHabit = (habitId: number) =>
  completionsMockData.filter((c) => c.habitId === habitId);

export const habitDtosMockData: HabitDto[] = [
  {
    habit: habitsMockData[0],
    completions: completionsForHabit(habitsMockData[0].id),
  },
  {
    habit: habitsMockData[1],
    completions: completionsForHabit(habitsMockData[1].id),
  },
];