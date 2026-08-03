"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { openItem } from "@/app/actions/items";
import type { ItemDto } from "@/lib/types/item";

export default function PendingItemList({ items }: { items: ItemDto[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-sm text-emerald-200/70">
        No unopened rewards. Complete habits or win at slots to fill the queue.
      </p>
    );
  }

  const handleOpen = (itemId: number) => {
    setOpeningId(itemId);
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await openItem(itemId);
        setMessage(
          `Opened +${result.openLog.result.quantity} ${result.openLog.result.key}`,
        );
        router.refresh();
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Failed to open");
      } finally {
        setOpeningId(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {message && (
        <p className="text-sm font-medium text-amber-300">{message}</p>
      )}
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded border border-amber-700/40 bg-emerald-950/60 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="font-medium text-amber-100">
                {item.quantity}× {item.key}
              </p>
              <p className="truncate text-xs text-emerald-200/60">
                from {item.source}
                {item.sourceRef ? ` · ${item.sourceRef}` : ""}
              </p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => handleOpen(item.id)}
              className="shrink-0 rounded border border-amber-500/50 bg-amber-700/30 px-3 py-1 text-sm font-medium text-amber-100 hover:bg-amber-600/40 disabled:opacity-50"
            >
              {openingId === item.id ? "Opening…" : "Open"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
