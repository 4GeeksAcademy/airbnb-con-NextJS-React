"use client";

import { Icon, type IconName } from "@/components/Icon";
import { CATEGORIES } from "@/lib/properties";
import type { CategoryId } from "@/lib/types";

const categoryIcons: Record<CategoryId, IconName> = {
  all: "users",
  beach: "view",
  mansions: "home",
  trending: "star",
  cabin: "garden",
};

export function CategoryFilter({ activeCategory, onChange }: { activeCategory: CategoryId; onChange: (category: CategoryId) => void }) {
  return (
    <nav aria-label="Categorías de alojamientos" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:gap-4 md:px-0">
      {CATEGORIES.map((category) => {
        const active = activeCategory === category.id;
        return (
          <button
            aria-pressed={active}
            className={`flex min-h-16 min-w-20 shrink-0 flex-col items-center justify-center gap-1 border-b-2 px-3 text-xs font-medium transition ${active ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"}`}
            key={category.id}
            onClick={() => onChange(category.id)}
            type="button"
          >
            <Icon name={categoryIcons[category.id]} size={21} />
            {category.label}
          </button>
        );
      })}
    </nav>
  );
}