"use client";

import { CheckIcon, PlusIcon } from "lucide-react";
import { HabitCompletionMode } from "@/lib/types/habit";
import type { HabitProgress } from "@/lib/habits/progress";
import { formatTimeOfDay } from "@/lib/habits/schedule";

type HabitCompletionControlsProps = {
  progress: HabitProgress;
  isSaving: boolean;
  onIncrement: (slotTime?: string) => void;
};

const actionButtonClassName =
  "inline-flex h-8 items-center gap-1 rounded-md border border-zinc-300 bg-white px-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60";

function CompletedMark({ label }: { label: string }) {
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center text-emerald-600"
      aria-label={label}
    >
      <CheckIcon className="h-4 w-4" aria-hidden />
    </span>
  );
}

function CounterControls({
  progress,
  isSaving,
  onIncrement,
}: HabitCompletionControlsProps) {
  const { todayCount, todayTarget } = progress;
  const hasTarget = todayTarget != null && todayTarget > 0;

  if (hasTarget && !progress.canIncrement) {
    return <CompletedMark label="Done for today" />;
  }

  return (
    <button
      type="button"
      onClick={() => onIncrement()}
      disabled={!progress.canIncrement || isSaving}
      className={actionButtonClassName}
    >
      <PlusIcon className="h-4 w-4" aria-hidden />
      {isSaving
        ? "Saving…"
        : hasTarget
          ? "+1"
          : `Log (${todayCount})`}
    </button>
  );
}

function ScheduledControls({
  progress,
  isSaving,
  onIncrement,
}: HabitCompletionControlsProps) {
  return (
    <div className="flex flex-col gap-1">
      {progress.scheduledSlots.map((slot) => (
        <button
          key={slot.time}
          type="button"
          onClick={() => onIncrement(slot.time)}
          disabled={slot.done || isSaving}
          className={`inline-flex items-center justify-between gap-2 rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors ${
            slot.done
              ? "border-zinc-200 bg-zinc-100 text-zinc-400"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
          } disabled:cursor-not-allowed`}
        >
          <span>{formatTimeOfDay(slot.time)}</span>
          {slot.done ? (
            <CheckIcon className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <span className="text-zinc-400">{isSaving ? "…" : "Check in"}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function OnceControls({
  progress,
  isSaving,
  onIncrement,
}: HabitCompletionControlsProps) {
  if (!progress.canIncrement) {
    return <CompletedMark label="Completed today" />;
  }

  return (
    <button
      type="button"
      onClick={() => onIncrement()}
      disabled={isSaving}
      className={actionButtonClassName}
    >
      {isSaving ? "Saving…" : "Complete"}
    </button>
  );
}

export default function HabitCompletionControls(props: HabitCompletionControlsProps) {
  switch (props.progress.completionMode) {
    case HabitCompletionMode.COUNTER:
      return <CounterControls {...props} />;
    case HabitCompletionMode.SCHEDULED:
      return <ScheduledControls {...props} />;
    default:
      return <OnceControls {...props} />;
  }
}
