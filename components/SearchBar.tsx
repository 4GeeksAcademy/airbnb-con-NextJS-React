"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_SEARCH, type SearchCriteria } from "@/lib/types";
import { validateDates, validateGuests } from "@/lib/search";
import { Icon } from "@/components/Icon";

export function SearchBar({
  initialSearch = DEFAULT_SEARCH,
  onHomeTextChange,
  preserveQuery = "",
}: {
  initialSearch?: SearchCriteria;
  onHomeTextChange?: (text: string) => void;
  preserveQuery?: string;
}) {
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState(initialSearch.destination);
  const [checkIn, setCheckIn] = useState(initialSearch.checkIn);
  const [checkOut, setCheckOut] = useState(initialSearch.checkOut);
  const [guests, setGuests] = useState(initialSearch.guests);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"checkIn" | "checkOut" | "guests">();
  const [openSection, setOpenSection] = useState<"destination" | "dates" | "guests">("destination");
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDestination(initialSearch.destination);
    setCheckIn(initialSearch.checkIn);
    setCheckOut(initialSearch.checkOut);
    setGuests(initialSearch.guests);
  }, [initialSearch.destination, initialSearch.checkIn, initialSearch.checkOut, initialSearch.guests]);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const search = { destination, checkIn, checkOut, guests };
  const dateValidation = validateDates(checkIn, checkOut);
  const guestValidation = validateGuests(guests);
  const searchHref = () => {
    const params = new URLSearchParams(preserveQuery);
    params.delete("destination");
    params.delete("checkIn");
    params.delete("checkOut");
    params.delete("guests");
    if (destination.trim()) params.set("destination", destination.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests !== 1) params.set("guests", String(guests));
    const query = params.toString();
    return query ? `/search?${query}` : "/search";
  };

  function clearSearch() {
    setDestination("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setError("");
    setErrorField(undefined);
    onHomeTextChange?.("");
  }

  function validateSearch(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!dateValidation.valid || !guestValidation.valid) {
      event.preventDefault();
      const field = dateValidation.field === "checkIn" || dateValidation.field === "checkOut" ? dateValidation.field : "guests";
      setErrorField(field);
      setOpenSection(field === "guests" ? "guests" : "dates");
      setError(dateValidation.message || guestValidation.message || "Revisa los criterios de búsqueda.");
      return;
    }
    setOpen(false);
    setError("");
    setErrorField(undefined);
  }

  return (
    <div className="relative min-w-0 flex-1">
      <button
        aria-controls="expanded-search"
        aria-expanded={open}
        className="flex min-h-12 w-full items-center gap-3 rounded-full border border-[var(--line)] bg-white px-4 text-left shadow-sm transition hover:shadow-md md:min-h-14 md:px-5"
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        type="button"
      >
        <Icon name="search" />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold md:text-base">
          {destination || "¿Adónde quieres ir?"}
        </span>
        <span className="hidden text-sm text-[var(--muted)] sm:inline">
          {checkIn && checkOut ? `${checkIn} – ${checkOut}` : "Añade fechas"}
        </span>
        <span className="hidden h-6 border-l border-[var(--line)] sm:block" />
        <span className="hidden text-sm text-[var(--muted)] sm:inline">{guests} huésped{guests === 1 ? "" : "es"}</span>
      </button>

      {open && (
        <section
          aria-label="Criterios de búsqueda"
          className="soft-shadow enter-rise fixed left-3 right-3 top-24 z-30 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-3xl border border-[var(--line)] bg-white p-5 md:absolute md:left-auto md:right-0 md:top-[calc(100%+12px)] md:max-h-[calc(100dvh-7rem)] md:w-[min(620px,calc(100vw-48px))] md:p-7"
          id="expanded-search"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Encuentra tu estancia</h2>
            <button aria-label="Cerrar búsqueda" className="grid size-11 place-items-center rounded-full hover:bg-[var(--surface)]" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} type="button">
              <Icon name="close" />
            </button>
          </div>
          <div className="grid gap-3">
            <section className="rounded-2xl border border-[var(--line)] p-3">
              <button aria-controls={openSection === "destination" ? "search-destination" : undefined} aria-expanded={openSection === "destination"} className="flex min-h-11 w-full items-center justify-between text-left text-sm font-semibold" onClick={() => setOpenSection(openSection === "destination" ? "dates" : "destination")} type="button">
                <span>Destino</span><span className="font-normal text-[var(--muted)]">{destination || "Añade un destino"}</span>
              </button>
              {openSection === "destination" && <label className="mt-3 grid gap-2 text-sm">
                <span className="sr-only">Destino</span>
                <input autoComplete="off" className="min-h-11 rounded-xl bg-[var(--surface)] px-3 font-normal outline-none" id="search-destination" onChange={(event) => { setDestination(event.target.value); setError(""); onHomeTextChange?.(event.target.value); }} placeholder="Ciudad o región" value={destination} />
              </label>}
            </section>
            <section className="rounded-2xl border border-[var(--line)] p-3">
              <button aria-controls={openSection === "dates" ? "search-dates" : undefined} aria-expanded={openSection === "dates"} className="flex min-h-11 w-full items-center justify-between text-left text-sm font-semibold" onClick={() => setOpenSection(openSection === "dates" ? "destination" : "dates")} type="button">
                <span>Fechas</span><span className="font-normal text-[var(--muted)]">{checkIn && checkOut ? `${checkIn} – ${checkOut}` : "Añade fechas"}</span>
              </button>
              {openSection === "dates" && <div className="mt-3 grid gap-3 sm:grid-cols-2" id="search-dates">
                <label className="grid gap-2 text-sm">Entrada
                  <input aria-describedby={errorField === "checkIn" ? "search-date-error" : undefined} aria-invalid={errorField === "checkIn"} className="min-h-11 rounded-xl bg-[var(--surface)] px-3 font-normal" onChange={(event) => { setCheckIn(event.target.value); setError(""); setErrorField(undefined); }} type="date" value={checkIn} />
                </label>
                <label className="grid gap-2 text-sm">Salida
                  <input aria-describedby={errorField === "checkOut" ? "search-date-error" : undefined} aria-invalid={errorField === "checkOut"} className="min-h-11 rounded-xl bg-[var(--surface)] px-3 font-normal" onChange={(event) => { setCheckOut(event.target.value); setError(""); setErrorField(undefined); }} type="date" value={checkOut} />
                </label>
              </div>}
            </section>
            <section className="rounded-2xl border border-[var(--line)] p-3">
              <button aria-controls={openSection === "guests" ? "search-guests" : undefined} aria-expanded={openSection === "guests"} className="flex min-h-11 w-full items-center justify-between text-left text-sm font-semibold" onClick={() => setOpenSection(openSection === "guests" ? "destination" : "guests")} type="button">
                <span>Huéspedes</span><span className="font-normal text-[var(--muted)]">{guests} huésped{guests === 1 ? "" : "es"}</span>
              </button>
              {openSection === "guests" && <label className="mt-3 grid max-w-40 gap-2 text-sm">Número de huéspedes
                <input aria-describedby={errorField === "guests" ? "search-guests-error" : undefined} aria-invalid={errorField === "guests"} className="min-h-11 rounded-xl bg-[var(--surface)] px-3 font-normal" id="search-guests" min="1" onChange={(event) => { setGuests(Number(event.target.value)); setError(""); setErrorField(undefined); }} type="number" value={guests} />
              </label>}
            </section>
          </div>
          {error && <p className="mt-3 text-sm text-red-700" id={errorField === "guests" ? "search-guests-error" : "search-date-error"} role="alert">{error}</p>}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button className="min-h-11 px-2 text-sm font-semibold underline underline-offset-4" onClick={clearSearch} type="button">Limpiar</button>
            <Link aria-label="Buscar alojamientos" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-6 font-semibold text-white transition hover:brightness-95" href={searchHref()} onClick={validateSearch}>
              <Icon name="search" /> Buscar
            </Link>
          </div>
        </section>
      )}
      <output className="sr-only" aria-live="polite">{JSON.stringify(search)}</output>
    </div>
  );
}