import SQLiteESMFactory from "wa-sqlite/dist/wa-sqlite-async.mjs";
import * as SQLite from "wa-sqlite";
import { IDBBatchAtomicVFS } from "wa-sqlite/src/examples/IDBBatchAtomicVFS.js";
import { SCHEMA_SQL } from "./schema";
import config from "./config";

type DbHandle = {
  sqlite3: SQLiteAPI; // from wa-sqlite types
  db: number;         // connection id from open_v2
};

let dbPromise: Promise<DbHandle> | null = null;

export async function getDb(): Promise<DbHandle> {
  if (!dbPromise) {
    dbPromise = (async () => {
      if (typeof window === "undefined") {
        throw new Error("DB is browser-only");
      }

      const module = await SQLiteESMFactory();
      const sqlite3 = SQLite.Factory(module);

      const vfs = new IDBBatchAtomicVFS(config.database.path);
      sqlite3.vfs_register(vfs as unknown as SQLiteVFS, true);

      const db = await sqlite3.open_v2(config.database.path);
      await sqlite3.exec(db, SCHEMA_SQL as string);

      return { sqlite3, db };
    })();
  }
  return dbPromise;
}