export type Habit = {
    id: number;
    name: string;
    description: string;
    type: HabitType;
    createdAt: Date;
    updatedAt: Date;
}

export type HabitType = 'positive' | 'negative';

export type HabitCompletion = {
    id: number;
    habitId: number;
    date: Date;
}