"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { seedStarterItem } from "@/app/actions/items";

export default function SeedGoldButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await seedStarterItem();
          router.refresh();
        })
      }
      className="rounded border border-amber-500/60 bg-amber-600/20 px-3 py-1.5 text-sm font-medium text-amber-100 hover:bg-amber-500/30 disabled:opacity-50"
    >
      {pending ? "Seeding…" : "Claim starter gold (25)"}
    </button>
  );
}
