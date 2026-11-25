"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AmenitiesList } from "@/components/AmenitiesList";
import { BookingCard } from "@/components/BookingCard";
import { ImageGallery } from "@/components/ImageGallery";
import { Navbar } from "@/components/Navbar";
import { PropertyDescription } from "@/components/PropertyDescription";
import { PropertyHeader } from "@/components/PropertyHeader";
import { Icon } from "@/components/Icon";
import { PROPERTIES } from "@/lib/properties";
import { parseCatalogQuery, queryRecordFromSearchParams, serializeCatalogState } from "@/lib/query";
import type { Property, SearchCriteria } from "@/lib/types";

export function PropertyExperience({ id, returnTo }: { id: string; returnTo: string }) {
  const [loaded, setLoaded] = useState<{ id: string; property: Property | null } | null>(null);
  const loading = loaded?.id !== id;
  const property = loading ? null : loaded?.property ?? null;
  const returnState = parseCatalogQuery(queryRecordFromSearchParams(new URLSearchParams(returnTo.split("?")[1] ?? "")));
  const returnSearch: SearchCriteria = returnState.criteria;
  const preserveQuery = serializeCatalogState({ criteria: { ...returnSearch, destination: "" }, filters: returnState.filters, order: returnState.order });

  useEffect(() => {
    setLoaded(null);
    const timer = window.setTimeout(() => {
      setLoaded({ id, property: PROPERTIES.find((item) => item.id === id) ?? null });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [id]);

  return (
    <>
      <Navbar initialSearch={returnSearch} preserveQuery={preserveQuery} />
      <main className="mx-auto min-h-screen max-w-7xl px-0 pb-20 md:px-8">
        <div className="px-5 py-4 md:px-0">
          <Link className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-[var(--surface)]" href={returnTo}>
            <Icon name="chevron-left" /> Volver a resultados
          </Link>
        </div>
        {loading ? (
          <p aria-live="polite" className="grid min-h-72 place-items-center text-[var(--muted)]" role="status">Cargando alojamiento…</p>
        ) : !property ? (
          <section className="mx-5 rounded-2xl bg-[var(--surface)] px-6 py-14 text-center md:mx-0">
            <h1 className="text-2xl font-semibold">No encontramos este alojamiento</h1>
            <p className="mt-2 text-[var(--muted)]">Puede que ya no esté disponible en esta selección.</p>
            <Link className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-5 font-semibold text-white" href="/search">Volver al catálogo</Link>
          </section>
        ) : (
          <article>
            <div className="px-0 md:px-0">
              <ImageGallery images={property.imageKeys} propertyId={property.id} title={property.title} />
            </div>
            <div className="relative -mt-5 rounded-t-3xl bg-white px-5 pt-1 md:mt-0 md:rounded-none md:px-0 md:pt-0">
              <PropertyHeader property={property} />
              <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.8fr)] md:gap-10">
                <div className="min-w-0">
                  <PropertyDescription property={property} />
                  <AmenitiesList property={property} />
                </div>
                <div className="pb-8 md:pt-7">
                  <BookingCard initialSearch={returnSearch} property={property} />
                </div>
              </div>
            </div>
          </article>
        )}
      </main>
    </>
  );
}