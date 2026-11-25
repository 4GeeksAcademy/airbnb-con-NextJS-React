import { Icon } from "@/components/Icon";
import type { Property } from "@/lib/types";

export function AmenitiesList({ property }: { property: Property }) {
  return (
    <section aria-labelledby="amenities-heading" className="py-7">
      <h2 className="text-xl font-semibold" id="amenities-heading">Lo que ofrece</h2>
      {property.amenities.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--muted)]">No se han indicado características para este alojamiento.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {property.amenities.map((amenity) => (
            <li className="flex min-h-11 items-center gap-3" key={amenity.id}>
              <Icon name={amenity.icon} />
              <span>{amenity.label}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}