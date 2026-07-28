// TODO: Create a HabitCard component

import { Habit } from "@/lib/types/habit";

export const habitClassName = (type: string) => {
    return type === "positive"
      ? "flex flex-col gap-1 rounded-md border-l-4 border-emerald-500 bg-gray-100 p-2"
      : "flex flex-col gap-1 rounded-md border-l-4 border-rose-500 bg-gray-100 p-2"
  }

export default function HabitCard({ habit }: { habit: Habit }) {
    return (
        <div className={habitClassName(habit.type)}>
            <div className="text-lg font-bold flex flex-row gap-2 justify-between">
                <p>{habit.name}</p>
                <span className="text-sm text-gray-500">
                    {habit.type === "positive" ? <p className="">Positive</p> : <p className="">Negative</p>}
                </span>
            </div>
            <div className="text-sm text-gray-500 text-left pl-2">{habit.description}</div>
        </div>
    )
}