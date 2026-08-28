import { SQLITE_ROW } from "wa-sqlite/src/sqlite-constants.js";

export async function tableRowCount(
  sqlite3: SQLiteAPI,
  db: number,
  table: string,
): Promise<number> {
  const str = sqlite3.str_new(db, `SELECT COUNT(*) AS count FROM ${table}`);

  try {
    const prepared = await sqlite3.prepare_v2(db, sqlite3.str_value(str));
    if (!prepared) return 0;

    try {
      if ((await sqlite3.step(prepared.stmt)) === SQLITE_ROW) {
        return Number(sqlite3.column(prepared.stmt, 0));
      }
      return 0;
    } finally {
      await sqlite3.finalize(prepared.stmt);
    }
  } finally {
    sqlite3.str_finish(str);
  }
}

export async function tableColumns(
  sqlite3: SQLiteAPI,
  db: number,
  table: string,
): Promise<Set<string>> {
  const columns = new Set<string>();
  const str = sqlite3.str_new(db, `PRAGMA table_info(${table})`);

  try {
    const prepared = await sqlite3.prepare_v2(db, sqlite3.str_value(str));
    if (!prepared) return columns;

    try {
      while ((await sqlite3.step(prepared.stmt)) === SQLITE_ROW) {
        columns.add(String(sqlite3.column(prepared.stmt, 1)));
      }
    } finally {
      await sqlite3.finalize(prepared.stmt);
    }
  } finally {
    sqlite3.str_finish(str);
  }

  return columns;
}

export async function addColumnIfMissing(
  sqlite3: SQLiteAPI,
  db: number,
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  const columns = await tableColumns(sqlite3, db, table);
  if (columns.has(column)) return;
  await sqlite3.exec(db, `ALTER TABLE ${table} ADD COLUMN ${definition}`);
}

export async function dropColumnIfPresent(
  sqlite3: SQLiteAPI,
  db: number,
  table: string,
  column: string,
): Promise<void> {
  const columns = await tableColumns(sqlite3, db, table);
  if (!columns.has(column)) return;
  await sqlite3.exec(db, `ALTER TABLE ${table} DROP COLUMN ${column}`);
}
