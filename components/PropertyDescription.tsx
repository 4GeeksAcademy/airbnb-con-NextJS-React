import type { Property } from "@/lib/types";

export function PropertyDescription({ property }: { property: Property }) {
  return (
    <section aria-labelledby="stay-description" className="border-b border-[var(--line)] py-7">
      <h2 className="text-xl font-semibold" id="stay-description">Sobre este alojamiento</h2>
      <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">{property.description}</p>
      <div className="mt-6 flex items-center gap-4">
        <span aria-label={`Avatar de ${property.host.name}`} className="grid size-12 shrink-0 place-items-center rounded-full bg-[#dce9e2] text-lg font-semibold text-[var(--accent)]" role="img">
          {property.host.avatarKey.toUpperCase()}
        </span>
        <div>
          <h3 className="font-semibold">Anfitrión: {property.host.name}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{property.host.yearsHosting} años como anfitrión</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{property.host.description}</p>
        </div>
      </div>
    </section>
  );
}