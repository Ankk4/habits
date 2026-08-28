import { addColumnIfMissing } from "../sqliteHelpers";
import {
  encodeDaysOfWeek,
  encodeDailyTarget,
  encodeScheduledTimes,
  mockHabitSeed,
} from "../seed/mockHabits";

export const MULTI_COMPLETION_ID = "003_multi_completion";

export async function upMultiCompletion(
  sqlite3: SQLiteAPI,
  db: number,
): Promise<void> {
  await addColumnIfMissing(
    sqlite3,
    db,
    "habit",
    "completion_mode",
    "completion_mode TEXT NOT NULL DEFAULT 'once'",
  );
  await addColumnIfMissing(
    sqlite3,
    db,
    "habit",
    "daily_target",
    "daily_target INTEGER",
  );
  await addColumnIfMissing(
    sqlite3,
    db,
    "habit",
    "scheduled_times",
    "scheduled_times TEXT",
  );
  await addColumnIfMissing(
    sqlite3,
    db,
    "habit_completion",
    "slot_time",
    "slot_time TEXT",
  );

  for (const habit of mockHabitSeed) {
    const days = encodeDaysOfWeek(habit.daysOfWeek);
    const daysSql = days ? `'${days}'` : "NULL";
    const scheduled = encodeScheduledTimes(habit.scheduledTimes);
    const scheduledSql = scheduled ? `'${scheduled}'` : "NULL";
    const targetSql = encodeDailyTarget(habit.dailyTarget);

    await sqlite3.exec(
      db,
      `UPDATE habit SET
        completion_mode = '${habit.completionMode}',
        daily_target = ${targetSql},
        scheduled_times = ${scheduledSql},
        days_of_week = ${daysSql}
      WHERE id = ${habit.id}`,
    );
  }
}
