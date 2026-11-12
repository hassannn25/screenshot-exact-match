<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- The 3D sneaker (`src/components/vanta/Sneaker3D.tsx`) is browser-only; load it only through `Sneaker3DStage` (ClientOnly + lazy import + image fallback) so SSR never imports three.js and non-WebGL devices see a photo.
- Product data lives in `src/data/products.ts`; filtering/sorting and pricing rules are pure functions in `src/lib/catalog.ts` and `src/lib/pricing.ts` so they stay unit-testable (`src/test/store-rules.test.ts`).
- Bag, wishlist and last order persist in localStorage via `StoreProvider` (`src/lib/store.tsx`), read only after hydration to avoid SSR mismatches.
- Checkout is a frontend-only simulation: never add real payment processing or collect card details.
- The `/shop` filters are mirrored in URL search params so nav links and shared URLs open pre-filtered.
