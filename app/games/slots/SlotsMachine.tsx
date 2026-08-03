"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { playSlots } from "@/app/actions/slots";
import { SLOT_STAKES, type SlotStake } from "@/lib/games/slots/paytable";
import type { SlotSymbol } from "@/lib/games/slots/paytable";

const SPIN_SYMBOLS: SlotSymbol[] = ["🍒", "🍋", "🔔", "⭐", "7️⃣"];

type Props = {
  initialGold: number;
};

export default function SlotsMachine({ initialGold }: Props) {
  const [gold, setGold] = useState(initialGold);
  const [stake, setStake] = useState<SlotStake>(1);
  const [reels, setReels] = useState<[SlotSymbol, SlotSymbol, SlotSymbol]>([
    "🍒",
    "🍋",
    "🔔",
  ]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const visibleRef = useRef(true);

  useEffect(() => {
    setGold(initialGold);
  }, [initialGold]);

  useEffect(() => {
    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const animateTo = async (
    target: [SlotSymbol, SlotSymbol, SlotSymbol],
  ) => {
    setSpinning(true);
    const steps = 12;
    for (let i = 0; i < steps; i++) {
      if (!visibleRef.current) {
        // skip animation frames while tab hidden
        continue;
      }
      setReels([
        SPIN_SYMBOLS[Math.floor(Math.random() * SPIN_SYMBOLS.length)]!,
        SPIN_SYMBOLS[Math.floor(Math.random() * SPIN_SYMBOLS.length)]!,
        SPIN_SYMBOLS[Math.floor(Math.random() * SPIN_SYMBOLS.length)]!,
      ]);
      await new Promise((r) => setTimeout(r, 60 + i * 12));
    }
    setReels(target);
    setSpinning(false);
  };

  const spin = () => {
    if (spinning || pending) return;
    setMessage(null);
    startTransition(async () => {
      const result = await playSlots(stake);
      if (!result.ok) {
        setMessage(result.error);
        setGold(result.gold);
        return;
      }
      await animateTo(result.reels);
      setGold(result.gold);
      if (result.payout > 0) {
        setMessage(`Win! +${result.payout} gold`);
      } else {
        setMessage("No win — try again");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-amber-500/70">
            Gold
          </p>
          <p className="font-serif text-3xl font-bold text-amber-300 tabular-nums">
            {gold}
          </p>
        </div>
        {gold < stake && (
          <p className="max-w-[14rem] text-sm text-rose-300">
            Not enough gold. Complete habits or open rewards in the hub.
          </p>
        )}
      </div>

      <div className="rounded-xl border-2 border-amber-600/50 bg-[#07140e] p-6 shadow-inner shadow-black/50">
        <div className="grid grid-cols-3 gap-3">
          {reels.map((symbol, i) => (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-lg border border-amber-700/40 bg-emerald-950 text-5xl ${
                spinning ? "animate-pulse" : ""
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-emerald-200/70">Stake</span>
        {SLOT_STAKES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={spinning || pending}
            onClick={() => setStake(s)}
            className={`rounded px-3 py-1.5 text-sm font-medium tabular-nums ${
              stake === s
                ? "bg-amber-600 text-emerald-950"
                : "border border-amber-700/40 text-amber-100 hover:bg-amber-900/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={spinning || pending || gold < stake}
        onClick={spin}
        className="rounded-lg bg-amber-500 px-6 py-3 font-serif text-lg font-bold text-emerald-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {spinning || pending ? "Spinning…" : `Spin (${stake} gold)`}
      </button>

      {message && (
        <p
          className={`text-center text-sm font-medium ${
            message.startsWith("Win")
              ? "text-amber-300"
              : message.startsWith("No")
                ? "text-emerald-200/70"
                : "text-rose-300"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
