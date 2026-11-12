import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import storyImg from "@/assets/brand-story.jpg";
import detailImg from "@/assets/alt-puffer.jpg";
import { Button } from "@/components/ui/button";
import { Reveal, SectionLabel } from "./Reveal";

export function BrandStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-10">
        <div className="relative md:col-span-7">
          <div className="aspect-[4/5] overflow-hidden rounded-md">
            <motion.img style={{ y: y1 }} src={storyImg} alt="Two models in VANTA on a rooftop at dusk" loading="lazy" width={1200} height={1504} className="h-[116%] w-full object-cover" />
          </div>
          <motion.div style={{ y: y2 }} className="absolute -bottom-10 -right-4 hidden w-[38%] overflow-hidden rounded-md border-4 border-background shadow-float md:block lg:-right-16">
            <img src={detailImg} alt="" aria-hidden loading="lazy" width={960} height={1200} className="aspect-[4/5] w-full object-cover" />
          </motion.div>
        </div>
        <div className="flex flex-col justify-center md:col-span-5 md:pl-10 lg:pl-20">
          <Reveal>
            <SectionLabel index="04">Brand story</SectionLabel>
            <h2 className="display mt-6 text-6xl md:text-7xl xl:text-8xl">More than what you wear.</h2>
            <p className="mt-8 text-lg leading-relaxed text-foreground/80">
              VANTA was created for individuals who see fashion as a form of identity. We believe clothing is more than fabric. It's a statement, an attitude, and a reflection of individuality.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["2019", "Founded"],
                ["32", "Cities"],
                ["100%", "Traceable cotton"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="display text-4xl">{n}</p>
                  <p className="label mt-2 text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
            <Button variant="line" size="xl" className="mt-10" asChild>
              <Link to="/story">Discover our story</Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
