"use server";

import { revalidatePath } from "next/cache";
import {
  consume,
  enqueue,
  getOwnedQuantity,
  listPending,
  open,
} from "@/lib/items/itemService";
import type { ItemDto, RewardOpenLogDto } from "@/lib/types/item";
import { HabitRewardKind } from "@/lib/types/habit";
import type { HabitReward } from "@/lib/types/habit";

export async function getGold(): Promise<number> {
  return getOwnedQuantity("gold");
}

export async function listPendingItems(): Promise<ItemDto[]> {
  return listPending();
}

export async function openItem(
  itemId: number,
): Promise<{ item: ItemDto; openLog: RewardOpenLogDto; gold: number }> {
  const result = await open(itemId);
  const gold = await getOwnedQuantity("gold");
  revalidatePath("/games");
  return { ...result, gold };
}

export async function seedStarterItem(): Promise<{
  item: ItemDto;
  gold: number;
}> {
  const pending = await enqueue({
    key: "gold",
    quantity: 25,
    source: "seed",
    sourceRef: "starter",
  });
  const { item } = await open(pending.id);
  const gold = await getOwnedQuantity("gold");
  revalidatePath("/games");
  revalidatePath("/games/slots");
  return { item, gold };
}

export async function enqueueHabitRewards(
  habitId: number,
  rewards: HabitReward[],
): Promise<{ enqueued: ItemDto[] }> {
  const enqueued: ItemDto[] = [];

  for (const reward of rewards) {
    if (reward.kind !== HabitRewardKind.POINTS) continue;
    const points =
      typeof reward.payload === "object" &&
      reward.payload !== null &&
      "points" in reward.payload
        ? Number((reward.payload as { points: unknown }).points)
        : NaN;
    if (!Number.isFinite(points) || points <= 0) continue;

    const item = await enqueue({
      key: "gold",
      quantity: points,
      source: "habit_complete",
      sourceRef: String(habitId),
    });
    enqueued.push(item);
  }

  if (enqueued.length > 0) {
    revalidatePath("/games");
  }

  return { enqueued };
}
