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

function CounterControls({
  progress,
  isSaving,
  onIncrement,
}: HabitCompletionControlsProps) {
  const { todayCount, todayTarget } = progress;
  const hasTarget = todayTarget != null && todayTarget > 0;
  const ratio = hasTarget ? Math.min(todayCount / todayTarget, 1) : 0;

  return (
    <div className="flex min-w-0 flex-col items-end gap-1.5">
      {hasTarget ? (
        <>
          <div className="flex items-center gap-2 text-xs font-medium tabular-nums text-zinc-600">
            <span>
              {todayCount}/{todayTarget}
            </span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/80 ring-1 ring-zinc-200">
              <div
                className="h-full rounded-full bg-zinc-700 transition-all duration-300"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
i          </div>
          <button
            type="button"
            onClick={() => onIncrement()}
            disabled={!progress.canIncrement || isSaving}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PlusIcon className="h-4 w-4" aria-hidden />
            {isSaving ? "Saving…" : progress.canIncrement ? "+1" : "Done"}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => onIncrement()}
          disabled={isSaving}
          className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
        >
          <PlusIcon className="h-4 w-4" aria-hidden />
          {isSaving ? "Saving…" : `Log (${todayCount})`}
        </button>
      )}
    </div>
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
  const completed = !progress.canIncrement;
  return (
    <button
      type="button"
      onClick={() => onIncrement()}
      disabled={completed || isSaving}
      className={`text-sm font-medium px-2 py-1 rounded-md border w-24 h-8 ${
        completed
          ? "border-zinc-200 bg-zinc-100 text-zinc-500 cursor-not-allowed opacity-70"
          : "border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-white"
      }`}
    >
      {isSaving ? "Saving…" : completed ? "Completed" : "Complete"}
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
