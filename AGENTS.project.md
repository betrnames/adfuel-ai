# AdFuel.ai — build bible

This is the product. Future work follows it. Do not reopen the category.

## What it is

AdFuel.ai is a **self-serve first-campaign kit**. Someone with a product and no Ads Manager pastes a URL or one line, gets copy + budget + the clicks to go live, and pays if they want more runs.

Independent. Not affiliated with Adfuel.com, Adfuel.io, or any other Adfuel brand. The only AdFuel on `.ai`.

## Who it is for

A founder or shop with nothing: no pixel, no agency, no Ads Manager. Not media buyers. Not enterprises who want a Slack channel.

## What we never do

- Run ads, manage budgets, or hop on calls
- Act like an agency or “done for you”
- Human customer service (the Desk answers; Account handles cancel/invoices)
- Custom onboarding, retainers, or a media-buying dashboard
- Pretend affiliation with any other Adfuel TLD

If a request would make Gabe the agency, refuse it in the product and point at Studio + Launch.

## How it charges

Three free **draft** kits (no hosted AI — no API spend). Then:

| Plan | Price | Credits |
|---|---|---|
| Regular 87 | $12/mo | 50 (hosted AI + launch playbook) |
| Plus 91 | $29/mo | 120 (+ image ads) |
| Premium 93 | $79/mo | 400 (+ stories, targeting) |

Undercut AdCreative ($39), Predis ($19), Pencil ($14). Keep **>50% gross margin** on hosted AI at full tank (API + Stripe). BYOK is higher margin — their key, our tank. Hosted AI is a **paid perk** so revenue lands before API cost.

Stripe Checkout when `STRIPE_SECRET_KEY` is set; otherwise the ledger so preview still works. Real invoices on Account. Never fake a pay button.

## Product surface

- **Studio** — generate pack, Octane Score, Launch steps, public share `/p/:id`
- **Connections** — add your own key (xAI / OpenAI / Anthropic) on any plan; hosted AI only after they pay; optional MCP
- **Desk** — on-site receptionist; no humans; canned FAQ first, model second
- **Checkout / Account** — pay, invoices, cancel

Hosted AI is a paid perk. Trial writes draft kits (zero API). Hosted AI after they subscribe. BYOK anytime. Never say “Grok” in product copy — say AI. The tank still bills AdFuel.

## Look

Match the live AdFuel chrome: **Sora 300–800**, black-navy **#050B14**, orange **#F97316**, peach **#FB8A3C**, teal **#26DBE2**, white type. Pill buttons. Stroke orange flame (not filled), “AdFuel” white bold, “.ai” peach. Hero uses extra-bold stacked type with the orange→gold→teal **ignite** word. Do not restyle away from this.

Generated ads **keep the source product’s colors and typography**. Read the URL / pasted hex. Never paint someone else’s campaign in AdFuel orange.

Product copy stays self-serve. Do not become an agency because the brand site says “manage campaigns.”

## Launch

1. Publish with Stripe keys for live cards.
2. Run one real product through Studio, share the public pack.
3. Desk + FAQ catch questions. Do not inbox.

## Do not add

A media buyer, team seats as the business, “talk to sales,” a second brand name, or anything that needs Gabe to reply.
