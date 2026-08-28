/** Shared habit contracts for UI and the browser SQLite client. */

export enum HabitType {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NEUTRAL = "neutral",
}

export enum HabitCadence {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** How daily completions are tracked and displayed. */
export enum HabitCompletionMode {
  /** One check-in satisfies the day. */
  ONCE = "once",
  /** Count toward a daily target (+1); null target = unlimited logging. */
  COUNTER = "counter",
  /** Distinct check-ins per scheduled time each day. */
  SCHEDULED = "scheduled",
}

export type HabitSchedule = {
  cadence: HabitCadence;
  /** Empty means every day (daily) or not applicable. */
  daysOfWeek: IsoWeekday[];
  completionMode: HabitCompletionMode;
  /** Counter mode: daily goal. Null = unlimited (e.g. negative habit logging). */
  dailyTarget?: number | null;
  /** Sorted HH:MM times for daily check-ins (once, scheduled, or counter cues). */
  scheduledTimes: string[];
};

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
  schedule?: HabitSchedule;
  /** Optional text cues (TEXT kind). */
  cues?: string[];
};

export type HabitCompletionDto = {
  id: number;
  habitId: number;
  completedAt: Date;
  /** Scheduled mode: which HH:MM slot was checked off. */
  slotTime?: string;
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
  schedule: HabitSchedule;
  completions: HabitCompletionDto[];
  cues: HabitCueDto[];
  rewards: HabitRewardDto[];
  /** Predecessor when this habit is the successor (“After X”). */
  stackedAfter?: HabitStackLinkDto;
  /** Successors when this habit is the predecessor (“Then Y”). */
  stackedInto: HabitStackLinkDto[];
};
