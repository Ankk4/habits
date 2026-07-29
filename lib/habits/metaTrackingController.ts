import { HabitCompletion } from "../types/habit";
import { MetaTracking } from "./metaTracking";

export function getMetaTracking(completions: HabitCompletion[], habitId: number): MetaTracking {
    return {
      streak: getStreak(completions),
      longestStreak: getLongestStreak(completions),
      averageStreak: getAverageStreak(completions),
      averageCompletionRate: getAverageCompletionRate(completions),
      longestCompletionStreak: getLongestCompletionStreak(completions),
      habitId,
    }
  } 
  
  function getStreak(completions: HabitCompletion[]): number {
    if (completions.length === 0) {
      return 0;
    }
    let streak = 0;
    for (let i = completions.length - 1; i > 0; i--) {
      if (completions[i].date.getDate() === completions[i - 1].date.getDate()) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
  
  function getLongestStreak(completions: HabitCompletion[]): number {
    if (completions.length === 0) {
      return 0;
    }
    let longestStreak = 0;
    let currentStreak = 0;
    for (let i = completions.length - 1; i > 0; i--) {
      if (completions[i].date.getDate() === completions[i - 1].date.getDate()) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 0;
      }
    }
    return Math.max(longestStreak, currentStreak);
  }  
  
  function getAverageStreak(completions: HabitCompletion[]): number {
    if (completions.length === 0) {
      return 0;
    }
    return completions.length / completions.length;
  }
  
  function getAverageCompletionRate(completions: HabitCompletion[]): number {
    if (completions.length === 0) {
      return 0;
    }
    return completions.length / completions.length;
  }
  
  function getLongestCompletionStreak(completions: HabitCompletion[]): number {
    if (completions.length === 0) {
      return 0;
    }
    let longestCompletionStreak = 0;
    let currentCompletionStreak = 0;
    for (let i = completions.length - 1; i > 0; i--) {
      if (completions[i].date.getDate() === completions[i - 1].date.getDate()) {
        currentCompletionStreak++;
      } else {
        longestCompletionStreak = Math.max(longestCompletionStreak, currentCompletionStreak);
        currentCompletionStreak = 0;
      }
    }
    return Math.max(longestCompletionStreak, currentCompletionStreak);
  }
  