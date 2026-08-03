import Link from "next/link";
import FilterTabs from "./components/FilterTabs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="mb-4 flex w-full items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            Habits
          </h1>
          <Link
            href="/games"
            className="rounded-md border border-amber-600/40 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-100"
          >
            Games →
          </Link>
        </div>
        <FilterTabs />
        <div className="flex flex-col gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Add Habit
          </button>
        </div>
      </main>
    </div>
  );
}
