import { createClient } from "../db/Database";
import { Habit } from "../db/entities/Habit";
import { HabitCue } from "../db/entities/HabitCue";
import { HabitReward } from "../db/entities/HabitReward";
import { HabitStack } from "../db/entities/HabitStack";
import {
  CreateHabitInput,
  HabitCueDto,
  HabitCueKind,
  HabitDto,
  HabitRewardDto,
  HabitStackLinkDto,
} from "../types/habit";

function cueText(payload: unknown): string {
  if (typeof payload === "string") return payload;
  if (
    payload !== null &&
    typeof payload === "object" &&
    "text" in payload &&
    typeof (payload as { text: unknown }).text === "string"
  ) {
    return (payload as { text: string }).text;
  }
  return "";
}

function rewardPoints(payload: unknown): number {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "points" in payload
  ) {
    const points = Number((payload as { points: unknown }).points);
    return Number.isFinite(points) ? points : 0;
  }
  return 0;
}

function toCueDto(cue: HabitCue): HabitCueDto {
  return {
    id: cue.id,
    habitId: cue.habit.id,
    kind: cue.kind,
    text: cueText(cue.payload),
  };
}

function toRewardDto(reward: HabitReward): HabitRewardDto {
  return {
    id: reward.id,
    habitId: reward.habit.id,
    kind: reward.kind,
    points: rewardPoints(reward.payload),
  };
}

function toStackLink(
  stack: HabitStack,
  side: "predecessor" | "successor",
): HabitStackLinkDto {
  const other = side === "predecessor" ? stack.predecessor : stack.successor;
  return {
    id: stack.id,
    habitId: other.id,
    name: other.name,
  };
}

export function toHabitDto(habit: Habit): HabitDto {
  return {
    id: habit.id,
    name: habit.name,
    description: habit.description,
    type: habit.type,
    createdAt: habit.createdAt,
    updatedAt: habit.updatedAt,
    completions: (habit.completions ?? []).map((completion) => ({
      id: completion.id,
      habitId: completion.habit.id,
      completedAt: completion.completedAt,
    })),
    cues: (habit.cues ?? []).map(toCueDto),
    rewards: (habit.rewards ?? []).map(toRewardDto),
    stackedAfter: habit.stackAsSuccessor
      ? toStackLink(habit.stackAsSuccessor, "predecessor")
      : undefined,
    stackedInto: (habit.stacksAsPredecessor ?? []).map((stack) =>
      toStackLink(stack, "successor"),
    ),
  };
}

const HABIT_POPULATE = [
  "completions",
  "cues",
  "rewards",
  "stacksAsPredecessor",
  "stacksAsPredecessor.successor",
  "stackAsSuccessor",
  "stackAsSuccessor.predecessor",
] as const;

export async function create(input: CreateHabitInput): Promise<HabitDto> {
  const orm = await createClient();
  const em = orm.em.fork();

  const habit = em.create(Habit, {
    name: input.name,
    description: input.description,
    type: input.type,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  em.persist(habit);

  for (const text of input.cues ?? []) {
    const trimmed = text.trim();
    if (!trimmed) continue;
    em.persist(
      em.create(HabitCue, {
        habit,
        kind: HabitCueKind.TEXT,
        payload: trimmed,
      }),
    );
  }

  await em.flush();

  const saved = await em.findOneOrFail(
    Habit,
    { id: habit.id },
    { populate: [...HABIT_POPULATE] },
  );
  return toHabitDto(saved);
}

export async function list(): Promise<HabitDto[]> {
  const orm = await createClient();
  const em = orm.em.fork();
  const habits = await em.find(
    Habit,
    {},
    {
      populate: [...HABIT_POPULATE],
      orderBy: { createdAt: "ASC" },
    },
  );
  return habits.map(toHabitDto);
}
