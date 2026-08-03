import Link from "next/link";
import { getGold, listPendingItems } from "@/app/actions/items";
import { gameRegistry } from "@/lib/games/registry";
import PendingItemList from "./PendingItemList";
import SeedGoldButton from "./SeedGoldButton";

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const [gold, pending] = await Promise.all([getGold(), listPendingItems()]);

  return (
    <div className="min-h-full bg-[#0b1f14] font-sans text-emerald-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10 sm:px-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80">
              Gamba
            </p>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-amber-100">
              Games Hub
            </h1>
            <p className="mt-1 text-sm text-emerald-200/70">
              Spend owned gold. Open pending rewards into inventory.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-emerald-300/80 underline-offset-2 hover:text-amber-200 hover:underline"
          >
            ← Habits
          </Link>
        </header>

        <section className="rounded-lg border border-amber-700/40 bg-gradient-to-br from-emerald-950 to-[#0a1810] p-5 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-500/70">
                Owned gold
              </p>
              <p className="font-serif text-4xl font-bold text-amber-300 tabular-nums">
                {gold}
              </p>
            </div>
            {gold === 0 && (
              <div className="flex flex-col items-start gap-2">
                <p className="text-sm text-rose-300/90">
                  Empty coffers — complete habits or claim starter gold.
                </p>
                <SeedGoldButton />
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-serif text-xl text-amber-100">Reward queue</h2>
            {pending.length > 0 && (
              <span className="rounded bg-amber-700/40 px-2 py-0.5 text-xs font-medium text-amber-100">
                {pending.length} pending
              </span>
            )}
          </div>
          <PendingItemList items={pending} />
          {pending.length > 0 && (
            <p className="text-xs text-emerald-200/50">
              Open rewards to move gold into inventory before betting.
            </p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-xl text-amber-100">Games</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {gameRegistry.map((game) => (
              <li key={game.id}>
                {game.enabled ? (
                  <Link
                    href={game.href}
                    className="flex h-full flex-col gap-2 rounded-lg border border-amber-700/40 bg-emerald-950/80 p-4 transition-colors hover:border-amber-500/60 hover:bg-emerald-900/60"
                  >
                    <span className="font-serif text-lg text-amber-100">
                      {game.title}
                    </span>
                    <span className="text-sm text-emerald-200/70">
                      {game.description}
                    </span>
                    <span className="mt-auto text-xs text-amber-500/80">
                      Min bet {game.minBet} gold →
                    </span>
                  </Link>
                ) : (
                  <div className="flex h-full flex-col gap-2 rounded-lg border border-zinc-700/40 bg-zinc-900/40 p-4 opacity-60">
                    <span className="font-serif text-lg">{game.title}</span>
                    <span className="text-sm">Coming soon</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
