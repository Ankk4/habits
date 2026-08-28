"use client";

import { useEffect, useState } from "react";
import { listHabits } from "@/lib/habits/habitClient";
import { CreateHabitInput, HabitDto, HabitType } from "@/lib/types/habit";

const fieldClass =
  "block w-full rounded-md border border-gray-300 bg-white p-3 text-base dark:border-gray-700 dark:bg-gray-900 dark:text-white";

export default function HabitCreateForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (input: CreateHabitInput) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(HabitType.POSITIVE);
  const [cueText, setCueText] = useState("");
  const [stack, setStack] = useState<"before" | "after" | undefined>(undefined);
  const [showStackEditor, setShowStackEditor] = useState(false);
  const [habits, setHabits] = useState<HabitDto[]>([]);

  useEffect(() => {
    let cancelled = false;
    listHabits().then((loaded) => {
      if (!cancelled) setHabits(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cues = cueText.trim() ? [cueText.trim()] : undefined;
    onSubmit({ name, description, type, cues });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Create Habit</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-5 py-2.5 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-5 py-2.5 text-white dark:bg-blue-600 disabled:opacity-50"
              disabled={!name || !description || !type}
            >
              Create
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label
              htmlFor="type"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Karma
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as HabitType)}
              className={fieldClass}
            >
              <option value={HabitType.POSITIVE}>Positive</option>
              <option value={HabitType.NEGATIVE}>Negative</option>
              <option value={HabitType.NEUTRAL}>Neutral</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${fieldClass} resize-y min-h-24`}
          />
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <label
              htmlFor="cue"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Cue (optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="stack"
                className="size-5 shrink-0 accent-blue-500"
                checked={showStackEditor}
                onChange={(e) => setShowStackEditor(e.target.checked)}
              />
              <label
                htmlFor="stack"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Stack with another habit
              </label>
            </div>
          </div>

          {/* If showing stack editor, list habits to stack with TODO: populate with existing habits */}
          {showStackEditor ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* TODO: Show stacked habits here as list of rectangles that can be dragged and dropped to reorder */}
              {habits.map((habit: HabitDto) => (
                <div
                  key={habit.id}
                  className="rounded-md bg-gray-100 p-4 dark:bg-gray-800"
                >
                  {habit.name}
                </div>
              ))}
            </div>
          ) : (
            <input
              type="text"
              id="cue"
              value={cueText}
              onChange={(e) => setCueText(e.target.value)}
              className={fieldClass}
            />
          )}
        </div>
      </form>
    </div>
  );
}
