export type CategoryId = "all" | "beach" | "mansions" | "trending" | "cabin";

export type PropertyType = "apartment" | "house" | "cabin" | "villa" | "loft";

export interface Host {
  name: string;
  description: string;
  yearsHosting: number;
  avatarKey: string;
}

export interface Amenity {
  id: string;
  label: string;
  icon: "wifi" | "pool" | "kitchen" | "parking" | "view" | "workspace" | "heat" | "garden";
}

export interface AvailabilityBlock {
  from: string;
  to: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  shortDescription: string;
  description: string;
  imageKeys: string[];
  pricePerNight: number;
  currency: "EUR";
  rating: number;
  reviewCount: number;
  category: Exclude<CategoryId, "all">;
  type: PropertyType;
  capacity: number;
  host: Host;
  amenities: Amenity[];
  unavailable: AvailabilityBlock[];
}

export interface SearchCriteria {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  types: PropertyType[];
  amenities: string[];
}

export type PriceOrder = "asc" | "desc";

export type LoadState = "loading" | "loaded" | "error";

export const DEFAULT_SEARCH: SearchCriteria = {
  destination: "",
  checkIn: "",
  checkOut: "",
  guests: 1,
};

export const DEFAULT_FILTERS: PropertyFilters = {
  types: [],
  amenities: [],
};