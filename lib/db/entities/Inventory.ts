import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Item } from "./Item";

export const Inventory = defineEntity({
  name: "Inventory",
  properties: {
    id: p.integer().primary().autoincrement(),
    items: () => p.oneToMany(Item).mappedBy("inventory"),
  },
});

export type Inventory = InferEntity<typeof Inventory>;