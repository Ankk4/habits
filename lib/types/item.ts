export type ItemKey = "gold";

export type ItemSource =
  | "habit_complete"
  | "game_win"
  | "game_consolation"
  | "seed"
  | "system"
  | "user_defined";

export type ItemStatus = "pending" | "owned" | "destroyed";

export type ItemDto = {
  id: number;
  key: ItemKey;
  quantity: number;
  status: ItemStatus;
  source: ItemSource;
  sourceRef?: string | null;
  createdAt: Date;
  openedAt?: Date | null;
};

export type RewardOpenResult = {
  key: ItemKey;
  quantity: number;
  meta?: unknown;
};

export type RewardOpenLogDto = {
  id: number;
  itemId: number;
  openedAt: Date;
  result: RewardOpenResult;
};

export type EnqueueItemInput = {
  key: ItemKey;
  quantity: number;
  source: ItemSource;
  sourceRef?: string;
};
