# Catalog prices and icons

On 2026-09-19, 101 previously unverified published tool prices were checked against official pricing pages, storefronts, or support documents. Each `data/apps/*.json` record stores its exact source URL, verification date, plan, currency, billing period, seat minimum, and relevant limitations. Additional evidence URLs remain in `sources`.

Prices refer to the named plan, not every use case or an assumed saving. Monthly billing takes precedence when verified; annual-only prices are explicitly labeled. Annual commitments billed monthly, prepaid access passes, perpetual purchases, free tools, and sales quotes have separate representations. Introductory promotions are excluded. Notes identify seat minimums, usage tiers, mandatory extras, and regional or personal-use limits.

Display amounts use the actual billing currency. `priceMonthly` is only a KRW comparison value; one-time purchases and quotes have no monthly comparison. Currency conversion uses the recorded 2026-09-18 Frankfurter rate. A price verification date is separate from the editorial guide date.

All 121 published tools have local icons. The manifest in `data/icons.json` records provenance and content hashes. Eleven icons were replaced with current official assets or higher quality source artwork. `pnpm icons:fetch --only=SLUG --refresh` reimports a selected icon; exceptional official asset URLs live in `scripts/icons/overrides.json`. Imported images are normalized WebP files and are served locally. User-uploaded images take precedence; a failed upload falls back to the catalog icon, then the service initial.

The shared catalog is currently copied into all four repositories. Keep catalog JSON, pricing schema, and formatter synchronized until that content is managed centrally. The web pricing test checks display units, verification state, and every published tool's icon file.
