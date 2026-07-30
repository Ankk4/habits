export type StreakTone = "zinc" | "amber" | "orange" | "hot";

export function streakTone(streak: number): StreakTone {
  if (streak <= 0) return "zinc";
  if (streak < 3) return "amber";
  if (streak < 7) return "orange";
  return "hot";
}

export function streakFlameClassName(tone: StreakTone): string {
  if (tone === "zinc") return "text-zinc-300";
  if (tone === "amber") return "text-amber-400";
  if (tone === "orange") return "text-orange-500";
  return "text-orange-600";
}

export function streakDotClassName(tone: StreakTone, done: boolean): string {
  if (!done) return "bg-zinc-200";
  if (tone === "zinc" || tone === "amber") return "bg-amber-400";
  if (tone === "orange") return "bg-orange-500";
  return "bg-orange-600";
}
