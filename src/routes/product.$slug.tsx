import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getProduct, products } from "@/data/products";
import { useStore } from "@/lib/store";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductCard } from "@/components/vanta/ProductCard";
import { AddedBurst } from "@/components/vanta/AddedBurst";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — VANTA` : "Product unavailable — VANTA";
    const description = p ? `${p.tagline} ${p.description}` : "This product could not be found.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-[70vh] place-items-center px-5 pt-24 text-center">
      <div>
        <p className="display text-6xl">Sold out of existence.</p>
        <p className="mt-4 text-muted-foreground">We couldn't find that product.</p>
        <Button variant="hero" size="xl" className="mt-8" asChild>
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    </div>
  ),
  component: ProductPage,
});

const VIEW_CROPS = ["", "scale-[1.6] object-[50%_30%]", "scale-[2] object-[60%_70%]"];
const VIEW_NAMES = ["Front", "Detail", "Texture"];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, setCartOpen, wishlist, toggleWishlist } = useStore();
  const oneSize = product.sizes.length === 1;
  const [color, setColor] = useState<string | null>(product.colors.length === 1 ? product.colors[0].name : null);
  const [size, setSize] = useState<string | null>(oneSize ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<{ color?: boolean; size?: boolean }>({});
  const [added, setAdded] = useState(false);
  const [view, setView] = useState(0);
  const wished = wishlist.includes(product.slug);

  const views =
    product.images.length > 1
      ? product.images.map((src, i) => ({ src, crop: "", name: i === 0 ? "Product" : "Editorial" })).concat([{ src: product.images[0], crop: VIEW_CROPS[1] ?? "", name: "Detail" }])
      : VIEW_CROPS.map((crop, i) => ({ src: product.images[0], crop, name: VIEW_NAMES[i] ?? "View" }));

  const current = views[view] ?? views[0]!;
  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).concat(products.filter((p) => p.category !== product.category)).slice(0, 4);

  const add = () => {
    const e = { color: !color, size: !size };
    setErrors(e);
    if (e.color || e.size) return;
    addToCart(product.slug, size!, color!, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    toast.success(`${product.name} added`, {
      description: `${color} · ${size} · Qty ${qty}`,
      action: { label: "View bag", onClick: () => setCartOpen(true) },
    });
  };

  return (
    <div className="pt-16 md:pt-20">
      <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-10">
        <nav className="label flex gap-2 text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground">Home</Link> /
          <Link to="/shop" search={{ category: product.category }} className="hover:text-foreground capitalize">{product.category}</Link> /
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 pb-24 md:px-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex gap-3 md:flex-col">
            {views.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setView(i)}
                aria-label={`View ${v.name}`}
                aria-pressed={view === i}
                className={cn("relative h-24 w-20 overflow-hidden rounded-sm bg-surface ring-1 transition-all", view === i ? "ring-foreground" : "ring-transparent opacity-60 hover:opacity-100")}
              >
                <img src={v.src} alt="" className={cn("h-full w-full object-cover", v.crop)} />
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-md bg-surface">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={view}
                src={current.src}
                alt={`${product.name} — ${current.name}`}
                width={960}
                height={1200}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={cn("absolute inset-0 h-full w-full object-cover", current.crop)}
              />
            </AnimatePresence>
            {product.badge && <span className="label absolute left-4 top-4 rounded-full bg-foreground px-3 py-1.5 text-background">{product.badge}</span>}
            <span className="label absolute bottom-4 left-4 text-muted-foreground">{String(view + 1).padStart(2, "0")} / {String(views.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="label text-muted-foreground">{product.tagline}</p>
          <h1 className="display mt-3 text-5xl md:text-7xl">{product.name}</h1>
          <p className="mt-4 font-mono text-2xl">{formatPrice(product.price)}</p>
          <p className="mt-6 max-w-lg leading-relaxed text-foreground/80">{product.description}</p>

          <fieldset className="mt-8">
            <legend className="label mb-3 text-muted-foreground">
              Color {color && <>— <span className="text-foreground">{color}</span></>}
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-pressed={color === c.name}
                  onClick={() => {
                    setColor(c.name);
                    setErrors((e) => ({ ...e, color: false }));
                  }}
                  className={cn(
                    "label flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors",
                    color === c.name ? "border-foreground bg-foreground/10" : "border-foreground/15 hover:border-foreground/50",
                  )}
                >
                  <span className="size-3.5 rounded-full ring-1 ring-foreground/30" style={{ background: c.swatch }} />
                  {c.name}
                </button>
              ))}
            </div>
            {errors.color && <p className="mt-2 text-sm text-destructive" role="alert">Please choose a color.</p>}
          </fieldset>

          <fieldset className="mt-8">
            <legend className="label mb-3 flex w-full justify-between text-muted-foreground">
              <span>Size</span>
              {!oneSize && <Link to="/help" hash="faq" className="underline-offset-4 hover:text-foreground hover:underline">Size guide</Link>}
            </legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s);
                    setErrors((e) => ({ ...e, size: false }));
                  }}
                  className={cn(
                    "label rounded-sm border py-3.5 transition-colors",
                    oneSize && "col-span-3",
                    size === s ? "border-foreground bg-foreground text-background" : "border-foreground/15 hover:border-foreground/60",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.size && <p className="mt-2 text-sm text-destructive" role="alert">Please select a size.</p>}
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-14 items-center rounded-full border border-border">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-12 place-items-center hover:text-signal">
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center font-mono" aria-live="polite" aria-label="Quantity">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-full w-12 place-items-center hover:text-signal">
                <Plus className="size-4" />
              </button>
            </div>
            <Button variant="hero" size="xl" className="relative min-w-[220px] flex-1 overflow-hidden" onClick={add}>
              Add to bag — {formatPrice(product.price * qty)}
              <AddedBurst show={added} />
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className="grid size-14 place-items-center rounded-full border border-border transition-colors hover:border-foreground"
            >
              <Heart className={cn("size-5", wished && "fill-signal text-signal")} />
            </button>
          </div>

          <ul className="mt-8 grid gap-3 border-y border-border py-6 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck className="size-4" /> Free over {formatPrice(FREE_SHIPPING_THRESHOLD)}</li>
            <li className="flex items-center gap-2"><RotateCcw className="size-4" /> 30-day returns</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4" /> 2-year quality promise</li>
          </ul>

          <Accordion type="single" collapsible defaultValue="specs" className="mt-2">
            <AccordionItem value="specs">
              <AccordionTrigger className="label">Specifications</AccordionTrigger>
              <AccordionContent>
                <dl className="divide-y divide-border">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex justify-between gap-6 py-3 text-sm">
                      <dt className="text-muted-foreground">{s.label}</dt>
                      <dd className="text-right">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="label">Shipping & returns</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Standard delivery in 3–5 business days. Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}. Free returns within 30 days, unworn with tags attached.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <h2 className="display text-5xl md:text-7xl">Complete the look.</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
