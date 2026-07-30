import { HabitCue } from "@/lib/types/habit";

export default function HabitCueField({ label, cue }: { label: string; cue: HabitCue }) {
    return <p>{label}: {cue.payload as string}</p>;
}