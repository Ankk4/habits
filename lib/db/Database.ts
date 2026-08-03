import { MikroORM } from "@mikro-orm/sqlite";
import config from "./config";

let ormPromise: Promise<MikroORM> | null = null;

export async function createClient(): Promise<MikroORM> {
  if (!ormPromise) {
    ormPromise = (async () => {
      const orm = await MikroORM.init({
        entities: config.entities,
        dbName: config.database.path,
        allowGlobalContext: true,
      });
      await orm.schema.update();
      return orm;
    })();
  }
  return ormPromise;
}
