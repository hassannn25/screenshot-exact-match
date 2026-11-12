import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/vanta/HeroSection";
import { Marquee } from "@/components/vanta/Marquee";
import { Catalog, defaultFilters } from "@/components/vanta/Catalog";
import { FeaturedProduct } from "@/components/vanta/FeaturedProduct";
import { CollectionSection } from "@/components/vanta/CollectionSection";
import { BrandStory } from "@/components/vanta/BrandStory";
import { Newsletter } from "@/components/vanta/Newsletter";
import { Reveal, SectionLabel } from "@/components/vanta/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VANTA — Not Made to Follow | Luxury Streetwear" },
      { name: "description", content: "Discover the VANTA new season: oversized hoodies, tech runners and everyday luxury. Explore the latest drop in 3D." },
      { property: "og:title", content: "VANTA — Not Made to Follow" },
      { property: "og:description", content: "Discover the VANTA new season: oversized hoodies, tech runners and everyday luxury." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [filters, setFilters] = useState(defaultFilters);
  return (
    <>
      <HeroSection />
      <Marquee />
      <section id="latest-drop" className="scroll-mt-20 py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div>
              <SectionLabel index="01">New arrivals</SectionLabel>
              <h2 className="display mt-6 text-6xl md:text-9xl">The latest drop.</h2>
            </div>
            <p className="max-w-xs text-muted-foreground">New season. New perspective. Discover what's next.</p>
          </Reveal>
          <Catalog filters={filters} onChange={setFilters} />
        </div>
      </section>
      <FeaturedProduct />
      <CollectionSection />
      <BrandStory />
      <Newsletter />
    </>
  );
}
