import { Link } from "@tanstack/react-router";
import { Wordmark } from "./Wordmark";

const linkCls = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Wordmark className="text-2xl" />
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">Beyond fashion. Beyond ordinary.</p>
          </div>
          <div>
            <h3 className="label mb-5">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/shop" search={{ sort: "newest" }} className={linkCls}>New Arrivals</Link></li>
              <li><Link to="/shop" search={{ category: "clothing" }} className={linkCls}>Clothing</Link></li>
              <li><Link to="/shop" search={{ category: "footwear" }} className={linkCls}>Footwear</Link></li>
              <li><Link to="/shop" search={{ category: "accessories" }} className={linkCls}>Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="label mb-5">Help</h3>
            <ul className="space-y-3">
              <li><Link to="/help" hash="contact" className={linkCls}>Contact</Link></li>
              <li><Link to="/help" hash="shipping" className={linkCls}>Shipping Information</Link></li>
              <li><Link to="/help" hash="returns" className={linkCls}>Returns</Link></li>
              <li><Link to="/help" hash="faq" className={linkCls}>FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="label mb-5">VANTA</h3>
            <ul className="space-y-3">
              <li><Link to="/story" className={linkCls}>Our Story</Link></li>
              <li><Link to="/help" hash="careers" className={linkCls}>Careers</Link></li>
              <li><Link to="/help" hash="privacy" className={linkCls}>Privacy Policy</Link></li>
              <li><Link to="/help" hash="terms" className={linkCls}>Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="label mb-5">Social</h3>
            <ul className="space-y-3">
              <li><a href="https://www.instagram.com" target="_blank" rel="noreferrer" className={linkCls}>Instagram</a></li>
              <li><a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className={linkCls}>TikTok</a></li>
              <li><a href="https://www.pinterest.com" target="_blank" rel="noreferrer" className={linkCls}>Pinterest</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 overflow-hidden">
          <p className="wordmark select-none text-center text-[17vw] leading-none tracking-[0.12em] text-outline md:text-[15vw]" aria-hidden>
            VANTA
          </p>
        </div>
        <div className="label mt-8 flex flex-col justify-between gap-3 border-t border-border pt-6 text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} VANTA®. All rights reserved.</span>
          <span>Demo storefront — no real orders or payments are processed.</span>
        </div>
      </div>
    </footer>
  );
}
