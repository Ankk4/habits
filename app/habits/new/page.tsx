"use client";

import { useRouter } from "next/navigation";
import HabitCreateForm from "@/app/components/HabitCreateForm";
import { createHabit } from "@/lib/habits/habitClient";
import type { CreateHabitInput } from "@/lib/types/habit";

export default function NewHabitPage() {
  const router = useRouter();

  const handleSubmit = async (input: CreateHabitInput) => {
    await createHabit(input);
    router.push("/");
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl mx-auto flex-col py-12 px-6 sm:px-10 bg-white dark:bg-black">
        <HabitCreateForm
          onClose={() => router.push("/")}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
