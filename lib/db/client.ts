import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite-async.mjs";
import * as SQLite from "wa-sqlite";
import { IDBBatchAtomicVFS } from "wa-sqlite/src/examples/IDBBatchAtomicVFS.js";
import { SCHEMA_SQL } from "./schema";
import config from "./config";
import { runMigrations } from "./migrate";

type DbHandle = {
  sqlite3: SQLiteAPI;
  db: number;
};

let dbPromise: Promise<DbHandle> | null = null;

const DB_PRAGMAS = `
PRAGMA journal_mode = MEMORY;
PRAGMA locking_mode = EXCLUSIVE;
PRAGMA synchronous = NORMAL;
`;

export async function getDb(): Promise<DbHandle> {
  if (!dbPromise) {
    dbPromise = (async () => {
      if (typeof window === "undefined") {
        throw new Error("DB is browser-only");
      }

      const module = await SQLiteESMFactory();
      const sqlite3 = SQLite.Factory(module);

      const vfs = new IDBBatchAtomicVFS(config.database.idbName);
      sqlite3.vfs_register(vfs as unknown as SQLiteVFS, true);

      const db = await sqlite3.open_v2(config.database.path);
      // Keep the rollback journal in memory — IDBBatchAtomicVFS has no -journal files.
      await sqlite3.exec(db, DB_PRAGMAS);
      await sqlite3.exec(db, SCHEMA_SQL as string);
      await runMigrations(sqlite3, db);

      return { sqlite3, db };
    })();
  }
  return dbPromise;
}
