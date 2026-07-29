export type LoopContentType = 'text' | 'number' | 'media';

export type LoopContent = {
    type: LoopContentType;
    value: string;
}

export type HabitLoop = {
    cue: LoopContent;
    routine: LoopContent;
    reward: LoopContent;
}

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
    loop: HabitLoop;
}