

## Goal
Get the Netlify Prerender extension serving fully-rendered HTML to crawlers/AI agents for great SEO, and make sure the React app produces meaningful, crawl-worthy HTML when it does.

## What you do in Netlify (one-time, outside Lovable)
1. As Team Owner, install the extension: https://app.netlify.com/extensions/prerender
2. In your project → **Extensions → Prerender → Enable prerendering**
3. Make sure **Project configuration → Build & deploy → Post processing → Prerendering** (legacy) is **disabled**
4. Trigger a redeploy

The extension auto-detects crawler user-agents and serves the rendered HTML. No code change is strictly required for it to work — but the prerendered output will only be as good as what our app renders. That's where the Lovable-side optimizations come in.

## What to change in Lovable (to maximize SEO value of the prerender)

### 1. Per-section SEO metadata via react-helmet-async
Today `index.html` has one static `<title>`/`<meta description>`. Since it's a one-page site, that's fine for `/`, but we should add:
- `<html lang="en">` ✓ already set
- Open Graph image (`og:image`) — currently missing, social previews will look bad
- `og:locale`, `og:site_name`
- Twitter `summary_large_image` card with image

Add `react-helmet-async` and a `<SEO />` component so this is easy to extend if you later add `/services`, `/about` pages.

### 2. Strengthen JSON-LD (already in `index.html`)
- Add real phone: `+264 81 633 6344` (currently placeholder `+264 XX XXX XXXX`)
- Add `url`, `logo`, `image`, `sameAs` (social links), `openingHours`, `priceRange`
- Add a second schema: `Service` entries for each delivery type (gifts, flowers, medicine, documents, parcels)

### 3. Semantic HTML audit
Prerender returns whatever the DOM renders. Make sure:
- One `<h1>` only (in HeroSection)
- Section headings use `<h2>` consistently
- Images have descriptive `alt` text
- The logo `<img>` has a meaningful alt (already "Parcel Fox Windhoek" ✓)

### 4. Update `netlify.toml`
The current config is good but we should:
- Remove `X-Frame-Options = "DENY"` for the prerender edge function compatibility — keep it, but be aware
- Add a `[[headers]]` block ensuring `/index.html` isn't aggressively cached (so prerender always sees latest build)
- Keep the SPA `/* → /index.html` redirect (prerender extension sits in front of it)

### 5. Add `public/sitemap.xml` and `public/robots.txt`
- `robots.txt` already exists — verify it allows crawling and points to sitemap
- Add `sitemap.xml` listing `https://parcelfoxwindhoek.com/` + section anchors (`#services`, `#about`, `#contact`)

### 6. Verify with Netlify's checker
After deploy, run the URL through https://do-you-need-prerender.netlify.app/ and view the prerendered output via curl with a crawler UA:
```
curl -A "Googlebot" https://parcelfoxwindhoek.com
```

## Files to change
- `index.html` — fix placeholder phone in JSON-LD, add `og:image`, expand schema
- `netlify.toml` — add `index.html` no-cache header
- `package.json` — add `react-helmet-async`
- `src/main.tsx` — wrap with `HelmetProvider`
- `src/components/SEO.tsx` (new) — reusable head manager
- `src/pages/Index.tsx` — use `<SEO />`
- `public/sitemap.xml` (new)
- `public/robots.txt` — add `Sitemap:` line
- `public/og-image.jpg` — you'll need to provide a 1200×630 social share image (or I can generate a placeholder from the logo)

## Open question
Do you have a social-share image (1200×630) you'd like to use for `og:image`, or should I generate one from your logo + brand colors?

