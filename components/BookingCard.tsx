"use client";

import { useState } from "react";
import { es } from "date-fns/locale";
import { DayPicker, type DateRange } from "react-day-picker";
import { Icon } from "@/components/Icon";
import { getNightCount, isAvailable, validateDates } from "@/lib/search";
import type { Property, SearchCriteria } from "@/lib/types";

function parseLocalDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSelectedDate(value: string): string {
  const date = parseLocalDate(value);
  return date ? new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(date) : "Añadir fecha";
}

function unavailableNights(property: Property): Date[] {
  return property.unavailable.flatMap(({ from, to }) => {
    const dates: Date[] = [];
    for (let timestamp = Date.parse(`${from}T00:00:00.000Z`); timestamp < Date.parse(`${to}T00:00:00.000Z`); timestamp += 86_400_000) {
      const date = new Date(timestamp);
      dates.push(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    return dates;
  });
}

export function BookingCard({ property, initialSearch }: { property: Property; initialSearch: SearchCriteria }) {
  const [checkIn, setCheckIn] = useState(initialSearch.checkIn);
  const [checkOut, setCheckOut] = useState(initialSearch.checkOut);
  const [guests, setGuests] = useState(Math.min(initialSearch.guests, property.capacity));
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const price = new Intl.NumberFormat("es-ES", { style: "currency", currency: property.currency, maximumFractionDigits: 0 }).format(property.pricePerNight);
  const dateRange: DateRange | undefined = checkIn
    ? { from: parseLocalDate(checkIn), to: parseLocalDate(checkOut) }
    : undefined;
  const dateValidation = validateDates(checkIn, checkOut);
  const blockedNights = unavailableNights(property);
  const nights = dateValidation.valid && checkIn && checkOut && isAvailable(property, checkIn, checkOut)
    ? getNightCount(checkIn, checkOut)
    : 0;
  const total = new Intl.NumberFormat("es-ES", { style: "currency", currency: property.currency, maximumFractionDigits: 0 }).format(property.pricePerNight * nights);

  function selectRange(range: DateRange | undefined) {
    const nextCheckIn = range?.from ? toLocalDateString(range.from) : "";
    const nextCheckOut = range?.to ? toLocalDateString(range.to) : "";
    setCheckIn(nextCheckIn);
    setCheckOut(nextCheckOut);
    setConfirmed(false);

    if (!nextCheckIn || !nextCheckOut) {
      setError("");
      return;
    }
    const validation = validateDates(nextCheckIn, nextCheckOut);
    if (!validation.valid) {
      setError(validation.message ?? "La salida debe ser posterior a la entrada.");
    } else if (!isAvailable(property, nextCheckIn, nextCheckOut)) {
      setError("Este alojamiento no está disponible para todas esas noches.");
    } else {
      setError("");
      setCalendarOpen(false);
    }
  }

  function updateGuests(value: number) {
    setGuests(Math.min(property.capacity, Math.max(1, value)));
    setError("");
    setConfirmed(false);
  }

  function reserve(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dates = validateDates(checkIn, checkOut);
    if (!dates.valid) {
      setError(dates.message ?? "Revisa las fechas seleccionadas.");
      setConfirmed(false);
      return;
    }
    if (guests < 1 || guests > property.capacity) {
      setError(`Este alojamiento admite de 1 a ${property.capacity} huéspedes.`);
      setConfirmed(false);
      return;
    }
    if (!checkIn || !checkOut) {
      setError("Selecciona entrada y salida para simular la reserva.");
      setConfirmed(false);
      return;
    }
    if (!isAvailable(property, checkIn, checkOut)) {
      setError("Este alojamiento no está disponible para todas esas noches.");
      setConfirmed(false);
      return;
    }
    setError("");
    setConfirmed(true);
  }

  return (
    <aside aria-label="Simulación de reserva" className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[0_8px_24px_rgba(34,34,34,0.08)] md:sticky md:top-28">
      <p className="text-xl"><strong>{price}</strong> <span className="text-base text-[var(--muted)]">por noche</span></p>
      <form className="mt-5 grid gap-3" onSubmit={reserve}>
        <button aria-controls={calendarOpen ? "booking-calendar" : undefined} aria-expanded={calendarOpen} className="grid min-h-14 grid-cols-2 overflow-hidden rounded-xl border border-[var(--line)] text-left" onClick={() => setCalendarOpen((open) => !open)} type="button">
          <span className="grid content-center gap-1 border-r border-[var(--line)] px-3 py-2 text-xs font-semibold">Entrada<span className="text-sm font-normal">{formatSelectedDate(checkIn)}</span></span>
          <span className="grid content-center gap-1 px-3 py-2 text-xs font-semibold">Salida<span className="text-sm font-normal">{formatSelectedDate(checkOut)}</span></span>
        </button>
        {calendarOpen && <div className="rounded-xl border border-[var(--line)] p-3" id="booking-calendar">
          <DayPicker
            aria-label="Selecciona las fechas de tu estancia"
            className="booking-day-picker"
            disabled={blockedNights}
            excludeDisabled
            locale={es}
            mode="range"
            modifiers={{ unavailable: blockedNights }}
            modifiersClassNames={{ unavailable: "booking-unavailable-night" }}
            onSelect={selectRange}
            selected={dateRange}
          />
          <p className="mt-2 text-xs text-[var(--muted)]">Las fechas sombreadas incluyen noches no disponibles.</p>
        </div>}
        <div className="flex min-h-14 items-center justify-between rounded-xl border border-[var(--line)] px-3">
          <div>
            <p className="text-sm font-semibold">Huéspedes</p>
            <p className="text-xs text-[var(--muted)]">Máximo {property.capacity}</p>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Reducir huéspedes" className="grid size-11 place-items-center rounded-full border border-[var(--line)]" disabled={guests <= 1} onClick={() => updateGuests(guests - 1)} type="button">−</button>
            <output aria-live="polite" className="min-w-5 text-center">{guests}</output>
            <button aria-label="Aumentar huéspedes" className="grid size-11 place-items-center rounded-full border border-[var(--line)]" disabled={guests >= property.capacity} onClick={() => updateGuests(guests + 1)} type="button">+</button>
          </div>
        </div>
        <button className="mt-1 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 font-semibold text-white transition hover:brightness-95" type="submit">
          <Icon name="check" /> Simular reserva
        </button>
      </form>
      {nights > 0 && <div aria-live="polite" className="mt-4 border-t border-[var(--line)] pt-4 text-sm">
        <p className="flex justify-between gap-3 text-[var(--muted)]"><span>{price} × {nights} {nights === 1 ? "noche" : "noches"}</span><span>{total}</span></p>
        <p className="mt-2 flex justify-between gap-3 font-semibold"><span>Total de la estancia</span><span>{total}</span></p>
      </div>}
      {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      {confirmed && <p className="mt-3 rounded-xl bg-[#e6f4f0] p-3 text-sm text-[#07594f]" role="status">Simulación confirmada. No se ha creado una reserva ni se ha procesado ningún pago.</p>}
    </aside>
  );
}