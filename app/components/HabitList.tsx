"use client";

import { HabitDto } from "@/lib/types/habit";
import HabitCard from "./HabitCard";

export default function HabitList({
  habits,
  onHabitUpdated,
}: {
  habits: HabitDto[];
  onHabitUpdated?: (habit: HabitDto) => void;
}) {
  return (
    <ul className="flex flex-col gap-2 w-full">
      {habits.map((h) => (
        <li key={h.id}>
          <HabitCard habit={h} onHabitUpdated={onHabitUpdated} />
        </li>
      ))}
    </ul>
  );
}
