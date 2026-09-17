# AdFuel.ai

Self-serve first-week ads. Paste a product URL. Get 3 on-brand statics, copy, and a 7-day Launch plan. You go live. We don’t run ads.

**Live site:** [adfuel.ai](https://adfuel.ai) — waitlist until Studio opens. Production needs `DATABASE_URL` so emails persist.

This branch is the product: waitlist in production; locally, one watermarked draft, live statics after $12 or your own key.

## Product rules

Read [AGENTS.project.md](./AGENTS.project.md). Short version:

- Independent. Not affiliated with any other Adfuel brand. The only AdFuel on `.ai`.
- Self-serve only. No agency, no humans, no “we launch for you.”
- Never say “Grok” in product copy — say **AI**.
- One watermarked draft free (no API spend). Regular $12 / Plus $29 / Premium $79.
- Live statics are a paid perk. BYOK anytime. No URL-to-video.

## Desktop (Grok Build CLI)

```bash
git clone https://github.com/betrnames/adfuel-ai.git
cd adfuel-ai
git checkout self-serve
npm install
grok
```

If you already have the repo:

```bash
git fetch origin
git checkout self-serve
git pull
npm install
grok
```

Paste this to pick up:

> Continue AdFuel.ai. URL in → 3 statics + copy + 7-day Launch, $12. One watermarked draft is free. Don’t chase URL-to-video. Don’t use the word Grok in copy. Don’t become an agency. Match Sora / navy #050B14 / orange #F97316. Follow AGENTS.project.md.
