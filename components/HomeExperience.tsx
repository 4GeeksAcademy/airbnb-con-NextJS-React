"use client";

import { useEffect, useState } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Navbar } from "@/components/Navbar";
import { PropertyGrid } from "@/components/PropertyGrid";
import { PROPERTIES } from "@/lib/properties";
import { filterHomeProperties } from "@/lib/search";
import type { CategoryId, Property } from "@/lib/types";

export function HomeExperience() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [loading, setLoading] = useState(true);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAllProperties(PROPERTIES);
      setLoading(false);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setVisibleProperties(filterHomeProperties(allProperties, query, activeCategory));
  }, [allProperties, query, activeCategory]);

  function updateQuery(value: string) {
    setQuery(value);
    setVisibleProperties(filterHomeProperties(allProperties, value, activeCategory));
  }

  function updateCategory(value: CategoryId) {
    setActiveCategory(value);
    setVisibleProperties(filterHomeProperties(allProperties, query, value));
  }

  return (
    <>
      <Navbar onHomeTextChange={updateQuery} />
      <main className="mx-auto min-h-screen max-w-7xl px-5 pb-20 md:px-8">
        <CategoryFilter activeCategory={activeCategory} onChange={updateCategory} />
        <section aria-labelledby="home-title" className="pt-7 md:pt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--accent)]">Tu próxima estancia</p>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl" id="home-title">Alojamientos para descubrir</h1>
            </div>
            <span className="hidden text-sm text-[var(--muted)] sm:inline">Ideas para tu próximo viaje</span>
          </div>
          <PropertyGrid
            emptyDescription="Prueba otra palabra o elige una categoría distinta."
            emptyTitle="No hay alojamientos en esta selección"
            loading={loading}
            properties={visibleProperties}
            returnHref="/search"
          />
        </section>
      </main>
    </>
  );
}