/**
 * Shared habit contracts for UI + server actions.
 * MikroORM entities live in lib/db/entities — do not mirror them here.
 */

export enum HabitType {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NEUTRAL = "neutral",
}

export enum HabitCueKind {
  TEXT = "text",
}

export enum HabitRewardKind {
  POINTS = "points",
}

/** Write payload for creating a habit. IDs and timestamps come from the DB. */
export type CreateHabitInput = {
  name: string;
  description: string;
  type: HabitType;
  /** Optional text cues (TEXT kind). */
  cues?: string[];
};

export type HabitCompletionDto = {
  id: number;
  habitId: number;
  completedAt: Date;
};

export type HabitCueDto = {
  id: number;
  habitId: number;
  kind: HabitCueKind;
  /** TEXT cues store a string; other kinds may arrive later. */
  text: string;
};

export type HabitRewardDto = {
  id: number;
  habitId: number;
  kind: HabitRewardKind;
  points: number;
};

/**
 * Lightweight link to another habit in a stack.
 * Avoids nesting full HabitDto graphs (and recursion).
 */
export type HabitStackLinkDto = {
  id: number;
  habitId: number;
  name: string;
};

/** Read model for list/detail UI. Flat habit fields + related collections. */
export type HabitDto = {
  id: number;
  name: string;
  description: string;
  type: HabitType;
  createdAt: Date;
  updatedAt: Date;
  completions: HabitCompletionDto[];
  cues: HabitCueDto[];
  rewards: HabitRewardDto[];
  /** Predecessor when this habit is the successor (“After X”). */
  stackedAfter?: HabitStackLinkDto;
  /** Successors when this habit is the predecessor (“Then Y”). */
  stackedInto: HabitStackLinkDto[];
};
