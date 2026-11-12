import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { collections } from "@/data/products";
import { Reveal, SectionLabel } from "./Reveal";

export function CollectionSection() {
  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="03">Collections</SectionLabel>
            <h2 className="display mt-6 text-6xl md:text-8xl">Three ways to wear it.</h2>
          </div>
        </Reveal>
      </div>
      <div className="mt-12 flex flex-col gap-2 px-2 md:h-[80vh] md:flex-row md:px-2">
        {collections.map((c, i) => (
          <Reveal key={c.num} delay={i * 0.08} className="group relative h-[70vh] overflow-hidden rounded-md transition-[flex] duration-700 ease-expo md:h-auto md:flex-1 md:hover:flex-[1.6]">
            <Link to="/shop" search={{ category: c.category }} className="absolute inset-0 block" aria-label={`Explore ${c.title}`}>
              <img src={c.image} alt={c.title} loading="lazy" width={1008} height={1408} className="h-full w-full object-cover transition-transform duration-[1600ms] ease-expo group-hover:scale-110" />
              <div className="bg-panel-fade absolute inset-0" />
              <div className="absolute inset-0 bg-ink/20 transition-colors duration-700 group-hover:bg-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="label text-signal">{c.num}</p>
                <h3 className="display mt-3 text-5xl md:text-6xl xl:text-7xl">{c.title}</h3>
                <p className="mt-3 max-w-xs text-sm text-foreground/75">{c.copy}</p>
                <span className="label mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/30 px-5 py-3 transition-all duration-500 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                  Explore collection <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
