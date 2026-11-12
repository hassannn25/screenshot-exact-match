import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, X, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { collections, products } from "@/data/products";
import type { FilterCategory, SortOption } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/pricing";
import { Wordmark } from "./Wordmark";
import { SearchDialog } from "./SearchDialog";
import { AccountSheet } from "./AccountSheet";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  search: { category?: FilterCategory; sort?: SortOption };
  panel?: "products" | "collections";
  pick?: (p: (typeof products)[number]) => boolean;
}

const NAV: NavItem[] = [
  { id: "new", label: "New Arrivals", search: { sort: "newest" }, panel: "products", pick: (p) => p.badge === "New" || p.badge === "Limited" },
  { id: "men", label: "Men", search: { category: "men" }, panel: "products", pick: (p) => p.genders.includes("men") },
  { id: "women", label: "Women", search: { category: "women" }, panel: "products", pick: (p) => p.genders.includes("women") },
  { id: "collections", label: "Collections", search: {}, panel: "collections" },
  { id: "accessories", label: "Accessories", search: { category: "accessories" } },
];

export function Navbar() {
  const { count, setCartOpen, hydrated } = useStore();
  const location = useRouterState({ select: (s) => s.location });
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [account, setAccount] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setHover(null);
    setMobile(false);
  }, [location.pathname, location.searchStr]);

  const s = location.search as { category?: string; sort?: string };
  const activeId =
    location.pathname === "/shop"
      ? s.category === "men"
        ? "men"
        : s.category === "women"
          ? "women"
          : s.category === "accessories"
            ? "accessories"
            : s.category === "clothing" || s.category === "footwear"
              ? "collections"
              : s.sort === "newest"
                ? "new"
                : null
      : null;

  const solid = !isHome || scrolled || hover !== null;
  const hovered = NAV.find((n) => n.id === hover);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-expo",
          solid ? "border-b border-border bg-background/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent",
        )}
        onMouseLeave={() => setHover(null)}
      >
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10" aria-label="Main">
          <div className="flex flex-1 items-center gap-3">
            <button type="button" className="-ml-2 grid size-10 place-items-center lg:hidden" aria-label="Open menu" onClick={() => setMobile(true)}>
              <Menu className="size-5" />
            </button>
            <Link to="/" aria-label="VANTA home" className="text-lg md:text-xl">
              <Wordmark />
            </Link>
          </div>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <li key={item.id} onMouseEnter={() => setHover(item.panel ? item.id : null)}>
                <Link
                  to="/shop"
                  search={item.search}
                  className={cn(
                    "label relative py-2 transition-colors",
                    activeId === item.id || hover === item.id ? "text-foreground" : "text-foreground/65 hover:text-foreground",
                  )}
                >
                  {item.label}
                  {activeId === item.id && (
                    <motion.span layoutId="nav-active" className="absolute -bottom-0.5 left-0 right-0 h-px bg-signal" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
            <button type="button" onClick={() => setSearch(true)} aria-label="Search" className="grid size-10 place-items-center rounded-full transition-colors hover:bg-foreground/10">
              <Search className="size-[18px]" />
            </button>
            <button type="button" onClick={() => setAccount(true)} aria-label="Account" className="hidden size-10 place-items-center rounded-full transition-colors hover:bg-foreground/10 sm:grid">
              <User className="size-[18px]" />
            </button>
            <button type="button" onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${count} items`} className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-foreground/10">
              <ShoppingBag className="size-[18px]" />
              <AnimatePresence>
                {hydrated && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-signal px-1 font-mono text-[10px] font-semibold leading-[18px] text-signal-foreground"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mega dropdown */}
        <AnimatePresence>
          {hovered?.panel && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="hidden overflow-hidden border-t border-border lg:block"
            >
              <motion.div key={hovered.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto grid max-w-[1600px] grid-cols-[220px_1fr] gap-10 px-10 py-8">
                <div className="flex flex-col justify-between">
                  <p className="display text-5xl">{hovered.label}</p>
                  <Link to="/shop" search={hovered.search} className="label flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    Shop all <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
                {hovered.panel === "collections" ? (
                  <div className="grid grid-cols-3 gap-4">
                    {collections.map((c) => (
                      <Link key={c.num} to="/shop" search={{ category: c.category }} className="group relative block aspect-[16/9] overflow-hidden rounded-sm">
                        <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105" />
                        <div className="bg-panel-fade absolute inset-0" />
                        <div className="absolute bottom-3 left-4">
                          <p className="label text-signal">{c.num}</p>
                          <p className="display-wide text-sm">{c.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {products.filter(hovered.pick ?? (() => true)).slice(0, 4).map((p) => (
                      <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="group flex items-center gap-4 rounded-sm p-2 transition-colors hover:bg-foreground/5">
                        <img src={p.images[0]} alt="" loading="lazy" className="h-20 w-16 rounded-sm object-cover" />
                        <span>
                          <span className="display-wide block text-xs">{p.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">{formatPrice(p.price)}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="flex w-full flex-col border-border bg-background p-0 sm:max-w-sm [&>button]:hidden">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
          <div className="flex h-16 items-center justify-between px-5">
            <Wordmark className="text-lg" />
            <button type="button" onClick={() => setMobile(false)} aria-label="Close menu" className="grid size-10 place-items-center">
              <X className="size-5" />
            </button>
          </div>
          <ul className="flex-1 px-5 pt-6">
            {NAV.map((item, i) => (
              <motion.li key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05, duration: 0.5 }}>
                <Link to="/shop" search={item.search} className={cn("display flex items-center justify-between border-b border-border py-4 text-4xl", activeId === item.id && "text-signal")}>
                  {item.label}
                  <ArrowUpRight className="size-5 text-muted-foreground" />
                </Link>
              </motion.li>
            ))}
            <li className="pt-6">
              <Link to="/story" className="label text-muted-foreground">Our story</Link>
            </li>
          </ul>
          <div className="grid grid-cols-2 gap-3 border-t border-border p-5">
            <button type="button" onClick={() => { setMobile(false); setAccount(true); }} className="label flex items-center justify-center gap-2 rounded-full border border-border py-3">
              <User className="size-4" /> Account
            </button>
            <button type="button" onClick={() => { setMobile(false); setCartOpen(true); }} className="label flex items-center justify-center gap-2 rounded-full bg-foreground py-3 text-background">
              <ShoppingBag className="size-4" /> Bag ({count})
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <SearchDialog open={search} onOpenChange={setSearch} />
      <AccountSheet open={account} onOpenChange={setAccount} />
    </>
  );
}
