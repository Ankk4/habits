import { HabitCueDto } from "@/lib/types/habit";

export default function HabitCueField({
  label,
  cue,
}: {
  label: string;
  cue: HabitCueDto;
}) {
  return (
    <p>
      {label}: {cue.text}
    </p>
  );
}
