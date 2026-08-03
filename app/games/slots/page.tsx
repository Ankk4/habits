import Link from "next/link";
import { getGold } from "@/app/actions/items";
import SlotsMachine from "./SlotsMachine";

export const dynamic = "force-dynamic";

export default async function SlotsPage() {
  const gold = await getGold();

  return (
    <div className="min-h-full bg-[#0b1f14] font-sans text-emerald-50">
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-10 sm:px-10">
        <header className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80">
              Gamba
            </p>
            <h1 className="font-serif text-3xl font-bold text-amber-100">
              Slots
            </h1>
            <p className="mt-1 text-sm text-emerald-200/70">
              3 reels · bets 1 / 5 / 10 gold
            </p>
          </div>
          <Link
            href="/games"
            className="text-sm text-emerald-300/80 underline-offset-2 hover:text-amber-200 hover:underline"
          >
            ← Hub
          </Link>
        </header>

        <SlotsMachine initialGold={gold} />
      </main>
    </div>
  );
}
