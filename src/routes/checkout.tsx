import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Check, CreditCard, Loader2, Lock } from "lucide-react";
import { getProduct } from "@/data/products";
import { useStore, type CartLine } from "@/lib/store";
import { checkoutSchema, type CheckoutForm } from "@/lib/checkout";
import { formatPrice, makeOrderReference, cartTotals } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/vanta/Wordmark";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — VANTA" },
      { name: "description", content: "Almost yours. Complete your VANTA order in this demo checkout." },
      { property: "og:title", content: "Checkout — VANTA" },
      { property: "og:description", content: "Complete your VANTA order in this demo checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

type Errors = Partial<Record<keyof CheckoutForm, string>>;

const FIELDS: { name: Exclude<keyof CheckoutForm, "payment">; label: string; type?: string; autoComplete: string; span?: boolean }[] = [
  { name: "fullName", label: "Full name", autoComplete: "name", span: true },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Shipping address", autoComplete: "street-address", span: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "postalCode", label: "Postal code", autoComplete: "postal-code" },
];

interface Confirmation {
  reference: string;
  lines: CartLine[];
  totals: ReturnType<typeof cartTotals>;
  name: string;
  email: string;
  payment: CheckoutForm["payment"];
}

function CheckoutPage() {
  const { lines, totals, hydrated, clearCart, setLastOrder, count } = useStore();
  const [form, setForm] = useState<CheckoutForm>({ fullName: "", email: "", phone: "", address: "", city: "", postalCode: "", payment: "cod" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Confirmation | null>(null);

  const set = (k: keyof CheckoutForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = checkoutSchema.safeParse(form);
    if (!r.success) {
      const errs: Errors = {};
      for (const issue of r.error.issues) {
        const k = issue.path[0] as keyof CheckoutForm;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const reference = makeOrderReference();
      setDone({ reference, lines, totals, name: r.data.fullName, email: r.data.email, payment: r.data.payment });
      setLastOrder({ reference, total: totals.total, items: count, placedAt: Date.now() });
      clearCart();
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1400);
  };

  if (done) return <OrderConfirmed c={done} />;

  if (hydrated && lines.length === 0) {
    return (
      <div className="grid min-h-[80vh] place-items-center px-5 pt-24 text-center">
        <div>
          <p className="label text-muted-foreground">Checkout</p>
          <h1 className="display mt-4 text-6xl md:text-8xl">Your bag is empty.</h1>
          <p className="mt-4 text-muted-foreground">Add something you love, then come back here.</p>
          <Button variant="hero" size="xl" className="mt-8" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <p className="label text-muted-foreground">Checkout — Demo experience</p>
      <h1 className="display mt-4 text-7xl md:text-[9rem]">Almost yours.</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <form onSubmit={submit} noValidate className="space-y-12">
          <section>
            <h2 className="label mb-6 flex items-center gap-3"><span className="text-signal">01</span> Shipping details</h2>
            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <div key={f.name} className={cn(f.span && "sm:col-span-2")}>
                  <label htmlFor={`f-${f.name}`} className="label mb-2 block text-muted-foreground">{f.label}</label>
                  <input
                    id={`f-${f.name}`}
                    name={f.name}
                    type={f.type ?? "text"}
                    autoComplete={f.autoComplete}
                    value={form[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                    aria-invalid={!!errors[f.name]}
                    aria-describedby={errors[f.name] ? `e-${f.name}` : undefined}
                    className={cn(
                      "h-13 w-full rounded-sm border bg-surface px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground",
                      errors[f.name] ? "border-destructive" : "border-border",
                    )}
                  />
                  {errors[f.name] && <p id={`e-${f.name}`} className="mt-2 text-xs text-destructive">{errors[f.name]}</p>}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="label mb-6 flex items-center gap-3"><span className="text-signal">02</span> Payment method</h2>
            <div role="radiogroup" aria-label="Payment method" className="grid gap-3 sm:grid-cols-2">
              {([
                { v: "cod", label: "Cash on delivery", sub: "Pay when your order arrives", Icon: Banknote },
                { v: "card", label: "Simulated card", sub: "Demo only — no card details collected", Icon: CreditCard },
              ] as const).map(({ v, label, sub, Icon }) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={form.payment === v}
                  onClick={() => set("payment", v)}
                  className={cn(
                    "flex items-start gap-4 rounded-md border p-5 text-left transition-colors",
                    form.payment === v ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/40",
                  )}
                >
                  <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border", form.payment === v ? "border-foreground" : "border-foreground/30")}>
                    {form.payment === v && <span className="size-2.5 rounded-full bg-foreground" />}
                  </span>
                  <span className="flex-1">
                    <span className="display-wide flex items-center gap-2 text-sm"><Icon className="size-4" /> {label}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{sub}</span>
                  </span>
                </button>
              ))}
            </div>
            <AnimatePresence>
              {form.payment === "card" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="grain relative aspect-[1.586] w-full max-w-[300px] overflow-hidden rounded-xl border border-border bg-ink p-5 shadow-glow">
                      <div className="flex justify-between">
                        <Wordmark className="text-sm" />
                        <span className="label text-muted-foreground">Demo</span>
                      </div>
                      <p className="mt-10 font-mono tracking-[0.2em] text-foreground/80">•••• •••• •••• DEMO</p>
                      <div className="label mt-4 flex justify-between text-muted-foreground">
                        <span>{form.fullName || "Card holder"}</span>
                        <span>12/30</span>
                      </div>
                    </div>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      This is a simulated payment for demonstration. No real card is charged and no payment details are requested.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={submitting || !hydrated}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" /> Placing order…
              </>
            ) : (
              <>
                <Lock /> Place demo order — {formatPrice(totals.total)}
              </>
            )}
          </Button>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-md border border-border bg-surface p-6">
            <h2 className="label mb-6">Order summary ({count})</h2>
            <ul className="space-y-4">
              {lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                return (
                  <li key={l.key} className="flex gap-4">
                    <div className="relative">
                      <img src={p.images[0]} alt="" width={64} height={80} className="h-20 w-16 rounded-sm object-cover" />
                      <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">{l.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="display-wide text-xs">{p.name}</p>
                      <p className="label mt-1 text-muted-foreground">{l.color} · {l.size}</p>
                    </div>
                    <p className="font-mono text-sm">{formatPrice(p.price * l.quantity)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatPrice(totals.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-mono">{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</span></div>
              <div className="flex justify-between border-t border-border pt-3"><span className="display-wide">Total</span><span className="font-mono text-lg">{formatPrice(totals.total)}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrderConfirmed({ c }: { c: Confirmation }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 text-center md:pt-40">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto grid size-20 place-items-center rounded-full bg-success text-background"
      >
        <Check className="size-9" strokeWidth={2.5} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
        <h1 className="display mt-8 text-7xl md:text-9xl">Order confirmed.</h1>
        <p className="mx-auto mt-6 max-w-lg text-foreground/80">
          Thank you for choosing VANTA. Your order has been successfully placed in this demo experience.
        </p>
        <div className="glass mx-auto mt-10 inline-flex flex-col items-center rounded-md px-8 py-5">
          <span className="label text-muted-foreground">Order reference</span>
          <span className="mt-2 font-mono text-2xl tracking-wider">{c.reference}</span>
        </div>
        <div className="mx-auto mt-10 max-w-md rounded-md border border-border p-6 text-left">
          <ul className="space-y-2 text-sm">
            {c.lines.map((l) => {
              const p = getProduct(l.slug);
              return p ? (
                <li key={l.key} className="flex justify-between gap-4">
                  <span>{l.quantity} × {p.name} <span className="text-muted-foreground">({l.color}, {l.size})</span></span>
                  <span className="font-mono">{formatPrice(p.price * l.quantity)}</span>
                </li>
              ) : null;
            })}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="display-wide text-sm">Total</span>
            <span className="font-mono">{formatPrice(c.totals.total)}</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {c.payment === "cod" ? "Cash on delivery" : "Simulated card"} · A confirmation would be sent to {c.email} in a live store.
          </p>
        </div>
        <Button variant="hero" size="xl" className="mt-10" asChild>
          <Link to="/shop">Continue shopping</Link>
        </Button>
      </motion.div>
    </div>
  );
}
