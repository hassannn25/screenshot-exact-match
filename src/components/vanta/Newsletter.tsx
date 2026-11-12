import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { z } from "zod";
import { Reveal } from "./Reveal";

const emailSchema = z.string().trim().email().max(255);

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = emailSchema.safeParse(email);
    if (!r.success) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setDone(true);
  };

  return (
    <section className="grain relative overflow-hidden border-y border-border bg-ink py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden opacity-[0.06]" aria-hidden>
        <div className="display flex animate-marquee whitespace-nowrap text-[22vw]">
          <span className="pr-12">VANTA — NEXT DROP — VANTA — NEXT DROP —&nbsp;</span>
          <span className="pr-12">VANTA — NEXT DROP — VANTA — NEXT DROP —&nbsp;</span>
        </div>
      </div>
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <p className="label text-signal">Members first</p>
          <h2 className="display mt-6 text-6xl md:text-8xl">Get in before the drop.</h2>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Join the VANTA community and stay updated on upcoming collections, exclusive releases, and new arrivals.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass mx-auto mt-10 flex max-w-lg items-center gap-4 rounded-full px-6 py-4 text-left"
                role="status"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success text-background">
                  <Check className="size-4" />
                </span>
                <span className="text-sm">
                  You're on the list. We'll let <span className="font-mono">{email.trim()}</span> know before the next drop.
                </span>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate className="mx-auto mt-10 max-w-lg" exit={{ opacity: 0, y: -10 }}>
                <div className={`glass flex items-center rounded-full p-1.5 transition-colors ${error ? "border-destructive" : ""}`}>
                  <label htmlFor="nl-email" className="sr-only">Email address</label>
                  <input
                    id="nl-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Your email address"
                    aria-invalid={!!error}
                    aria-describedby={error ? "nl-error" : undefined}
                    className="h-12 flex-1 bg-transparent px-5 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button type="submit" className="label flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-background transition-colors hover:bg-silver">
                    Subscribe <ArrowRight className="size-3.5" />
                  </button>
                </div>
                {error && (
                  <p id="nl-error" className="mt-3 text-sm text-destructive">
                    {error}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
