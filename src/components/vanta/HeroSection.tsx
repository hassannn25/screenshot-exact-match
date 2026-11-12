import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-editorial.jpg";
import phantomImg from "@/assets/p-phantom.jpg";
import { Button } from "@/components/ui/button";
import { Sneaker3DStage } from "./Sneaker3DStage";

const ease = [0.16, 1, 0.3, 1] as const;

function FloatTag({ className, label, value, delay }: { className: string; label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 1, ease }}
      className={`pointer-events-none absolute hidden md:block ${className}`}
    >
      <div className="animate-float">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-signal" />
          <span className="h-px w-10 bg-foreground/30" />
        </div>
        <p className="label mt-2 text-muted-foreground">{label}</p>
        <p className="display-wide text-xs">{value}</p>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="grain relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <motion.img
          src={heroImg}
          alt="Model in oversized VANTA streetwear in a concrete space"
          width={1920}
          height={1088}
          fetchPriority="high"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease }}
          className="h-full w-full object-cover object-[30%_center]"
        />
      </motion.div>
      <div className="bg-hero-fade absolute inset-0" />
      <div className="bg-bottom-fade absolute inset-x-0 bottom-0 h-1/2" />
      <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[160%] w-40 animate-sweep bg-foreground/5 blur-3xl" aria-hidden />

      {/* 3D product */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 top-[10%] h-[42%] md:inset-x-auto md:right-0 md:top-[6%] md:h-[62%] md:w-[55%]"
      >
        <Sneaker3DStage
          mode="hero"
          fallback={
            <div className="grid h-full w-full place-items-center">
              <img src={phantomImg} alt="" aria-hidden className="h-[80%] w-auto animate-float object-contain mix-blend-screen" />
            </div>
          }
        />
        <FloatTag className="left-[10%] top-[22%]" label="Edition" value="Phantom 01" delay={1.2} />
        <FloatTag className="right-[8%] top-[18%]" label="Material" value="Suede / Mesh" delay={1.4} />
        <FloatTag className="bottom-[4%] right-[14%]" label="Season" value="SS — 26" delay={1.6} />
      </motion.div>

      {/* Copy */}
      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-24 md:px-10 md:pb-20">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="label mb-6 flex items-center gap-3">
          <span className="text-signal">●</span> VANTA® — New Season Collection
        </motion.p>
        <h1 className="display text-[19vw] md:text-[11vw] xl:text-[10rem]">
          {["Not made", "to follow."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={`block ${i === 1 ? "text-silver" : ""}`}
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 1.1, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1, ease }}
            className="max-w-md text-sm leading-relaxed text-foreground/75 md:text-base"
          >
            Discover a new expression of individuality. Explore the latest collection of contemporary fashion, designed for those who define their own direction.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 1, ease }} className="flex flex-wrap gap-3">
            <Button variant="hero" size="xl" asChild>
              <a href="#latest-drop">
                Explore collection <ArrowRight />
              </a>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/story">Discover the brand</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <a href="#latest-drop" className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-label="Scroll to the latest drop">
        <span className="label text-[0.6rem] text-muted-foreground">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-foreground/15">
          <span className="absolute inset-0 animate-scroll-cue bg-foreground" />
        </span>
      </a>
    </section>
  );
}
