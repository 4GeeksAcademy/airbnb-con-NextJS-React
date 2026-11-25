import { Icon } from "@/components/Icon";
import type { Property } from "@/lib/types";

export function PropertyHeader({ property }: { property: Property }) {
  const typeLabels = { apartment: "Apartamento", house: "Casa", cabin: "Cabaña", villa: "Villa", loft: "Loft" };
  return (
    <header className="border-b border-[var(--line)] py-7">
      <h1 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">{property.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-1 font-semibold"><Icon name="star" size={16} /> {property.rating.toFixed(2)}</span>
        <span className="text-[var(--muted)]">{property.reviewCount} reseñas</span>
        <span aria-hidden="true" className="text-[var(--line)]">|</span>
        <span className="inline-flex items-center gap-1 text-[var(--muted)]"><Icon name="pin" size={16} /> {property.location}</span>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{typeLabels[property.type]} · Hasta {property.capacity} huéspedes</p>
    </header>
  );
}