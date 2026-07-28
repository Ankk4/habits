"use client";

import { useState } from "react";
import FilterButton from "./FilterButton";
import HabitList from "./HabitList";
import { Habit } from "@/lib/types/habit";

type Filter = "all" | "today" | "daily" | "weekly" | "monthly" | "yearly";
// TODO; This should be fetched from the database
const habits: Habit[] = [
  { id: 1, name: "Habit 1", description: "Habit 1 description", type: "negative", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "Habit 2", description: "Habit 2 description", type: "positive", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "Habit 3", description: "Habit 3 description", type: "positive", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, name: "Habit 4", description: "Habit 4 description", type: "positive", createdAt: new Date(), updatedAt: new Date() },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export default function FilterTabs() {
    const [active, setActive] = useState<Filter>("today");
  
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
  
        {/* Layout / content switches with the tab */}
        {active === "all" && <HabitList habits={habits} />}
        {active === "today" && <HabitList habits={habits} />}
        {active === "daily" && <HabitList habits={habits} />}
        {active === "weekly" && <HabitList habits={habits} />}
        {active === "monthly" && <HabitList habits={habits} />}
        {active === "yearly" && <HabitList habits={habits} />}
      </>
    );
  }