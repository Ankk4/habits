import { queryAll, run, lastInsertId } from "../db/query";
import { defaultSchedule, encodeDaysOfWeek, encodeScheduledTimes, parseSchedule } from "./schedule";
import {
  CreateHabitInput,
  HabitCompletionDto,
  HabitCompletionMode,
  HabitCueDto,
  HabitCueKind,
  HabitDto,
  HabitRewardDto,
  HabitRewardKind,
  HabitSchedule,
  HabitStackLinkDto,
  HabitType,
} from "../types/habit";

type HabitRow = {
  id: number;
  name: string;
  description: string;
  type: HabitType;
  cadence?: string | null;
  days_of_week?: string | null;
  completion_mode?: string | null;
  daily_target?: number | null;
  scheduled_times?: string | null;
  created_at: string;
  updated_at: string;
};

type CompletionRow = {
  id: number;
  habit_id: number;
  completed_at: string;
  slot_time?: string | null;
};

type CueRow = {
  id: number;
  habit_id: number;
  kind: HabitCueKind;
  payload: string | null;
};

type RewardRow = {
  id: number;
  habit_id: number;
  kind: HabitRewardKind;
  payload: string | null;
};

type StackRow = {
  id: number;
  predecessor_id: number;
  successor_id: number;
  predecessor_name: string;
  successor_name: string;
};

function rewardPoints(payload: string | null): number {
  if (!payload) return 0;
  try {
    const parsed = JSON.parse(payload) as { points?: unknown };
    const points = Number(parsed.points);
    return Number.isFinite(points) ? points : 0;
  } catch {
    const points = Number(payload);
    return Number.isFinite(points) ? points : 0;
  }
}

function toCompletionDto(row: CompletionRow): HabitCompletionDto {
  return {
    id: row.id,
    habitId: row.habit_id,
    completedAt: new Date(row.completed_at),
    slotTime: row.slot_time ?? undefined,
  };
}

function toCueDto(row: CueRow): HabitCueDto {
  return {
    id: row.id,
    habitId: row.habit_id,
    kind: row.kind,
    text: row.payload ?? "",
  };
}

function toRewardDto(row: RewardRow): HabitRewardDto {
  return {
    id: row.id,
    habitId: row.habit_id,
    kind: row.kind,
    points: rewardPoints(row.payload),
  };
}

function assembleHabitDto(
  habit: HabitRow,
  completions: HabitCompletionDto[],
  cues: HabitCueDto[],
  rewards: HabitRewardDto[],
  stackedAfter?: HabitStackLinkDto,
  stackedInto: HabitStackLinkDto[] = [],
): HabitDto {
  return {
    id: habit.id,
    name: habit.name,
    description: habit.description,
    type: habit.type,
    createdAt: new Date(habit.created_at),
    updatedAt: new Date(habit.updated_at),
    schedule: parseSchedule(habit),
    completions,
    cues,
    rewards,
    stackedAfter,
    stackedInto,
  };
}

function scheduleForInsert(schedule?: HabitSchedule) {
  const resolved = schedule ?? defaultSchedule();
  return {
    cadence: resolved.cadence,
    daysOfWeek: encodeDaysOfWeek(resolved.daysOfWeek),
    completionMode: resolved.completionMode,
    dailyTarget:
      resolved.dailyTarget === undefined ? null : resolved.dailyTarget,
    scheduledTimes: encodeScheduledTimes(resolved.scheduledTimes),
  };
}

async function getHabitSchedule(habitId: number): Promise<HabitSchedule> {
  const rows = await queryAll<HabitRow>(
    `SELECT cadence, days_of_week, completion_mode, daily_target, scheduled_times
     FROM habit WHERE id = :habitId`,
    { ":habitId": habitId },
  );
  if (rows.length === 0) {
    throw new Error(`Habit ${habitId} not found`);
  }
  return parseSchedule(rows[0]);
}

export async function listHabits(): Promise<HabitDto[]> {
  const habits = await queryAll<HabitRow>(
    `SELECT id, name, description, type, cadence, days_of_week,
            completion_mode, daily_target, scheduled_times, created_at, updated_at
     FROM habit
     ORDER BY created_at ASC`,
  );

  if (habits.length === 0) return [];

  const completions = await queryAll<CompletionRow>(
    "SELECT id, habit_id, completed_at, slot_time FROM habit_completion",
  );
  const cues = await queryAll<CueRow>(
    "SELECT id, habit_id, kind, payload FROM habit_cue",
  );
  const rewards = await queryAll<RewardRow>(
    "SELECT id, habit_id, kind, payload FROM habit_reward",
  );
  const stacks = await queryAll<StackRow>(`
      SELECT
        hs.id,
        hs.predecessor_id,
        hs.successor_id,
        p.name AS predecessor_name,
        s.name AS successor_name
      FROM habit_stack hs
      JOIN habit p ON p.id = hs.predecessor_id
      JOIN habit s ON s.id = hs.successor_id
    `);

  const completionsByHabit = groupBy(completions, (row) => row.habit_id);
  const cuesByHabit = groupBy(cues, (row) => row.habit_id);
  const rewardsByHabit = groupBy(rewards, (row) => row.habit_id);

  const stackedAfterBySuccessor = new Map<number, StackRow>();
  const stackedIntoByPredecessor = new Map<number, StackRow[]>();
  for (const stack of stacks) {
    stackedAfterBySuccessor.set(stack.successor_id, stack);
    const links = stackedIntoByPredecessor.get(stack.predecessor_id) ?? [];
    links.push(stack);
    stackedIntoByPredecessor.set(stack.predecessor_id, links);
  }

  return habits.map((habit) => {
    const after = stackedAfterBySuccessor.get(habit.id);
    return assembleHabitDto(
      habit,
      (completionsByHabit.get(habit.id) ?? []).map(toCompletionDto),
      (cuesByHabit.get(habit.id) ?? []).map(toCueDto),
      (rewardsByHabit.get(habit.id) ?? []).map(toRewardDto),
      after
        ? {
            id: after.id,
            habitId: after.predecessor_id,
            name: after.predecessor_name,
          }
        : undefined,
      (stackedIntoByPredecessor.get(habit.id) ?? []).map((stack) => ({
        id: stack.id,
        habitId: stack.successor_id,
        name: stack.successor_name,
      })),
    );
  });
}

