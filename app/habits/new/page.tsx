"use client";

import { useRouter } from "next/navigation";
import HabitCreateForm from "@/app/components/HabitCreateForm";

export default function NewHabitPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl mx-auto flex-col py-12 px-6 sm:px-10 bg-white dark:bg-black">
        <HabitCreateForm
          onClose={() => router.push("/")}
          onSubmit={(habit) => {
            console.log(habit);
            router.push("/");
          }}
        />
      </main>
    </div>
  );
}
