import hoodie from "@/assets/p-hoodie.jpg";
import hoodieAlt from "@/assets/alt-hoodie.jpg";
import runner from "@/assets/p-tech-runner.jpg";
import runnerAlt from "@/assets/alt-runner.jpg";
import tee from "@/assets/p-tee.jpg";
import cargo from "@/assets/p-cargo.jpg";
import puffer from "@/assets/p-puffer.jpg";
import pufferAlt from "@/assets/alt-puffer.jpg";
import crossbody from "@/assets/p-crossbody.jpg";
import track from "@/assets/p-track.jpg";
import everyday from "@/assets/p-everyday.jpg";
import phantom from "@/assets/p-phantom.jpg";
import colStreet from "@/assets/col-street.jpg";
import colPerformance from "@/assets/col-performance.jpg";
import colLuxury from "@/assets/col-luxury.jpg";

export type Category = "clothing" | "footwear" | "accessories";
export type Gender = "men" | "women";

export interface ProductColor {
  name: string;
  /** Swatch value shown in the color indicator (product data, not UI theme). */
  swatch: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: Category;
  genders: Gender[];
  colors: [ProductColor, ...ProductColor[]];
  sizes: [string, ...string[]];
  images: [string, ...string[]];
  badge?: "New" | "Bestseller" | "Limited";
  /** Higher = newer drop. */
  dropOrder: number;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
}

const C = {
  black: { name: "Black", swatch: "oklch(0.18 0 0)" },
  grey: { name: "Grey", swatch: "oklch(0.6 0.005 260)" },
  cream: { name: "Cream", swatch: "oklch(0.93 0.02 85)" },
  silver: { name: "Silver", swatch: "oklch(0.82 0.01 250)" },
  white: { name: "White", swatch: "oklch(0.97 0 0)" },
  olive: { name: "Olive", swatch: "oklch(0.45 0.05 120)" },
  midnight: { name: "Midnight", swatch: "oklch(0.25 0.03 260)" },
  sand: { name: "Sand", swatch: "oklch(0.8 0.05 75)" },
  street: { name: "Street", swatch: "oklch(0.55 0.08 30)" },
} satisfies Record<string, ProductColor>;

const APPAREL: [string, ...string[]] = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOES: [string, ...string[]] = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
const ONE: [string, ...string[]] = ["One Size"];

