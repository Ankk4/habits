import config from "./config";
import { MikroORM } from "@mikro-orm/sqlite";

export async function createClient(): Promise<MikroORM> {
  return await MikroORM.init({
    entities: Object.values(config.entities),
    dbName: config.database.path,
  });
}
