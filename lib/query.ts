import { PROPERTIES } from "@/lib/properties";
import { isValidDay, validateDates, validateFilters, validateGuests } from "@/lib/search";
import {
  DEFAULT_FILTERS,
  DEFAULT_SEARCH,
  type PriceOrder,
  type PropertyFilters,
  type PropertyType,
  type SearchCriteria,
} from "@/lib/types";

export type QueryRecord = Record<string, string | string[] | undefined>;

export interface CatalogState {
  criteria: SearchCriteria;
  filters: PropertyFilters;
  order: PriceOrder;
}

const propertyTypes: PropertyType[] = ["apartment", "house", "cabin", "villa", "loft"];
const amenityIds = new Set(PROPERTIES.flatMap((property) => property.amenities.map((amenity) => amenity.id)));

function valuesFor(query: QueryRecord, key: string): string[] {
  const value = query[key];
  if (Array.isArray(value)) return value;
  return value === undefined ? [] : [value];
}

function firstValid<T>(values: string[], parse: (value: string) => T | undefined): T | undefined {
  for (const value of values) {
    const parsed = parse(value);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function parseNonNegative(value: string): number | undefined {
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parsePositiveInteger(value: string): number | undefined {
  if (!/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && validateGuests(parsed).valid ? parsed : undefined;
}

function uniqueRecognized(values: string[], allowed: Set<string>): string[] {
  return [...new Set(values.flatMap((value) => value.split(",")).filter((value) => allowed.has(value)))];
}

export function parseCatalogQuery(query: QueryRecord): CatalogState {
  const destination = firstValid(valuesFor(query, "destination"), (value) => value.trim() || undefined) ?? "";
  const rawCheckIn = firstValid(valuesFor(query, "checkIn"), (value) => isValidDay(value) ? value : undefined) ?? "";
  const rawCheckOut = firstValid(valuesFor(query, "checkOut"), (value) => isValidDay(value) ? value : undefined) ?? "";
  const dateValidation = validateDates(rawCheckIn, rawCheckOut);
  const checkIn = dateValidation.valid ? rawCheckIn : "";
  const checkOut = dateValidation.valid ? rawCheckOut : "";
  const guests = firstValid(valuesFor(query, "guests"), parsePositiveInteger) ?? DEFAULT_SEARCH.guests;

  let minPrice = firstValid(valuesFor(query, "minPrice"), parseNonNegative);
  let maxPrice = firstValid(valuesFor(query, "maxPrice"), parseNonNegative);
  const filters: PropertyFilters = {
    minPrice,
    maxPrice,
    types: uniqueRecognized(valuesFor(query, "type"), new Set(propertyTypes)) as PropertyType[],
    amenities: uniqueRecognized(valuesFor(query, "amenity"), amenityIds),
  };
  if (!validateFilters(filters).valid) {
    minPrice = undefined;
    maxPrice = undefined;
    filters.minPrice = undefined;
    filters.maxPrice = undefined;
  }

  const order = firstValid(valuesFor(query, "order"), (value): PriceOrder | undefined =>
    value === "asc" || value === "desc" ? value : undefined,
  ) ?? "asc";

  return {
    criteria: { destination, checkIn, checkOut, guests },
    filters,
    order,
  };
}

export function serializeCatalogState(state: CatalogState): string {
  const params = new URLSearchParams();
  if (state.criteria.destination.trim()) params.set("destination", state.criteria.destination.trim());
  if (state.criteria.checkIn) params.set("checkIn", state.criteria.checkIn);
  if (state.criteria.checkOut) params.set("checkOut", state.criteria.checkOut);
  if (state.criteria.guests !== DEFAULT_SEARCH.guests) params.set("guests", String(state.criteria.guests));
  if (state.filters.minPrice !== undefined) params.set("minPrice", String(state.filters.minPrice));
  if (state.filters.maxPrice !== undefined) params.set("maxPrice", String(state.filters.maxPrice));
  state.filters.types.forEach((type) => params.append("type", type));
  state.filters.amenities.forEach((amenity) => params.append("amenity", amenity));
  if (state.order !== "asc") params.set("order", state.order);
  return params.toString();
}

export function queryRecordFromSearchParams(params: URLSearchParams): QueryRecord {
  const record: QueryRecord = {};
  params.forEach((value, key) => {
    const previous = record[key];
    record[key] = previous === undefined ? value : Array.isArray(previous) ? [...previous, value] : [previous, value];
  });
  return record;
}

export function parseSearchCriteria(query: QueryRecord): SearchCriteria {
  return parseCatalogQuery(query).criteria;
}

export function safeCatalogReturn(value: string | undefined): string {
  if (!value || !value.startsWith("/search") || value.startsWith("//")) return "/search";
  try {
    const url = new URL(value, "http://estancias.local");
    if (url.origin !== "http://estancias.local" || url.pathname !== "/search") return "/search";
    return `${url.pathname}${url.search}`;
  } catch {
    return "/search";
  }
}

export function emptyCatalogState(): CatalogState {
  return { criteria: DEFAULT_SEARCH, filters: DEFAULT_FILTERS, order: "asc" };
}