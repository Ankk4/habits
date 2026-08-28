import { SQLITE_ROW } from "wa-sqlite/src/sqlite-constants.js";
import { encodeScheduledTimes } from "../../habits/schedule";
import { dropColumnIfPresent, tableColumns } from "../sqliteHelpers";

export const DROP_TIME_OF_DAY_ID = "004_drop_time_of_day";

type LegacyHabitRow = {
  id: number;
  time_of_day: string | null;
  scheduled_times: string | null;
};

async function legacyHabitsWithTimeOfDay(
  sqlite3: SQLiteAPI,
  db: number,
): Promise<LegacyHabitRow[]> {
  const rows: LegacyHabitRow[] = [];
  const sql = `SELECT id, time_of_day, scheduled_times FROM habit
               WHERE time_of_day IS NOT NULL AND time_of_day != ''`;
  const str = sqlite3.str_new(db, sql);

  try {
    const prepared = await sqlite3.prepare_v2(db, sqlite3.str_value(str));
    if (!prepared) return rows;

    try {
      while ((await sqlite3.step(prepared.stmt)) === SQLITE_ROW) {
        rows.push({
          id: Number(sqlite3.column(prepared.stmt, 0)),
          time_of_day: sqlite3.column(prepared.stmt, 1) as string | null,
          scheduled_times: sqlite3.column(prepared.stmt, 2) as string | null,
        });
      }
    } finally {
      await sqlite3.finalize(prepared.stmt);
    }
  } finally {
    sqlite3.str_finish(str);
  }

  return rows;
}

function scheduledTimesEmpty(raw: string | null): boolean {
  if (!raw || raw.trim() === "") return true;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return !Array.isArray(parsed) || parsed.length === 0;
  } catch {
    return true;
  }
}

export async function upDropTimeOfDay(
  sqlite3: SQLiteAPI,
  db: number,
): Promise<void> {
  const columns = await tableColumns(sqlite3, db, "habit");
  if (!columns.has("time_of_day")) return;

  for (const row of await legacyHabitsWithTimeOfDay(sqlite3, db)) {
    if (!row.time_of_day || !scheduledTimesEmpty(row.scheduled_times)) continue;

    const encoded = encodeScheduledTimes([row.time_of_day]);
    if (!encoded) continue;

    await sqlite3.exec(
      db,
      `UPDATE habit SET scheduled_times = '${encoded.replace(/'/g, "''")}'
       WHERE id = ${row.id}`,
    );
  }

  await dropColumnIfPresent(sqlite3, db, "habit", "time_of_day");
}
