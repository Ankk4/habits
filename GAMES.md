# Games (Gamba)

Unified **Item** model for rewards and inventory. No separate Reward or Inventory tables.

## Item life cycle

```
enqueue (pending) → open → owned → consume (spend)
```

| Status | Meaning |
|--------|---------|
| `pending` | Unopened reward in the queue (shown on `/games`) |
| `owned` | In inventory (e.g. gold balance) |

Every `open()` writes one **RewardOpenLog** row with the result (`key`, `quantity`, optional `meta`).

Stackable gold: opening merges into a single owned `gold` row; the open log keeps per-open history.

## Service API (`lib/items/itemService.ts`)

| Method | Behavior |
|--------|----------|
| `enqueue` | Insert pending item |
| `listPending` | Pending queue |
| `getOwnedQuantity(key)` | Sum owned stacks |
| `open(itemId)` | Pending → owned + open log |
| `consume(key, qty)` | Spend owned quantity |

UI and games must not mutate rows directly — call this module (or the Server Actions in `app/actions/`).

## Core loop

1. Complete a habit → grant templates (`HabitReward`) enqueue pending gold
2. Open pending items on `/games` → owned gold
3. Play slots → `consume` gold → win enqueues then auto-`open`s gold

## Adding a game

1. Add an entry to `lib/games/registry.ts`
2. Add a route under `app/games/<id>/`
3. On play: `consume("gold", stake)` then on win `enqueue` + `open` (see `app/actions/slots.ts`)

## Granting from a new source

Call `enqueue({ key, quantity, source, sourceRef })` with a suitable `ItemSource` (`habit_complete`, `game_win`, `seed`, …). Leave items pending for the hub, or auto-`open` when the flow should land in inventory immediately (slots wins do this).
