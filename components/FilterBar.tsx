"use client";

import { useEffect, useState } from "react";
import { DEFAULT_FILTERS, type PropertyFilters, type PropertyType } from "@/lib/types";
import { PROPERTIES } from "@/lib/properties";
import { validateFilters } from "@/lib/search";

const types: { id: PropertyType; label: string }[] = [
  { id: "apartment", label: "Apartamento" },
  { id: "house", label: "Casa" },
  { id: "cabin", label: "Cabaña" },
  { id: "villa", label: "Villa" },
  { id: "loft", label: "Loft" },
];

const amenities = [...new Map(PROPERTIES.flatMap((property) => property.amenities).map((amenity) => [amenity.id, amenity])).values()];

export function FilterBar({ filters, onChange }: { filters: PropertyFilters; onChange: (filters: PropertyFilters) => void }) {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? "");
  const [error, setError] = useState("");
  const activeCount = Number(filters.minPrice !== undefined) + Number(filters.maxPrice !== undefined) + filters.types.length + filters.amenities.length;

  useEffect(() => {
    setMinPrice(filters.minPrice?.toString() ?? "");
    setMaxPrice(filters.maxPrice?.toString() ?? "");
  }, [filters.minPrice, filters.maxPrice]);

  function updatePrices(nextMin: string, nextMax: string) {
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    const next = {
      ...filters,
      minPrice: nextMin === "" ? undefined : Number(nextMin),
      maxPrice: nextMax === "" ? undefined : Number(nextMax),
    };
    const validation = validateFilters(next);
    if (!validation.valid) {
      setError(validation.message ?? "Revisa el rango de precios.");
      return;
    }
    setError("");
    onChange(next);
  }

  function toggleType(type: PropertyType) {
    const selected = filters.types.includes(type)
      ? filters.types.filter((value) => value !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: selected });
  }

  function toggleAmenity(amenity: string) {
    const selected = filters.amenities.includes(amenity)
      ? filters.amenities.filter((value) => value !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: selected });
  }

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setError("");
    onChange(DEFAULT_FILTERS);
  }

  return (
    <details className="group rounded-2xl border border-[var(--line)] bg-white">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 font-semibold">
        <span>Filtros {activeCount > 0 && <span className="ml-1 text-[var(--accent)]">{activeCount}</span>}</span>
        <span aria-hidden="true" className="text-[var(--muted)] transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="grid gap-5 border-t border-[var(--line)] p-4 md:grid-cols-3">
        <fieldset className="grid content-start gap-2">
          <legend className="mb-1 text-sm font-semibold">Precio por noche · EUR</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1 text-xs text-[var(--muted)]">Mínimo
              <input aria-describedby={error ? "price-filter-error" : undefined} aria-invalid={Boolean(error)} aria-label="Precio mínimo por noche" className="min-h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm text-[var(--ink)]" min="0" onChange={(event) => updatePrices(event.target.value, maxPrice)} placeholder="Sin mínimo" type="number" value={minPrice} />
            </label>
            <label className="grid gap-1 text-xs text-[var(--muted)]">Máximo
              <input aria-describedby={error ? "price-filter-error" : undefined} aria-invalid={Boolean(error)} aria-label="Precio máximo por noche" className="min-h-11 w-full rounded-xl border border-[var(--line)] px-3 text-sm text-[var(--ink)]" min="0" onChange={(event) => updatePrices(minPrice, event.target.value)} placeholder="Sin máximo" type="number" value={maxPrice} />
            </label>
          </div>
          {error && <p className="text-xs text-red-700" id="price-filter-error" role="alert">{error}</p>}
        </fieldset>
        <fieldset className="grid content-start gap-2">
          <legend className="mb-1 text-sm font-semibold">Tipo de alojamiento</legend>
          {types.map((type) => <label className="flex min-h-11 items-center gap-2 text-sm" key={type.id}>
            <input checked={filters.types.includes(type.id)} onChange={() => toggleType(type.id)} type="checkbox" /> {type.label}
          </label>)}
        </fieldset>
        <fieldset className="grid content-start gap-2">
          <legend className="mb-1 text-sm font-semibold">Características</legend>
          {amenities.map((amenity) => <label className="flex min-h-11 items-center gap-2 text-sm" key={amenity.id}>
            <input checked={filters.amenities.includes(amenity.id)} onChange={() => toggleAmenity(amenity.id)} type="checkbox" /> {amenity.label}
          </label>)}
        </fieldset>
        <button className="min-h-11 justify-self-start text-sm font-semibold underline underline-offset-4" onClick={clearFilters} type="button">Limpiar filtros</button>
      </div>
    </details>
  );
}