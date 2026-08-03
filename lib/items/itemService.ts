import { createClient } from "../db/Database";
import { Item } from "../db/entities/Item";
import { RewardOpenLog } from "../db/entities/RewardOpenLog";
import type {
  EnqueueItemInput,
  ItemDto,
  ItemKey,
  RewardOpenLogDto,
  RewardOpenResult,
} from "../types/item";

function toItemDto(item: Item): ItemDto {
  return {
    id: item.id,
    key: item.key,
    quantity: item.quantity,
    status: item.status,
    source: item.source,
    sourceRef: item.sourceRef ?? null,
    createdAt: item.createdAt,
    openedAt: item.openedAt ?? null,
  };
}

function toOpenLogDto(log: RewardOpenLog): RewardOpenLogDto {
  return {
    id: log.id,
    itemId: log.item.id,
    openedAt: log.openedAt,
    result: log.result as RewardOpenResult,
  };
}

export async function enqueue(input: EnqueueItemInput): Promise<ItemDto> {
  if (input.quantity <= 0) {
    throw new Error("Quantity must be positive");
  }

  const orm = await createClient();
  const em = orm.em.fork();

  const item = em.create(Item, {
    key: input.key,
    quantity: input.quantity,
    status: "pending",
    source: input.source,
    sourceRef: input.sourceRef ?? null,
    createdAt: new Date(),
    openedAt: null,
  });

  await em.persist(item).flush();
  return toItemDto(item);
}

export async function listPending(): Promise<ItemDto[]> {
  const orm = await createClient();
  const em = orm.em.fork();
  const items = await em.find(
    Item,
    { status: "pending" },
    { orderBy: { createdAt: "ASC" } },
  );
  return items.map(toItemDto);
}

export async function getOwnedQuantity(key: ItemKey): Promise<number> {
  const orm = await createClient();
  const em = orm.em.fork();
  const owned = await em.find(Item, { key, status: "owned" });
  return owned.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Open a pending item into owned inventory.
 * Stackable gold merges into a single owned row; open log keeps per-open history.
 */
export async function open(
  itemId: number,
  meta?: unknown,
): Promise<{ item: ItemDto; openLog: RewardOpenLogDto }> {
  const orm = await createClient();
  const em = orm.em.fork();

  const pending = await em.findOne(Item, { id: itemId });
  if (!pending) {
    throw new Error(`Item ${itemId} not found`);
  }
  if (pending.status !== "pending") {
    throw new Error(`Item ${itemId} is not pending`);
  }

  const result: RewardOpenResult = {
    key: pending.key,
    quantity: pending.quantity,
    ...(meta !== undefined ? { meta } : {}),
  };

  const openedAt = new Date();
  let ownedItem: Item;

  if (pending.key === "gold") {
    const existing = await em.findOne(Item, { key: "gold", status: "owned" });
    if (existing) {
      existing.quantity += pending.quantity;
      ownedItem = existing;
      em.remove(pending);
    } else {
      pending.status = "owned";
      pending.openedAt = openedAt;
      ownedItem = pending;
    }
  } else {
    pending.status = "owned";
    pending.openedAt = openedAt;
    ownedItem = pending;
  }

  const openLog = em.create(RewardOpenLog, {
    item: ownedItem,
    openedAt,
    result,
  });

  await em.persist([ownedItem, openLog]).flush();

  return {
    item: toItemDto(ownedItem),
    openLog: toOpenLogDto(openLog),
  };
}

export async function consume(key: ItemKey, qty: number): Promise<number> {
  if (qty <= 0) {
    throw new Error("Consume quantity must be positive");
  }

  const orm = await createClient();
  const em = orm.em.fork();

  const owned = await em.find(
    Item,
    { key, status: "owned" },
    { orderBy: { createdAt: "ASC" } },
  );
  const total = owned.reduce((sum, item) => sum + item.quantity, 0);
  if (total < qty) {
    throw new Error(`Insufficient ${key}: have ${total}, need ${qty}`);
  }

  let remaining = qty;
  for (const stack of owned) {
    if (remaining <= 0) break;
    if (stack.quantity <= remaining) {
      remaining -= stack.quantity;
      em.remove(stack);
    } else {
      stack.quantity -= remaining;
      remaining = 0;
    }
  }

  await em.flush();
  return total - qty;
}
