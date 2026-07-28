'use client';

import { Habit } from "@/lib/types/habit";
import HabitCard from "./HabitCard";

export default function HabitList({ habits }: { habits: Habit[] }) {
    return (
      <ul className="flex flex-col gap-2 w-full">
        {habits.map((h) => (
          <li key={h.id}>
            <HabitCard habit={h} />
          </li>
        ))}
      </ul>
    );
  }