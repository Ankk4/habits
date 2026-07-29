export type Habit = {
    id: number;
    name: string;
    description: string;
    type: HabitType;
    createdAt: Date;
    updatedAt: Date;
}

export type HabitType = 'positive' | 'negative' | 'neutral';

export type HabitCompletion = {
    id: number;
    habitId: number;
    date: Date;
}

export type HabitDto = {
    habit: Habit;
    completions: HabitCompletion[];
}