import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Inventory } from "./Inventory";

export const Item = defineEntity({
  name: "Item",
  properties: {
    id: p.integer().primary().autoincrement(),
    name: p.string(),
    description: p.text(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
    inventory: () => p.manyToOne(Inventory).mappedBy("items"),
  },
});

export type Item = InferEntity<typeof Item>;