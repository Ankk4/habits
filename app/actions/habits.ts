"use server";

import { create, list } from "@/lib/habits/habitService";
import type { CreateHabitInput, HabitDto } from "@/lib/types/habit";

export async function createHabitAction(
  input: CreateHabitInput,
): Promise<HabitDto> {
  return create(input);
}

export async function listHabitsAction(): Promise<HabitDto[]> {
  return list();
}
