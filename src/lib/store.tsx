import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "@/data/products";
import { cartTotals } from "@/lib/pricing";

export interface CartLine {
  key: string;
  slug: string;
  size: string;
  color: string;
  quantity: number;
}

export interface LastOrder {
  reference: string;
  total: number;
  items: number;
  placedAt: number;
}

interface StoreValue {
  hydrated: boolean;
  lines: CartLine[];
  count: number;
  totals: ReturnType<typeof cartTotals>;
  addToCart: (slug: string, size: string, color: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (slug: string) => boolean;
  lastOrder: LastOrder | null;
  setLastOrder: (o: LastOrder) => void;
}

const StoreContext = createContext<StoreValue | null>(null);
const CART_KEY = "vanta.cart.v1";
const WISH_KEY = "vanta.wishlist.v1";
const ORDER_KEY = "vanta.lastOrder.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [lastOrder, setLastOrderState] = useState<LastOrder | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setLines(read<CartLine[]>(CART_KEY, []).filter((l) => getProduct(l.slug)));
    setWishlist(read<string[]>(WISH_KEY, []));
    setLastOrderState(read<LastOrder | null>(ORDER_KEY, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback((slug: string, size: string, color: string, quantity = 1) => {
    const key = `${slug}__${size}__${color}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(10, l.quantity + quantity) } : l));
      }
      return [...prev, { key, slug, size, color, quantity: Math.min(10, quantity) }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(10, quantity) } : l)),
    );
  }, []);

  const removeLine = useCallback((key: string) => setLines((p) => p.filter((l) => l.key !== key)), []);
  const clearCart = useCallback(() => setLines([]), []);

  const toggleWishlist = useCallback(
    (slug: string) => {
      const adding = !wishlist.includes(slug);
      setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
      return adding;
    },
    [wishlist],
  );

  const setLastOrder = useCallback((o: LastOrder) => {
    setLastOrderState(o);
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(o));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const priced = lines.map((l) => ({ price: getProduct(l.slug)?.price ?? 0, quantity: l.quantity }));
    return {
      hydrated,
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      totals: cartTotals(priced),
      addToCart,
      setQuantity,
      removeLine,
      clearCart,
      cartOpen,
      setCartOpen,
      wishlist,
      toggleWishlist,
      lastOrder,
      setLastOrder,
    };
  }, [hydrated, lines, addToCart, setQuantity, removeLine, clearCart, cartOpen, wishlist, toggleWishlist, lastOrder, setLastOrder]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
