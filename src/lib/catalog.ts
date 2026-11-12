import type { Product } from "@/data/products";

export const FILTER_CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "clothing", label: "Clothing" },
  { value: "footwear", label: "Footwear" },
  { value: "accessories", label: "Accessories" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number]["value"];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export interface CatalogFilters {
  category: FilterCategory;
  sort: SortOption;
  maxPrice: number;
  colors: string[];
}

export function filterProducts(list: Product[], f: CatalogFilters): Product[] {
  const out = list.filter((p) => {
    if (f.category === "men" || f.category === "women") {
      if (!p.genders.includes(f.category)) return false;
    } else if (f.category !== "all" && p.category !== f.category) {
      return false;
    }
    if (p.price > f.maxPrice) return false;
    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c.name))) return false;
    return true;
  });
  switch (f.sort) {
    case "price-asc":
      return [...out].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...out].sort((a, b) => b.price - a.price);
    case "newest":
      return [...out].sort((a, b) => b.dropOrder - a.dropOrder);
    default:
      return out;
  }
}

export const isFilterCategory = (v: unknown): v is FilterCategory =>
  FILTER_CATEGORIES.some((c) => c.value === v);
export const isSortOption = (v: unknown): v is SortOption =>
  SORT_OPTIONS.some((s) => s.value === v);
