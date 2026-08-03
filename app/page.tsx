"use client";
import FilterTabs from "./components/FilterTabs";
import HabitCreateForm from "./components/HabitCreateForm";
import { useState } from "react";

export default function Home() {
  const [showHabitCreateForm, setShowHabitCreateForm] = useState(false);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <FilterTabs />
        
        <div className="flex flex-col gap-4">
          
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
            setShowHabitCreateForm(!showHabitCreateForm);
          }}>
            Add Habit
          </button>


          {showHabitCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowHabitCreateForm(false)}>
              <div className="..." onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <HabitCreateForm 
                onClose={() => setShowHabitCreateForm(false)} 
                onSubmit={(habit) => {
                  console.log(habit);
                  setShowHabitCreateForm(false);
                }} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}