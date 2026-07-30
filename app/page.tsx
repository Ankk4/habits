import FilterTabs from "./components/FilterTabs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
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