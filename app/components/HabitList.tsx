'use client';

import { HabitDto } from "@/lib/types/habit";
import HabitCard from "./HabitCard";

export default function HabitList({ habits }: { habits: HabitDto[] }) {
    return (
      <ul className="flex flex-col gap-2 w-full">
        {habits.map((h) => (
          <li key={h.habit.id}>
            <HabitCard habit={h} />
          </li>
        ))}
    </ul>
  );
}