"use client";

import type { PriceOrder } from "@/lib/types";

export function ResultsHeader({ count, order, onOrderChange }: { count: number; order: PriceOrder; onOrderChange: (order: PriceOrder) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p aria-live="polite" className="text-sm text-[var(--muted)]">
        <strong className="text-[var(--ink)]">{count}</strong> {count === 1 ? "alojamiento" : "alojamientos"}
      </p>
      <div aria-label="Ordenar por precio" className="inline-flex rounded-full border border-[var(--line)] p-1" role="group">
        <button aria-pressed={order === "asc"} className={`min-h-11 rounded-full px-3 text-sm ${order === "asc" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`} onClick={() => onOrderChange("asc")} type="button">Precio ↑</button>
        <button aria-pressed={order === "desc"} className={`min-h-11 rounded-full px-3 text-sm ${order === "desc" ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"}`} onClick={() => onOrderChange("desc")} type="button">Precio ↓</button>
      </div>
    </div>
  );
}