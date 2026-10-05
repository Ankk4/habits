"use client";

import { HabitDto, HabitRewardDto, HabitType } from "@/lib/types/habit";
import {
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  FlameIcon,
  GiftIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { habitProgress } from "@/lib/habits/progress";
import {
  formatScheduleLabel,
  formatTimeOfDay,
  weekdayStrip,
} from "@/lib/habits/schedule";
import {
  streakDotClassName,
  streakFlameClassName,
  streakTone,
} from "@/lib/habits/streakStyles";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { recordHabitCompletion } from "@/lib/habits/habitClient";
import { HabitCompletionMode } from "@/lib/types/habit";
import { getMetaTracking } from "@/lib/habits/metaTrackingController";
import HabitCueField from "./HabitCueField";
import HabitCompletionControls from "./HabitCompletionControls";

const COMPLETE_THRESHOLD = 96;
const DRAG_ACTIVATE = 8;

function formatReward(reward: HabitRewardDto): string {
  return reward.points > 0 ? `${reward.points} pts` : "";
}

const habitClassName = (type: HabitType) => {
  if (type === "positive") {
    return "flex flex-col gap-1 rounded-md border-l-4 border-emerald-500 bg-emerald-50 p-2";
  }
  if (type === "negative") {
    return "flex flex-col gap-1 rounded-md border-l-4 border-rose-500 bg-rose-50 p-2";
  }
  return "flex flex-col gap-1 rounded-md border-l-4 border-yellow-500 bg-yellow-50 p-2";
};

export default function HabitCard({
  habit,
  onHabitUpdated,
}: {
  habit: HabitDto;
  onHabitUpdated?: (habit: HabitDto) => void;
}) {
  const [habitDataState, setHabitDataState] = useState(habit);
  const [isSaving, setIsSaving] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dragRef = useRef<{
    startX: number;
    offset: number;
    active: boolean;
    pointerId: number | null;
  }>({ startX: 0, offset: 0, active: false, pointerId: null });

  const progress = habitProgress(habitDataState);
  const metaTracking = getMetaTracking(
    habitDataState.completions,
    habitDataState.id,
  );
  const week = progress.weekDaysCompletion;
  const canComplete = progress.canIncrement && !isSaving;
  const isScheduledMode =
    habitDataState.schedule.completionMode === HabitCompletionMode.SCHEDULED;
  const completeProgress = Math.min(dragOffset / COMPLETE_THRESHOLD, 1);
  const streak = metaTracking.streak;
  const tone = streakTone(streak);
  const scheduleLabel = formatScheduleLabel(habitDataState.schedule);
  const weekStrip = weekdayStrip(habitDataState.schedule);

  useEffect(() => {
    setHabitDataState(habit);
  }, [habit]);

  const completeHabit = async (slotTime?: string) => {
    if (isSaving) return;
    if (slotTime === undefined && !progress.canIncrement) return;

    setIsSaving(true);
    try {
      const completion = await recordHabitCompletion(habitDataState.id, {
        slotTime,
      });
      const updated: HabitDto = {
        ...habitDataState,
        completions: [...habitDataState.completions, completion],
      };
      setHabitDataState(updated);
      onHabitUpdated?.(updated);
    } catch (error) {
      console.error("Failed to record habit completion", error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetDrag = () => {
    dragRef.current = { startX: 0, offset: 0, active: false, pointerId: null };
    setIsDragging(false);
    setDragOffset(0);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!canComplete) return;
    if ((e.target as HTMLElement).closest("button")) return;

    dragRef.current = {
      startX: e.clientX,
      offset: 0,
      active: false,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId !== e.pointerId || !canComplete) return;

    const deltaX = e.clientX - drag.startX;

    if (!drag.active) {
      if (deltaX < DRAG_ACTIVATE) return;
      drag.active = true;
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    const offset = Math.max(0, deltaX);
    drag.offset = offset;
    setDragOffset(offset);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId !== e.pointerId) return;

    if (drag.active && drag.offset >= COMPLETE_THRESHOLD) {
      void completeHabit(progress.nextOpenSlot);
    }

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    resetDrag();
  };

  return (
    <div className="relative overflow-hidden rounded-md touch-pan-y">
      <div
        className="absolute inset-0 flex items-center gap-2 bg-emerald-500 pl-4 text-sm font-medium text-white"
        aria-hidden
      >
        <CheckIcon
          className="h-5 w-5 transition-transform duration-150"
          style={{
            opacity: completeProgress,
            transform: `scale(${0.7 + completeProgress * 0.3})`,
          }}
        />
        <span style={{ opacity: completeProgress }}>Complete</span>
      </div>

      <div
        className={`${habitClassName(habitDataState.type)} relative select-none ${
          isDragging ? "cursor-grabbing" : canComplete ? "cursor-grab" : ""
        }`}
        style={{
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? "none" : "transform 200ms ease-out",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={resetDrag}
      >
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-black">{habitDataState.name}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
                <ClockIcon className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
                <span>{scheduleLabel}</span>
              </span>
              {progress.todayTarget != null &&
                (isScheduledMode ||
                  habitDataState.schedule.completionMode ===
                    HabitCompletionMode.COUNTER) && (
                  <span className="text-xs font-medium tabular-nums text-zinc-600">
                    {progress.todayCount}/{progress.todayTarget}
                  </span>
                )}
            </div>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-1">
            {!isScheduledMode && (
              <HabitCompletionControls
                progress={progress}
                isSaving={isSaving}
                onIncrement={(slotTime) => void completeHabit(slotTime)}
              />
            )}
            {isScheduledMode && progress.nextOpenSlot && (
              <button
                type="button"
                onClick={() => void completeHabit(progress.nextOpenSlot)}
                disabled={isSaving}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-medium tabular-nums text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                aria-label={`Check in ${formatTimeOfDay(progress.nextOpenSlot)}`}
              >
                <span>{formatTimeOfDay(progress.nextOpenSlot)}</span>
                <CheckIcon className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
            {isScheduledMode &&
              !progress.nextOpenSlot &&
              progress.completedToday && (
                <span
                  className="inline-flex h-8 w-8 items-center justify-center text-emerald-600"
                  aria-label="Done for today"
                >
                  <CheckIcon className="h-4 w-4" aria-hidden />
                </span>
              )}
            <button
              type="button"
              aria-label="Delete habit"
              className="inline-flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-800"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Edit habit"
              className="inline-flex h-8 w-8 items-center justify-center text-zinc-500 hover:text-zinc-800"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 pl-2 text-left text-sm text-gray-500">
          <div
            className="flex items-center gap-3"
            aria-label={`Current streak: ${streak} days`}
          >
            <div className="flex items-center gap-1 tabular-nums">
              <FlameIcon
                className={`h-4 w-4 ${streakFlameClassName(tone)}`}
                fill={streak > 0 ? "currentColor" : "none"}
                aria-hidden
              />
              <span
                className={`text-sm font-semibold ${
                  streak > 0 ? "text-zinc-700" : "text-zinc-400"
                }`}
              >
                {streak}
              </span>
            </div>
            <div className="flex items-center gap-1" aria-hidden>
              {week.map((day, i) => (
                <span
                  key={i}
                  className={`rounded-[2px] ${
                    day.isToday ? "h-2 w-2" : "h-1.5 w-1.5"
                  } ${streakDotClassName(tone, day.done)}`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDetailsOpen((open) => !open)}
            className="flex w-full items-center gap-2 text-zinc-400 hover:text-zinc-600"
            aria-expanded={detailsOpen}
            aria-label={detailsOpen ? "Hide details" : "Show details"}
          >
            <hr className="min-w-0 flex-1 border-zinc-200" />
            <ChevronDownIcon
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                detailsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {detailsOpen && (
            <div className="flex flex-col gap-2">
              {isScheduledMode && (
                <HabitCompletionControls
                  progress={progress}
                  isSaving={isSaving}
                  onIncrement={(slotTime) => void completeHabit(slotTime)}
                />
              )}

              {isScheduledMode &&
                habitDataState.schedule.scheduledTimes.length > 1 && (
                  <p className="text-xs text-zinc-500">
                    {habitDataState.schedule.scheduledTimes
                      .map(formatTimeOfDay)
                      .join(" · ")}
                  </p>
                )}

              <div className="flex items-center gap-1" aria-label="Scheduled days">
                {weekStrip.map(({ label, iso, active }) => (
                  <span
                    key={iso}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                      active
                        ? "bg-zinc-800 text-white"
                        : "bg-white/60 text-zinc-400 ring-1 ring-zinc-200"
                    }`}
                  >
                    {label.charAt(0)}
                  </span>
                ))}
              </div>

              {habitDataState.description && <p>{habitDataState.description}</p>}

              {(habitDataState.stackedAfter ||
                habitDataState.stackedInto.length > 0) && (
                <p
                  className="text-xs font-medium text-zinc-600"
                  aria-label="Habit stack"
                >
                  {habitDataState.stackedAfter && (
                    <span>
                      After{" "}
                      <span className="font-semibold text-zinc-800">
                        {habitDataState.stackedAfter.name}
                      </span>
                    </span>
                  )}
                  {habitDataState.stackedAfter &&
                    habitDataState.stackedInto.length > 0 && (
                      <span className="text-zinc-400"> · </span>
                    )}
                  {habitDataState.stackedInto.length > 0 && (
                    <span>
                      Then{" "}
                      <span className="font-semibold text-zinc-800">
                        {habitDataState.stackedInto
                          .map((s) => s.name)
                          .join(", ")}
                      </span>
                    </span>
                  )}
                </p>
              )}

              {habitDataState.rewards.some((r) => r.points > 0) && (
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <GiftIcon className="h-4 w-4 text-zinc-400" aria-hidden />
                  <p>
                    {habitDataState.rewards
                      .map(formatReward)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-x-4 gap-y-0.5 text-xs text-zinc-500">
                <div className="flex flex-col gap-0.5 text-xs text-zinc-600">
                  {habitDataState.cues.map((cue) => (
                    <HabitCueField key={cue.id} label={cue.kind} cue={cue} />
                  ))}
                </div>

                <div className="flex flex-col gap-0.5">
                  <p>
                    Created: {habitDataState.createdAt.toLocaleDateString()}
                  </p>
                  <p>
                    Last completed:{" "}
                    {habitDataState.completions.length > 0
                      ? habitDataState.completions[
                          habitDataState.completions.length - 1
                        ]?.completedAt.toLocaleDateString()
                      : "Never"}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p>Streak: {metaTracking.streak}</p>
                  <p>
                    Longest streak: {metaTracking.longestStreak} /{" "}
                    {metaTracking.longestCompletionStreak}
                  </p>
                  <p>Average streak: {metaTracking.averageStreak}</p>
                  <p>
                    Average completion rate:{" "}
                    {metaTracking.averageCompletionRate}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