export async function createHabit(input: CreateHabitInput): Promise<HabitDto> {
  const now = new Date().toISOString();
  const schedule = scheduleForInsert(input.schedule);

  await run(
    `INSERT INTO habit (
       name, description, type, cadence, days_of_week,
       completion_mode, daily_target, scheduled_times, created_at, updated_at
     )
     VALUES (
       :name, :description, :type, :cadence, :daysOfWeek,
       :completionMode, :dailyTarget, :scheduledTimes, :createdAt, :updatedAt
     )`,
    {
      ":name": input.name,
      ":description": input.description,
      ":type": input.type,
      ":cadence": schedule.cadence,
      ":daysOfWeek": schedule.daysOfWeek,
      ":completionMode": schedule.completionMode,
      ":dailyTarget": schedule.dailyTarget,
      ":scheduledTimes": schedule.scheduledTimes,
      ":createdAt": now,
      ":updatedAt": now,
    },
  );

  const habitId = await lastInsertId();

  for (const text of input.cues ?? []) {
    const trimmed = text.trim();
    if (!trimmed) continue;
    await run(
      `INSERT INTO habit_cue (habit_id, kind, payload)
       VALUES (:habitId, :kind, :payload)`,
      {
        ":habitId": habitId,
        ":kind": HabitCueKind.TEXT,
        ":payload": trimmed,
      },
    );
  }

  const habits = await listHabits();
  const created = habits.find((habit) => habit.id === habitId);
  if (!created) {
    throw new Error(`Failed to load habit ${habitId} after insert`);
  }
  return created;
}

export type RecordCompletionInput = {
  completedAt?: Date;
  slotTime?: string;
};

export async function recordHabitCompletion(
  habitId: number,
  input: RecordCompletionInput = {},
): Promise<HabitCompletionDto> {
  const completedAt = input.completedAt ?? new Date();
  const completedAtIso = completedAt.toISOString();
  const schedule = await getHabitSchedule(habitId);
  const slotTime = input.slotTime;

  if (schedule.completionMode === HabitCompletionMode.SCHEDULED) {
    if (!slotTime) {
      throw new Error("slotTime is required for scheduled habits");
    }
    if (!schedule.scheduledTimes.includes(slotTime)) {
      throw new Error(`Invalid slot time ${slotTime} for habit ${habitId}`);
    }
    const taken = await queryAll<{ id: number }>(
      `SELECT id FROM habit_completion
       WHERE habit_id = :habitId
         AND slot_time = :slotTime
         AND date(completed_at) = date(:completedAt)`,
      {
        ":habitId": habitId,
        ":slotTime": slotTime,
        ":completedAt": completedAtIso,
      },
    );
    if (taken.length > 0) {
      throw new Error(`Slot ${slotTime} already completed today`);
    }
  } else if (schedule.completionMode === HabitCompletionMode.ONCE) {
    const taken = await queryAll<{ id: number }>(
      `SELECT id FROM habit_completion
       WHERE habit_id = :habitId
         AND date(completed_at) = date(:completedAt)`,
      {
        ":habitId": habitId,
        ":completedAt": completedAtIso,
      },
    );
    if (taken.length > 0) {
      throw new Error(`Habit ${habitId} is already completed for this day`);
    }
  } else if (schedule.completionMode === HabitCompletionMode.COUNTER) {
    if (
      schedule.dailyTarget != null &&
      schedule.dailyTarget > 0
    ) {
      const todayCount = await queryAll<{ count: number }>(
        `SELECT COUNT(*) AS count FROM habit_completion
         WHERE habit_id = :habitId
           AND date(completed_at) = date(:completedAt)`,
        {
          ":habitId": habitId,
          ":completedAt": completedAtIso,
        },
      );
      if ((todayCount[0]?.count ?? 0) >= schedule.dailyTarget) {
        throw new Error(`Daily target of ${schedule.dailyTarget} already met`);
      }
    }
  }

  await run(
    `INSERT INTO habit_completion (habit_id, completed_at, slot_time)
     VALUES (:habitId, :completedAt, :slotTime)`,
    {
      ":habitId": habitId,
      ":completedAt": completedAtIso,
      ":slotTime": slotTime ?? null,
    },
  );

  const id = await lastInsertId();
  return { id, habitId, completedAt, slotTime };
}

function groupBy<T>(
  items: T[],
  keyFn: (item: T) => number,
): Map<number, T[]> {
  const map = new Map<number, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = map.get(key) ?? [];
    group.push(item);
    map.set(key, group);
  }
  return map;
}
