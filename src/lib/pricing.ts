export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING = 12;

export interface LineLike {
  price: number;
  quantity: number;
}

export function cartTotals(lines: LineLike[]) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  return { subtotal, shipping, total: subtotal + shipping };
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function makeOrderReference(now = Date.now(), rand = Math.random()) {
  const stamp = now.toString(36).toUpperCase().slice(-5);
  const tail = Math.floor(rand * 46656).toString(36).toUpperCase().padStart(3, "0");
  return `VNT-${stamp}-${tail}`;
}
