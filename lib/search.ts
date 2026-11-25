import type { CategoryId, PriceOrder, Property, PropertyFilters, SearchCriteria } from "@/lib/types";

export interface ValidationResult {
  valid: boolean;
  message?: string;
  field?: "checkIn" | "checkOut" | "guests" | "minPrice" | "maxPrice";
}

export function normalizeText(value: string): string {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

export function isValidDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateDates(checkIn: string, checkOut: string): ValidationResult {
  if (!checkIn && !checkOut) return { valid: true };
  if (!checkIn) return { valid: false, field: "checkIn", message: "Selecciona la fecha de entrada." };
  if (!checkOut) return { valid: false, field: "checkOut", message: "Selecciona la fecha de salida." };
  if (!isValidDay(checkIn)) return { valid: false, field: "checkIn", message: "Introduce una fecha válida." };
  if (!isValidDay(checkOut)) return { valid: false, field: "checkOut", message: "Introduce una fecha válida." };
  if (checkOut <= checkIn) return { valid: false, field: "checkOut", message: "La salida debe ser posterior a la entrada." };
  return { valid: true };
}

export function getNightCount(checkIn: string, checkOut: string): number {
  if (!validateDates(checkIn, checkOut).valid) return 0;
  const firstNight = Date.parse(`${checkIn}T00:00:00.000Z`);
  const lastNight = Date.parse(`${checkOut}T00:00:00.000Z`);
  return Math.round((lastNight - firstNight) / 86_400_000);
}

export function validateGuests(guests: number): ValidationResult {
  return Number.isInteger(guests) && guests > 0
    ? { valid: true }
    : { valid: false, field: "guests", message: "El número de huéspedes debe ser un entero positivo." };
}

export function validateFilters(filters: PropertyFilters): ValidationResult {
  const { minPrice, maxPrice } = filters;
  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
    return { valid: false, field: "minPrice", message: "El precio mínimo debe ser un importe válido." };
  }
  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    return { valid: false, field: "maxPrice", message: "El precio máximo debe ser un importe válido." };
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    return { valid: false, field: "maxPrice", message: "El precio máximo debe ser igual o mayor al mínimo." };
  }
  return { valid: true };
}

export function isAvailable(property: Property, checkIn: string, checkOut: string): boolean {
  const dates = validateDates(checkIn, checkOut);
  if (!dates.valid) return false;
  if (!checkIn || !checkOut) return true;
  return property.unavailable.every((block) => checkIn >= block.to || checkOut <= block.from);
}

export function filterHomeProperties(properties: Property[], text: string, category: CategoryId): Property[] {
  const query = normalizeText(text);
  return properties.filter((property) => {
    const matchesText = !query || normalizeText(`${property.title} ${property.location}`).includes(query);
    const matchesCategory = category === "all" || property.category === category;
    return matchesText && matchesCategory;
  });
}

export function filterProperties(
  properties: Property[],
  criteria: SearchCriteria,
  filters: PropertyFilters,
): Property[] {
  if (!validateDates(criteria.checkIn, criteria.checkOut).valid || !validateGuests(criteria.guests).valid) return [];
  if (!validateFilters(filters).valid) return [];

  const destination = normalizeText(criteria.destination);
  return properties.filter((property) => {
    const matchesDestination = !destination || normalizeText(property.location).includes(destination);
    const matchesCapacity = property.capacity >= criteria.guests;
    const matchesAvailability = isAvailable(property, criteria.checkIn, criteria.checkOut);
    const matchesMin = filters.minPrice === undefined || property.pricePerNight >= filters.minPrice;
    const matchesMax = filters.maxPrice === undefined || property.pricePerNight <= filters.maxPrice;
    const matchesType = filters.types.length === 0 || filters.types.includes(property.type);
    const propertyAmenities = new Set(property.amenities.map((amenity) => amenity.id));
    const matchesAmenities = filters.amenities.every((amenity) => propertyAmenities.has(amenity));
    return matchesDestination && matchesCapacity && matchesAvailability && matchesMin && matchesMax && matchesType && matchesAmenities;
  });
}

export function sortProperties(properties: Property[], order: PriceOrder): Property[] {
  return [...properties].sort((first, second) => {
    const byPrice = order === "asc"
      ? first.pricePerNight - second.pricePerNight
      : second.pricePerNight - first.pricePerNight;
    return byPrice || first.id.localeCompare(second.id);
  });
}