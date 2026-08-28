import { SQLITE_ROW } from "wa-sqlite/src/sqlite-constants.js";
import { migrations } from "./migrations";

const MIGRATION_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS schema_migration (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);
`;

async function appliedMigrationIds(
  sqlite3: SQLiteAPI,
  db: number,
): Promise<Set<string>> {
  const ids = new Set<string>();
  const str = sqlite3.str_new(
    db,
    "SELECT id FROM schema_migration ORDER BY id",
  );

  try {
    const prepared = await sqlite3.prepare_v2(db, sqlite3.str_value(str));
    if (!prepared) return ids;

    try {
      while ((await sqlite3.step(prepared.stmt)) === SQLITE_ROW) {
        ids.add(String(sqlite3.column(prepared.stmt, 0)));
      }
    } finally {
      await sqlite3.finalize(prepared.stmt);
    }
  } finally {
    sqlite3.str_finish(str);
  }

  return ids;
}

async function markMigrationApplied(
  sqlite3: SQLiteAPI,
  db: number,
  id: string,
): Promise<void> {
  const str = sqlite3.str_new(
    db,
    "INSERT OR IGNORE INTO schema_migration (id, applied_at) VALUES (:id, :appliedAt)",
  );

  try {
    const prepared = await sqlite3.prepare_v2(db, sqlite3.str_value(str));
    if (!prepared) return;

    try {
      sqlite3.bind_collection(prepared.stmt, {
        ":id": id,
        ":appliedAt": new Date().toISOString(),
      });
      await sqlite3.step(prepared.stmt);
    } finally {
      await sqlite3.finalize(prepared.stmt);
    }
  } finally {
    sqlite3.str_finish(str);
  }
}

export async function runMigrations(
  sqlite3: SQLiteAPI,
  db: number,
): Promise<void> {
  await sqlite3.exec(db, MIGRATION_TABLE_SQL);

  const applied = await appliedMigrationIds(sqlite3, db);

  for (const migration of migrations) {
    if (applied.has(migration.id)) continue;
    await migration.up(sqlite3, db);
    await markMigrationApplied(sqlite3, db, migration.id);
  }
}
