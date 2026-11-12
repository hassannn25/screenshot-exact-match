import { describe, expect, it } from "vitest";
import { cartTotals, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "@/lib/pricing";
import { filterProducts } from "@/lib/catalog";
import { products, MAX_PRICE } from "@/data/products";

const base = { category: "all" as const, sort: "featured" as const, maxPrice: MAX_PRICE, colors: [] as string[] };

describe("shipping", () => {
  it("charges standard shipping below the free threshold", () => {
    expect(cartTotals([{ price: 89, quantity: 1 }])).toEqual({ subtotal: 89, shipping: STANDARD_SHIPPING, total: 89 + STANDARD_SHIPPING });
  });
  it("ships free at or above the threshold", () => {
    expect(cartTotals([{ price: FREE_SHIPPING_THRESHOLD, quantity: 1 }]).shipping).toBe(0);
    expect(cartTotals([{ price: 89, quantity: 2 }]).total).toBe(178);
  });
  it("an empty bag costs nothing", () => {
    expect(cartTotals([])).toEqual({ subtotal: 0, shipping: 0, total: 0 });
  });
});

describe("catalog filters", () => {
  it("footwear shows only shoes", () => {
    const r = filterProducts(products, { ...base, category: "footwear" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.category === "footwear")).toBe(true);
  });
  it("women excludes men-only items", () => {
    const r = filterProducts(products, { ...base, category: "women" });
    expect(r.find((p) => p.slug === "urban-cargo-pants")).toBeUndefined();
  });
  it("price low to high sorts ascending", () => {
    const prices = filterProducts(products, { ...base, sort: "price-asc" }).map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
  it("max price and color narrow the results", () => {
    const r = filterProducts(products, { ...base, maxPrice: 100, colors: ["Cream"] });
    expect(r.map((p) => p.slug).sort()).toEqual(["essential-street-tee", "vanta-oversized-hoodie"]);
  });
});
