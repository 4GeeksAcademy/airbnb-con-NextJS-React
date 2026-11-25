import { PropertyCard } from "@/components/PropertyCard";
import type { Property } from "@/lib/types";

export function PropertyGrid({
  properties,
  loading = false,
  returnHref = "/search",
  emptyTitle = "No encontramos alojamientos",
  emptyDescription = "Prueba otra búsqueda o ajusta tus filtros.",
  layout = "default",
}: {
  properties: Property[];
  loading?: boolean;
  returnHref?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  layout?: "default" | "catalog";
}) {
  if (loading) {
    return <p aria-live="polite" className="py-16 text-center text-[var(--muted)]" role="status">Cargando alojamientos…</p>;
  }
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl bg-[var(--surface)] px-6 py-12 text-center">
        <h2 className="text-lg font-semibold">{emptyTitle}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{emptyDescription}</p>
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-1 gap-x-5 gap-y-9 ${layout === "catalog" ? "xl:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
      {properties.map((property) => <PropertyCard key={property.id} property={property} returnHref={returnHref} />)}
    </div>
  );
}