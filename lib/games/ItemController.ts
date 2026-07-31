import { EntityRepository, MikroORM, SqlEntityManager } from "@mikro-orm/sqlite";
import { Item } from "../db/entities/Item";
import { Inventory } from "../db/entities/Inventory";

export class ItemController extends EntityRepository<typeof Item> {
    constructor(em: SqlEntityManager) {
        super(em, Item);
    }

    async addItemToInventory(item: Item) {
        const inventory = await this.client.em.findOne(Inventory, { id: 1 });
        if (!inventory) {
            throw new Error("Inventory not found");
        }
        inventory.items.add(item);
        await this.client.em.persistAndFlush(inventory);
    }
}