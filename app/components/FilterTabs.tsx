"use client";

import { useState } from "react";
import FilterButton from "./FilterButton";
import HabitList from "./HabitList";
import { HabitDto } from "@/lib/types/habit";
import { habitDtosMockData } from "@/lib/habits/habitsMockData";

type Filter = "all" | "today" | "daily" | "weekly" | "monthly" | "yearly";
// TODO; This should be fetched from the database
const habitDtos: HabitDto[] = habitDtosMockData;

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
        {active === "all" && <HabitList habits={habitDtos} />}
        {active === "today" && <HabitList habits={habitDtos} />}
        {active === "daily" && <HabitList habits={habitDtos} />}
        {active === "weekly" && <HabitList habits={habitDtos} />}
        {active === "monthly" && <HabitList habits={habitDtos} />}
        {active === "yearly" && <HabitList habits={habitDtos} />}
      </>
    );
  }