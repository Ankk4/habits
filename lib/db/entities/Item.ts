import { defineEntity, InferEntity, p } from "@mikro-orm/core";

export const ItemKey = ["gold"] as const;
export const ItemStatus = ["pending", "owned", "destroyed"] as const;
export const ItemSource = [
  "habit_complete",
  "game_win",
  "game_consolation",
  "seed",
  "system",
  "user_defined",
] as const;

export const Item = defineEntity({
  name: "Item",
  properties: {
    id: p.integer().primary().autoincrement(),
    key: p.enum([...ItemKey] as const),
    quantity: p.integer(),
    status: p.enum([...ItemStatus] as const),
    source: p.enum([...ItemSource] as const),
    sourceRef: p.string().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    openedAt: p.datetime().nullable(),
  },
});

export type Item = InferEntity<typeof Item>;
