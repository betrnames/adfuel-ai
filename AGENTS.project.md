# AdFuel.ai — build bible

This is the product. Future work follows it. Do not reopen the category.

## What it is

AdFuel.ai is a **self-serve first-week ad pack**. Someone with a product URL (and a plan to spend this week) pastes the URL, gets **3 on-brand statics + copy + a 7-day Launch plan**, and goes live themselves.

Independent. Not affiliated with Adfuel.com, Adfuel.io, or any other Adfuel brand. The only AdFuel on `.ai`.

## Who it is for

A founder or shop **about to spend this week**. They have a product URL. They may not know Ads Manager. They are not a media buyer and not an enterprise.

Not: people who are only curious about ads. Not: URL-to-video. Not: we launch for you.

## What we never do

- Run ads, manage budgets, or hop on calls
- Act like an agency or “done for you”
- Human customer service (the Desk answers; Account handles cancel/invoices)
- Custom onboarding, retainers, or a media-buying dashboard
- Pretend affiliation with any other Adfuel TLD
- Chase UGC / URL-to-video as the SKU

If a request would make Gabe the agency, refuse it in the product and point at Studio + Launch.

## How it charges

One credit = **one first-week pack** (3 feed statics + copy + 7-day Launch). Free sample is **one watermarked draft pack** (no API spend). Then:

| Plan | Price | Packs | What you get |
|---|---|---|---|
| Regular 87 | $12/mo | 10 (30 statics) | 3×1:1 statics, copy, 7-day Launch |
| Plus 91 | $29/mo | 30 (120 statics) | Everything in Regular + a 9:16 story static |
| Premium 93 | $79/mo | 80 (400 statics) | Everything in Plus + extra story variants |

Undercut AdCreative ($39). Same entry price as AdDogs ($12) — they sell a cloned file; we sell the file **plus** the 7-day clicks. Keep **>50% gross margin** on hosted AI at full tank (API + Stripe). BYOK is higher margin — their key, our tank. Hosted AI (live statics) is a **paid perk** so revenue lands before API cost.

Stripe Checkout when `STRIPE_SECRET_KEY` is set; otherwise the ledger so preview still works. Real invoices on Account. Never fake a pay button.

## Product surface

- **Studio** — paste URL, generate pack, Octane Score, Creative (statics), Copy, Launch, public share `/p/:id`
- **Connections** — add your own key (xAI / OpenAI / Anthropic) on any plan; live statics only after they pay (or BYOK); optional MCP
- **Desk** — on-site receptionist; no humans; canned FAQ first, model second
- **Checkout / Account** — pay, invoices, cancel

Trial writes a watermarked draft pack (zero API). Paid writes live statics. BYOK anytime. Never say “Grok” in product copy — say AI. The tank still bills AdFuel.

## Look

Match the live AdFuel chrome: **Sora 300–800**, black-navy **#050B14**, orange **#F97316**, peach **#FB8A3C**, teal **#26DBE2**, white type. Pill buttons. Stroke orange flame (not filled), “AdFuel” white bold, “.ai” peach. Hero uses extra-bold stacked type with the orange→gold→teal **ignite** word. Do not restyle away from this.

Generated ads **keep the source product’s colors and typography**. Read the URL / pasted hex. Never paint someone else’s campaign in AdFuel orange.

Product copy stays self-serve. Do not become an agency because the brand site says “manage campaigns.”

## Launch

Public site is **waitlist-only** in production (`import.meta.env.PROD`). Studio, login, and generate stay off until `VITE_ADFUEL_WAITLIST=false` and Stripe is live.

1. Capture emails. Rate-limit. Don’t generate on the public site.
2. Publish with Stripe keys for live cards, then flip waitlist off.
3. Desk + FAQ catch questions. Do not inbox.

## Do not add

A media buyer, team seats as the business, “talk to sales,” URL-to-video as the SKU, a second brand name, or anything that needs Gabe to reply.
