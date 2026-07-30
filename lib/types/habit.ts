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

export type Habit = {
  id: number;
  name: string;
  description: string;
  type: HabitType;
  createdAt: Date;
  updatedAt: Date;
};

export type HabitCompletion = {
  id: number;
  habit: Habit;
  date: Date;
};

export type HabitCue = {
  id: number;
  habit: Habit;
  kind: HabitCueKind;
  payload: unknown;
};

export type HabitReward = {
  id: number;
  habit: Habit;
  kind: HabitRewardKind;
  payload: unknown;
};

/** Directed stack edge: after predecessor completes → do successor. */
export type HabitStack = {
  id: number;
  predecessor: Habit;
  successor: Habit;
  createdAt: Date;
  updatedAt: Date;
};

export type HabitDto = {
  habit: Habit;
  completions: HabitCompletion[];
  cues: HabitCue[];
  rewards: HabitReward[];
  /** Present when this habit is stacked after another (this habit is successor). */
  stackedAfter?: HabitStack;
  /** Habits this one leads into (this habit is predecessor). */
  stackedInto: HabitStack[];
};
