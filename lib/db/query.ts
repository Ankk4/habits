import { SQLITE_ROW } from "wa-sqlite/src/sqlite-constants.js";
import { getDb } from "./client";
import { withDb } from "./executor";

type SqlValue = number | string | Uint8Array | Array<number> | bigint | null;

export async function queryAll<T extends Record<string, unknown>>(
  sql: string,
  params?: Record<string, SqlValue> | SqlValue[],
): Promise<T[]> {
  return withDb(async () => {
    const { sqlite3, db } = await getDb();
    const str = sqlite3.str_new(db, sql);

    try {
      const rows: T[] = [];
      let prepared = await sqlite3.prepare_v2(db, sqlite3.str_value(str));

      while (prepared) {
        try {
          if (params !== undefined) {
            sqlite3.bind_collection(prepared.stmt, params);
          }

          while ((await sqlite3.step(prepared.stmt)) === SQLITE_ROW) {
            const row: Record<string, unknown> = {};
            const colCount = sqlite3.column_count(prepared.stmt);
            for (let i = 0; i < colCount; i++) {
              row[sqlite3.column_name(prepared.stmt, i)] = sqlite3.column(
                prepared.stmt,
                i,
              );
            }
            rows.push(row as T);
          }
        } finally {
          await sqlite3.finalize(prepared.stmt);
        }

        prepared = await sqlite3.prepare_v2(db, prepared.sql);
      }

      return rows;
    } finally {
      sqlite3.str_finish(str);
    }
  });
}

export async function run(
  sql: string,
  params?: Record<string, SqlValue> | SqlValue[],
): Promise<void> {
  return withDb(async () => {
    const { sqlite3, db } = await getDb();
    const str = sqlite3.str_new(db, sql);

    try {
      let prepared = await sqlite3.prepare_v2(db, sqlite3.str_value(str));

      while (prepared) {
        try {
          if (params !== undefined) {
            sqlite3.bind_collection(prepared.stmt, params);
          }
          await sqlite3.step(prepared.stmt);
        } finally {
          await sqlite3.finalize(prepared.stmt);
        }

        prepared = await sqlite3.prepare_v2(db, prepared.sql);
      }
    } finally {
      sqlite3.str_finish(str);
    }
  });
}

export async function lastInsertId(): Promise<number> {
  const rows = await queryAll<{ id: number }>(
    "SELECT last_insert_rowid() AS id",
  );
  return rows[0]?.id ?? 0;
}
