import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING, formatPrice } from "@/lib/pricing";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Information — VANTA" },
      { name: "description", content: "Shipping, returns, FAQs, contact, careers and policies for the VANTA demo store." },
      { property: "og:title", content: "Help & Information — VANTA" },
      { property: "og:description", content: "Shipping, returns, FAQs and contact for VANTA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Help,
});

const FAQ = [
  { q: "How do VANTA pieces fit?", a: "Our tops are cut oversized — size down for a regular fit. Footwear runs true to US sizing." },
  { q: "Is this a real store?", a: "No. VANTA is a fictional brand and this is a frontend demonstration. No real orders, payments or shipments take place." },
  { q: "Can I change my order?", a: "In a live store you would have 1 hour after placing an order to edit it. In this demo, orders are simulated." },
  { q: "Where is my bag saved?", a: "Your bag and wishlist are saved on this device, so they're still here when you come back." },
];

function Block({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border py-12 md:grid md:grid-cols-[280px_1fr] md:gap-12">
      <div>
        <p className="label text-signal">{index}</p>
        <h2 className="display mt-3 text-5xl">{title}</h2>
      </div>
      <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-foreground/80 md:mt-0">{children}</div>
    </section>
  );
}

function Help() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pt-40">
      <p className="label text-muted-foreground">VANTA® / Help</p>
      <h1 className="display mt-4 text-7xl md:text-[9rem]">How can we help?</h1>
      <div className="mt-16">
        <Block id="contact" index="01" title="Contact">
          <p>Our client team is available Monday to Friday, 9:00–18:00.</p>
          <p className="font-mono text-sm">care@vanta.example · +1 (555) 010-2026</p>
          <p className="text-sm text-muted-foreground">Contact details are placeholders for this demo brand.</p>
        </Block>
        <Block id="shipping" index="02" title="Shipping">
          <p>Standard delivery takes 3–5 business days and costs {formatPrice(STANDARD_SHIPPING)}.</p>
          <p>Orders over {formatPrice(FREE_SHIPPING_THRESHOLD)} ship free.</p>
        </Block>
        <Block id="returns" index="03" title="Returns">
          <p>Return any unworn item with tags attached within 30 days for a full refund. Returns are free.</p>
        </Block>
        <Block id="faq" index="04" title="FAQs">
          <Accordion type="single" collapsible>
            {FAQ.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Block>
        <Block id="careers" index="05" title="Careers">
          <p>We're always looking for designers, makers and storytellers who see fashion differently. There are no open roles in this demo.</p>
        </Block>
        <Block id="privacy" index="06" title="Privacy">
          <p>This demo stores your bag, wishlist and last order reference only in your browser. Nothing is sent to a server.</p>
        </Block>
        <Block id="terms" index="07" title="Terms">
          <p>VANTA is a fictional brand created for a frontend design demonstration. Products, prices and orders are not real.</p>
        </Block>
      </div>
    </div>
  );
}
