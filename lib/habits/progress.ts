import { HabitDto } from "../types/habit"

export const habitProgress = (habit: HabitDto) => {
    // Defensive: only count completions that belong to this habit.
    const relevantCompletions = habit.completions.filter(
        (completion) => completion.habitId === habit.habit.id,
    );

    return {
        completedToday: relevantCompletions.filter((completion) => completion.date.toDateString() === new Date().toDateString()).length > 0,
        completedThisWeek: relevantCompletions.filter((completion) => completion.date.toDateString() === new Date().toDateString()).length > 0,
        completedThisMonth: relevantCompletions.filter((completion) => completion.date.toDateString() === new Date().toDateString()).length > 0,
        completedThisYear: relevantCompletions.filter((completion) => completion.date.toDateString() === new Date().toDateString()).length > 0,
        completedTotal: relevantCompletions.length,
        streak: relevantCompletions.length,
        longestStreak: relevantCompletions.length,
        currentStreak: relevantCompletions.length,
        lastCompletion: relevantCompletions.length,
        nextCompletion: relevantCompletions.length,
        nextCompletionDate: new Date(),
    }
}