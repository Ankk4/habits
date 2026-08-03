import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Item } from "./Item";

export const RewardOpenLog = defineEntity({
  name: "RewardOpenLog",
  properties: {
    id: p.integer().primary().autoincrement(),
    item: () => p.manyToOne(Item),
    openedAt: p.datetime().onCreate(() => new Date())
  },
});

export type RewardOpenLog = InferEntity<typeof RewardOpenLog>;
