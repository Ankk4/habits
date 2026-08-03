"use server";

import { revalidatePath } from "next/cache";
import { consume, enqueue, getOwnedQuantity, open } from "@/lib/items/itemService";
import { rollSlots, SLOT_STAKES, type SlotStake } from "@/lib/games/slots/paytable";
import type { RewardOpenLogDto } from "@/lib/types/item";
import type { SlotsOutcome } from "@/lib/games/slots/paytable";

export type PlaySlotsResult = {
  ok: true;
  reels: SlotsOutcome["reels"];
  payout: number;
  gold: number;
  openLogEntry: RewardOpenLogDto | null;
} | {
  ok: false;
  error: string;
  gold: number;
};

export async function playSlots(stake: number): Promise<PlaySlotsResult> {
  const goldBefore = await getOwnedQuantity("gold");

  if (!SLOT_STAKES.includes(stake as SlotStake)) {
    return { ok: false, error: "Invalid stake", gold: goldBefore };
  }

  try {
    await consume("gold", stake);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Insufficient gold",
      gold: goldBefore,
    };
  }

  const roundId = `slots-${Date.now()}`;
  const outcome = rollSlots(stake);
  let openLogEntry: RewardOpenLogDto | null = null;

  if (outcome.payout > 0) {
    const pending = await enqueue({
      key: "gold",
      quantity: outcome.payout,
      source: "game_win",
      sourceRef: roundId,
    });
    const { openLog } = await open(pending.id, {
      reels: outcome.reels,
      multiplier: outcome.multiplier,
      stake,
    });
    openLogEntry = openLog;
  }

  const gold = await getOwnedQuantity("gold");
  revalidatePath("/games");
  revalidatePath("/games/slots");

  return {
    ok: true,
    reels: outcome.reels,
    payout: outcome.payout,
    gold,
    openLogEntry,
  };
}
