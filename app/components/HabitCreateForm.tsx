"use client";

import { useState } from "react";
import { CreateHabitInput, HabitType } from "@/lib/types/habit";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cues = cueText.trim() ? [cueText.trim()] : undefined;
    onSubmit({ name, description, type, cues });
  };

  return (
    <div className="dark:bg-black white:bg-white p-6 rounded-md border border-gray-300 dark:border-gray-700 shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-4">Create Habit</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block dark:bg-gray-700 dark:text-white w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={1}
            cols={35}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block dark:bg-gray-700 dark:text-white w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as HabitType)}
            className="block dark:bg-gray-700 dark:text-white w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          >
            <option value={HabitType.POSITIVE}>Positive</option>
            <option value={HabitType.NEGATIVE}>Negative</option>
            <option value={HabitType.NEUTRAL}>Neutral</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="cue"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Cue (optional)
          </label>
          <input
            type="text"
            id="cue"
            value={cueText}
            onChange={(e) => setCueText(e.target.value)}
            className="block dark:bg-gray-700 dark:text-white w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md w-full"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
            disabled={!name || !description || !type}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
