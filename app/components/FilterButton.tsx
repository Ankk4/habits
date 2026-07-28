"use client";

export default function FilterButton({
    children,
    active,
    onClick,
  }: {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={
          active
            ? "bg-sky-500 text-white px-4 py-2 rounded-md font-bold"
            : "bg-zinc-200 text-zinc-700 px-4 py-2 rounded-md hover:bg-zinc-300 font-bold"
        }
      >
        {children}
      </button>
    );
  }