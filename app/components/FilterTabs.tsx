"use client";

import { useEffect, useState } from "react";
import FilterButton from "./FilterButton";
import HabitList from "./HabitList";
import { listHabits } from "@/lib/habits/habitClient";
import {
  filterHabits,
  type HabitFilter,
} from "@/lib/habits/habitFilters";
import type { HabitDto } from "@/lib/types/habit";

const FILTERS: { id: HabitFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export default function FilterTabs() {
  const [active, setActive] = useState<HabitFilter>("today");
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

  const visible = filterHabits(habits, active);

  const handleHabitUpdated = (updated: HabitDto) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === updated.id ? updated : habit)),
    );
  };

  return (
    <>
      <ul className="flex flex-row gap-4 text-sm">
        {FILTERS.map(({ id, label }) => (
          <li key={id}>
            <FilterButton
              active={active === id}
              onClick={() => setActive(id)}
            >
              {label}
            </FilterButton>
          </li>
        ))}
      </ul>
      <hr className="w-full border-zinc-200 my-4" />

      <HabitList habits={visible} onHabitUpdated={handleHabitUpdated} />
    </>
  );
}
