"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/FilterBar";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { Navbar } from "@/components/Navbar";
import { PropertyGrid } from "@/components/PropertyGrid";
import { ResultsHeader } from "@/components/ResultsHeader";
import { filterProperties, sortProperties, validateFilters } from "@/lib/search";
import { parseCatalogQuery, queryRecordFromSearchParams, serializeCatalogState, type CatalogState } from "@/lib/query";
import { DEFAULT_FILTERS, DEFAULT_SEARCH, type PriceOrder, type PropertyFilters } from "@/lib/types";
import { PROPERTIES } from "@/lib/properties";

export function CatalogExperience({ initialState }: { initialState: CatalogState }) {
  const router = useRouter();
  const serializedInitialState = serializeCatalogState(initialState);
  const [criteria, setCriteria] = useState(initialState.criteria);
  const [filters, setFilters] = useState(initialState.filters);
  const [order, setOrder] = useState<PriceOrder>(initialState.order);
  const filtered = sortProperties(filterProperties(PROPERTIES, criteria, filters), order);
  const state: CatalogState = { criteria, filters, order };
  const returnHref = `/search${serializeCatalogState(state) ? `?${serializeCatalogState(state)}` : ""}`;

  useEffect(() => {
    const restored = parseCatalogQuery(queryRecordFromSearchParams(new URLSearchParams(serializedInitialState)));
    setCriteria(restored.criteria);
    setFilters(restored.filters);
    setOrder(restored.order);
  }, [serializedInitialState]);

  function syncUrl(next: CatalogState) {
    const query = serializeCatalogState(next);
    router.push(query ? `/search?${query}` : "/search", { scroll: false });
  }

  function changeFilters(next: PropertyFilters) {
    if (!validateFilters(next).valid) return;
    setFilters(next);
    syncUrl({ criteria, filters: next, order });
  }

  function changeOrder(next: PriceOrder) {
    setOrder(next);
    syncUrl({ criteria, filters, order: next });
  }

  useEffect(() => {
    function restoreFromUrl() {
      const restored = parseCatalogQuery(queryRecordFromSearchParams(new URLSearchParams(window.location.search)));
      setCriteria(restored.criteria);
      setFilters(restored.filters);
      setOrder(restored.order);
    }
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, []);

  return (
    <>
      <Navbar initialSearch={criteria} preserveQuery={serializeCatalogState({ criteria: DEFAULT_SEARCH, filters, order })} />
      <main className="mx-auto min-h-screen max-w-[1440px] px-5 pb-16 md:px-8">
        <div className="py-5">
          <FilterBar filters={filters} onChange={changeFilters} />
        </div>
        <div className="mb-5">
          <ResultsHeader count={filtered.length} onOrderChange={changeOrder} order={order} />
        </div>
        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.9fr)]">
          <section aria-label="Resultados de búsqueda" className="min-w-0">
            <PropertyGrid
              emptyDescription="Quita algún filtro o modifica el destino y las fechas para ver más opciones."
              emptyTitle="No hay alojamientos con estos criterios"
              layout="catalog"
              properties={filtered}
              returnHref={returnHref}
            />
          </section>
          <MapPlaceholder />
        </div>
        <div className="sr-only" aria-label="Búsqueda actual">{criteria.destination || "Cualquier destino"}, {criteria.guests} huéspedes</div>
      </main>
    </>
  );
}