import { createFileRoute, Link } from "@tanstack/react-router";
import storyImg from "@/assets/brand-story.jpg";
import streetImg from "@/assets/col-street.jpg";
import perfImg from "@/assets/col-performance.jpg";
import { Button } from "@/components/ui/button";
import { Reveal, SectionLabel } from "@/components/vanta/Reveal";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — VANTA" },
      { name: "description", content: "VANTA was created for individuals who see fashion as a form of identity. Read the story behind the label." },
      { property: "og:title", content: "Our Story — VANTA" },
      { property: "og:description", content: "Fashion as identity. The story behind VANTA." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Story,
});

const PILLARS = [
  { n: "01", t: "Identity", c: "We design for people who don't wait for permission. Every piece is a blank canvas for who you are." },
  { n: "02", t: "Craft", c: "Heavyweight fabrics, considered cuts and finishing you can feel. Made to last seasons, not weeks." },
  { n: "03", t: "Future", c: "Traceable materials and small, deliberate drops. Less noise, more meaning." },
];

function Story() {
  return (
    <>
      <section className="grain relative h-[85svh] min-h-[560px] overflow-hidden">
        <img src={storyImg} alt="Two models in VANTA on a rooftop at dusk" className="h-full w-full object-cover object-[center_60%]" />
        <div className="bg-bottom-fade absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-16 md:px-10">
          <p className="label text-signal">Our story</p>
          <h1 className="display mt-4 text-7xl md:text-[10rem]">More than what you wear.</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-24 md:grid-cols-2 md:px-10 md:py-32">
        <Reveal>
          <SectionLabel>Manifesto</SectionLabel>
          <p className="display-wide mt-8 text-2xl leading-snug md:text-4xl">
            VANTA was created for individuals who see fashion as a form of identity.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-foreground/80">
          <p>We believe clothing is more than fabric. It's a statement, an attitude, and a reflection of individuality.</p>
          <p>
            Born between the studio and the street, VANTA blends the precision of luxury tailoring with the energy of contemporary
            streetwear. Each collection is built around a single idea: wear what moves you forward.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-border">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08} className="border-border p-8 md:border-r md:p-12 md:last:border-r-0">
              <p className="label text-signal">{p.n}</p>
              <h2 className="display mt-4 text-6xl">{p.t}</h2>
              <p className="mt-4 text-muted-foreground">{p.c}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-4 px-5 py-24 md:grid-cols-2 md:px-10">
        <img src={streetImg} alt="Street Essentials campaign" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover" />
        <img src={perfImg} alt="Performance Culture campaign" loading="lazy" className="aspect-[4/5] w-full rounded-md object-cover md:mt-24" />
      </section>

      <section className="pb-28 text-center">
        <h2 className="display text-6xl md:text-8xl">Define your direction.</h2>
        <Button variant="hero" size="xl" className="mt-10" asChild>
          <Link to="/shop">Shop the collection</Link>
        </Button>
      </section>
    </>
  );
}
