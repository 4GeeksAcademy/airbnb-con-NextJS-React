import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PropertyPhoto } from "@/components/PropertyPhoto";
import type { Property } from "@/lib/types";

export function PropertyCard({ property, returnHref = "/search" }: { property: Property; returnHref?: string }) {
  const detailHref = `/property/${encodeURIComponent(property.id)}?${new URLSearchParams({ returnTo: returnHref }).toString()}`;
  const price = new Intl.NumberFormat("es-ES", { style: "currency", currency: property.currency, maximumFractionDigits: 0 }).format(property.pricePerNight);

  return (
    <Link aria-label={`${property.title}, ${property.location}, ${price} por noche`} className="group block min-w-0 rounded-2xl focus-visible:outline-offset-4" href={detailHref}>
      <PropertyPhoto className="aspect-[4/3] w-full rounded-2xl transition duration-300 group-hover:brightness-[0.97]" imageKey={property.imageKeys[0] ?? "default"} title={property.title} />
      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-w-0 font-semibold leading-snug">{property.title}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm" aria-label={`Valoración ${property.rating.toFixed(2)} de 5`}>
            <Icon name="star" size={15} /> {property.rating.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">{property.location}</p>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{property.shortDescription}</p>
        <p className="mt-2 text-sm"><strong>{price}</strong> <span className="text-[var(--muted)]">por noche</span></p>
      </div>
    </Link>
  );
}