import { addColumnIfMissing } from "../sqliteHelpers";
import {
  encodeDaysOfWeek,
  mockHabitSeed,
} from "../seed/mockHabits";

export const ADD_HABIT_SCHEDULE_ID = "002_add_habit_schedule";

export async function upAddHabitSchedule(
  sqlite3: SQLiteAPI,
  db: number,
): Promise<void> {
  await addColumnIfMissing(
    sqlite3,
    db,
    "habit",
    "cadence",
    "cadence TEXT NOT NULL DEFAULT 'daily'",
  );
  await addColumnIfMissing(sqlite3, db, "habit", "days_of_week", "days_of_week TEXT");

  for (const habit of mockHabitSeed) {
    const days = encodeDaysOfWeek(habit.daysOfWeek);
    const daysSql = days ? `'${days}'` : "NULL";
    await sqlite3.exec(
      db,
      `UPDATE habit SET
        cadence = '${habit.cadence}',
        days_of_week = ${daysSql}
      WHERE id = ${habit.id}`,
    );
  }
}