export const products: Product[] = [
  {
    id: "p1",
    slug: "vanta-oversized-hoodie",
    name: "VANTA Oversized Hoodie",
    price: 89,
    category: "clothing",
    genders: ["men", "women"],
    colors: [C.black, C.grey, C.cream],
    sizes: APPAREL,
    images: [hoodie, hoodieAlt],
    badge: "Bestseller",
    dropOrder: 6,
    tagline: "Heavyweight. Relaxed. Essential.",
    description:
      "Designed for everyday movement. Crafted with premium heavyweight fabric and a relaxed silhouette.",
    specs: [
      { label: "Fabric", value: "480 GSM brushed-back cotton fleece" },
      { label: "Fit", value: "Oversized, dropped shoulder" },
      { label: "Details", value: "Double-layer hood, kangaroo pocket" },
      { label: "Care", value: "Cold wash, hang dry" },
    ],
  },
  {
    id: "p2",
    slug: "vanta-tech-runner",
    name: "VANTA Tech Runner",
    price: 145,
    category: "footwear",
    genders: ["men", "women"],
    colors: [C.black, C.silver],
    sizes: SHOES,
    images: [runner, runnerAlt],
    badge: "New",
    dropOrder: 9,
    tagline: "Sculpted for motion.",
    description:
      "A translucent sculpted sole meets an engineered knit upper. Built for city miles and late nights.",
    specs: [
      { label: "Upper", value: "Engineered knit with TPU overlays" },
      { label: "Sole", value: "Translucent cushioned foam" },
      { label: "Weight", value: "290 g (US 9)" },
      { label: "Drop", value: "8 mm" },
    ],
  },
  {
    id: "p3",
    slug: "essential-street-tee",
    name: "Essential Street Tee",
    price: 45,
    category: "clothing",
    genders: ["men", "women"],
    colors: [C.cream, C.black, C.grey],
    sizes: APPAREL,
    images: [tee],
    dropOrder: 3,
    tagline: "The foundation of every fit.",
    description:
      "A boxy heavyweight tee cut from dense cotton jersey. Structured shoulders, ribbed collar, lasting shape.",
    specs: [
      { label: "Fabric", value: "260 GSM organic cotton jersey" },
      { label: "Fit", value: "Boxy, cropped length" },
      { label: "Collar", value: "Ribbed 1x1, double-stitched" },
      { label: "Care", value: "Cold wash inside out" },
    ],
  },
  {
    id: "p4",
    slug: "urban-cargo-pants",
    name: "Urban Cargo Pants",
    price: 110,
    category: "clothing",
    genders: ["men"],
    colors: [C.black, C.olive],
    sizes: APPAREL,
    images: [cargo],
    dropOrder: 5,
    tagline: "Utility, refined.",
    description:
      "Wide-leg cargos in a crisp ripstop cotton. Bellowed pockets and articulated knees for an easy, structured drape.",
    specs: [
      { label: "Fabric", value: "Cotton ripstop, 280 GSM" },
      { label: "Fit", value: "Relaxed, wide leg" },
      { label: "Pockets", value: "6 — incl. bellowed cargo" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
  {
    id: "p5",
    slug: "vanta-puffer-jacket",
    name: "VANTA Puffer Jacket",
    price: 180,
    category: "clothing",
    genders: ["women"],
    colors: [C.black, C.silver],
    sizes: APPAREL,
    images: [puffer, pufferAlt],
    badge: "Limited",
    dropOrder: 8,
    tagline: "Volume without weight.",
    description:
      "A cropped, high-collar puffer with a soft matte shell. Warmth engineered into a sculptural silhouette.",
    specs: [
      { label: "Shell", value: "Recycled nylon, matte finish" },
      { label: "Fill", value: "Responsible down, 650 fill power" },
      { label: "Fit", value: "Cropped, boxy" },
      { label: "Details", value: "Two-way zip, storm collar" },
    ],
  },
  {
    id: "p6",
    slug: "minimal-crossbody-bag",
    name: "Minimal Crossbody Bag",
    price: 65,
    category: "accessories",
    genders: ["men", "women"],
    colors: [C.black],
    sizes: ONE,
    images: [crossbody],
    dropOrder: 4,
    tagline: "Carry less. Carry better.",
    description:
      "Smooth leather with a single-buckle flap and brushed silver hardware. Adjustable strap, everyday proportions.",
    specs: [
      { label: "Material", value: "Full-grain leather" },
      { label: "Hardware", value: "Brushed silver alloy" },
      { label: "Dimensions", value: "24 × 17 × 7 cm" },
      { label: "Strap", value: "Adjustable, 110–130 cm" },
    ],
  },
  {
    id: "p7",
    slug: "signature-track-jacket",
    name: "Signature Track Jacket",
    price: 125,
    category: "clothing",
    genders: ["men"],
    colors: [C.silver, C.black],
    sizes: APPAREL,
    images: [track],
    badge: "New",
    dropOrder: 7,
    tagline: "Archive energy. Future cut.",
    description:
      "A paneled track jacket in a lightweight technical shell. Stand collar, full zip, contrast sleeves.",
    specs: [
      { label: "Shell", value: "Lightweight technical nylon" },
      { label: "Lining", value: "Mesh body lining" },
      { label: "Fit", value: "Regular" },
      { label: "Details", value: "Zip pockets, elastic hem" },
    ],
  },
  {
    id: "p8",
    slug: "vanta-everyday-sneaker",
    name: "VANTA Everyday Sneaker",
    price: 135,
    category: "footwear",
    genders: ["men", "women"],
    colors: [C.white, C.grey],
    sizes: SHOES,
    images: [everyday],
    badge: "Bestseller",
    dropOrder: 2,
    tagline: "Quiet confidence.",
    description:
      "Clean leather, soft suede overlays and a cupsole made to be worn every day. Minimal by design.",
    specs: [
      { label: "Upper", value: "Nappa leather, suede overlays" },
      { label: "Lining", value: "Leather" },
      { label: "Sole", value: "Rubber cupsole" },
      { label: "Made in", value: "Portugal" },
    ],
  },
  {
    id: "p9",
    slug: "vanta-phantom-01",
    name: "VANTA Phantom 01",
    price: 165,
    category: "footwear",
    genders: ["men", "women"],
    colors: [C.midnight, C.sand, C.street],
    sizes: SHOES,
    images: [phantom],
    badge: "Limited",
    dropOrder: 10,
    tagline: "Engineered for expression.",
    description:
      "Our signature silhouette. Layered suede and mesh, a cushioned midsole and a tread built for the street.",
    specs: [
      { label: "Upper", value: "Suede, mesh and leather panels" },
      { label: "Midsole", value: "Dual-density cushioning" },
      { label: "Outsole", value: "Grippy rubber, herringbone tread" },
      { label: "Edition", value: "Limited — numbered pairs" },
    ],
  },
];

export const FEATURED_SLUG = "vanta-phantom-01";

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const allColors = Array.from(
  new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values(),
);

export const MAX_PRICE = Math.max(...products.map((p) => p.price));

export const collections = [
  {
    num: "01",
    title: "Street Essentials",
    copy: "Modern everyday clothing and oversized silhouettes.",
    image: colStreet,
    category: "clothing" as const,
  },
  {
    num: "02",
    title: "Performance Culture",
    copy: "Contemporary footwear and active-inspired fashion.",
    image: colPerformance,
    category: "footwear" as const,
  },
  {
    num: "03",
    title: "Everyday Luxury",
    copy: "Premium accessories and lifestyle products.",
    image: colLuxury,
    category: "accessories" as const,
  },
];
