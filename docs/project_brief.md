# Chopper Bikes Website — Comprehensive Project Brief

**Version:** 1.0
**Date:** 27 Aug 2025
**Owner:** _Krzysiek (PM/Tech Lead)_
**Target launch:** in 10 days
**Budget:** ≤ \$100 for year 1 (domain + transactional email if needed; hosting \$0 on Cloudflare Pages)

---

## 1) Executive Summary

A modern, mobile‑first promo and light e‑commerce website for a custom **chopper‑style bike** workshop. Built as a fast static site on **Cloudflare Pages** (free), with **Stripe Checkout / Payment Links** for payments (PLN, **BLIK**, **Przelewy24**), and a minimal serverless contact form via **Pages Functions** protected by **Cloudflare Turnstile**. Content is Markdown‑driven (Astro), with a clean design system to emphasize craft, performance, and visual storytelling.

**Primary goals**

- Generate qualified leads (contact form + booking/consultation payments).
- Showcase builds (gallery, case studies) and brand credibility (testimonials, blog).
- Enable simple sales (deposit/consultation/merch) using Stripe-hosted checkout.

**Success metrics (first 90 days)**

- ≥ 2.5% visitor → lead (form submitted or consultation paid).
- ≥ 1% visitor → purchase/deposit.
- Core Web Vitals: LCP < 2.5s (mobile), CLS < 0.1, INP < 200ms.
- Lighthouse ≥ 90 (mobile) on key pages.

---

## 2) Scope, Constraints & Assumptions

**In scope**

- Marketing site (home, builds, gallery, shop, blog, about, contact, legal).
- Payments via Stripe **Payment Links** (BLIK/P24 enabled).
- Contact form → email (via Resend/Mailgun/SendGrid) with Turnstile protection.
- Cloudflare Web Analytics.
- Basic SEO (sitemap, robots, JSON‑LD) + OG cards.

**Out of scope (initial)**

- Full custom cart/checkout (use Stripe hosted pages).
- Inventory & advanced shipping rules.
- CRM integration (can export leads to CSV or Google Sheet).
- Multi‑language (PL primary; EN post‑launch).

**Constraints & assumptions**

- Budget capped at ≈ \$10–\$15 for domain; optional email service free tier.
- Media assets provided by workshop (photos/logos).
- Site must perform well on 3G/4G mobile.

---

## 3) Audiences & Brand Voice

**Primary audience**: Polish custom motorcycle enthusiasts seeking premium, handcrafted choppers; ages 25–55.
**Secondary**: Merch buyers and partners.

**Brand voice**: Confident, authentic, hands‑on craftsmanship. Short sentences, no fluff. Polish as primary language.

**Key messages**

- Hand‑built in Poland.
- Premium materials, obsessive details.
- Transparent process from concept to handover.
- Real riders, real warranty, real support.

---

## 4) Information Architecture & Sitemap

- **/** Home
- **/custom-builds** — the process, options, pricing/deposit CTAs
- **/gallery** — filterable photo grid (tags: frames, paint, details, before/after)
- **/shop** — simple merch or fixed items via Stripe links
- **/blog** — stories, behind‑the‑scenes, events (Markdown)
- **/about** — workshop, team, philosophy
- **/contact** — form + city/region; map optional
- **/legal/privacy**, **/legal/terms**, **/legal/returns**, **/legal/cookies**

---

## 5) Content Model (Markdown + front‑matter)

**Post (blog)**

```yaml
---
title: 'Tytuł wpisu'
date: 2025-08-27
tags: ['malowanie', 'rama']
coverImage: '/images/blog/slug/cover.webp'
excerpt: 'Krótki opis wpisu'
author: 'Imię'
---
```

**Build (case/portfolio)**

```yaml
---
name: 'Nazwa roweru'
year: 2025
specs:
  - 'Silnik: ...'
  - 'Rama: ...'
photos:
  - '/images/builds/slug/1.webp'
  - '/images/builds/slug/2.webp'
clientTestimonial: 'Krótka opinia klienta (opcjonalnie)'
---
Opis realizacji...
```

**Product (simple fixed items / deposits)**

```yaml
---
name: 'Zadatek'
pricePLN: 1000
stripeLink: 'https://buy.stripe.com/...'
photo: '/images/products/deposit.webp'
---
Opis produktu lub warunków.
```

---

## 6) Design System

**Visual direction**: industrial + premium craft (dark UI with warm accent)

**Palette**

- Primary (Charcoal): `#121316`
- Secondary (Steel): `#2A2E35`
- Accent (Burnt orange): `#D35400`
- Surface (Off‑white): `#F5F6F7`
- Success: `#1B8F5A` — Warning: `#B58100` — Danger: `#B03A2E`

**Typography**

- Headlines: **Anton**/**Oswald** (bold, condensed)
- Body & UI: **Inter** (400/500/700)
- Scale: 12‑column grid; base 4/8 spacing.

**Components**

- Buttons: primary (accent bg, white text), secondary (outline), ghost (text).
- Cards: image top, title, spec chips, CTA.
- Badges: specs/tags.
- Navigation: sticky header, clear CTAs ("Złóż zapytanie", "Galeria").
- Sections: Hero, USP strip (3–4 icons), Process steps (1–5), Testimonials, CTA band, Footer.

**Imagery guidelines**

- Use WebP/AVIF; 1600px max width for hero; compress ≤ 200KB if possible.
- Close‑ups: welds, leather, chrome; cinematic workshop shots.
- Consistent color grading; dark backgrounds preferred.

---

## 7) Page‑by‑Page Specifications

### Home (/)

**Purpose**: Immediate impact; route to contact/builds.
**Sections**: Hero (photo/video), USP strip, Featured Build, Process (5 steps), Testimonials, CTA band, Instagram/socials (optional).
**Primary CTA**: "Rozpocznij projekt" (link to contact or deposit Payment Link).
**SEO**: Title ≤ 60 chars; meta description ≤ 155; OG image 1200×630.

### Custom Builds (/custom-builds)

**Purpose**: Explain cooperation model and value.
**Sections**: Process, options/packages, timeline, deposit info, FAQ, CTA with **Stripe Payment Link** to deposit/consultation.
**Legal note**: Clarify nature of deposit for custom work.

### Gallery (/gallery)

**Purpose**: Visual proof.
**Features**: Masonry grid, filters by tag, lightbox.
**Data**: From `content/builds/` and `public/images/...`.

### Shop (/shop)

**Purpose**: Simple sales (merch, deposits).
**Items**: Cards with name/price and **Stripe link** buttons.
**Shipping**: Flat PLN rate configured in Stripe.

### Blog (/blog, /blog/\[slug])

**Purpose**: Authority & SEO.
**Features**: Index with cards; post with cover, ToC, reading time, share links.

### About (/about)

**Purpose**: Trust.
**Content**: Workshop story, team, warranty, delivery, photos.

### Contact (/contact)

**Purpose**: Lead conversion.
**Form fields**: Imię i nazwisko, e‑mail, telefon, wiadomość, zgoda RODO.
**Validation**: Required fields, phone pattern, Turnstile anti‑spam.
**UX**: Success page/message; error states; privacy link.

### Legal (/legal/\*)

Privacy (RODO), Terms, Returns, Cookies. Template provided below.

---

## 8) E‑commerce Integration (Stripe Payment Links)

**Payment methods**: Enable **BLIK** and **Przelewy24 (P24)** in Stripe.
**Currency**: PLN.
**Products to create** (initial):

- **Konsultacja** — 100–300 zł (30–60 min call/visit).
- **Zadatek** — 1000–2000 zł (custom build queue).
- **Koszulka / merch** — 79–149 zł (optional).

**Buttons** (example):

```html
<a href="https://buy.stripe.com/EXAMPLE" class="btn btn-primary">Zapłać zadatek</a>
```

**Shipping**: Flat rate Poland (e.g., 15–20 zł) configured in Stripe (merch only).
**Refunds**: Define policy (e.g., consultation refundable 24h prior; deposit terms for custom builds).
**Invoices**: Stripe invoicing optional; VAT data if applicable.

---

## 9) Forms & Lead Management

**Stack**: Cloudflare Pages Functions (TypeScript) + Turnstile.
**Flow**: Client POST → Function validates + verifies Turnstile → sends email via Resend/Mailgun/SendGrid → returns success JSON.

**Data retention**: Do not store PII server‑side beyond email delivery logs; optional backup to a Google Sheet/Discord webhook.
**Consent**: Checkbox referencing Privacy Policy; purpose: contact regarding build/offer.

---

## 10) SEO, Social & Schema

- Meta titles/descriptions per page; canonical URLs.
- **JSON‑LD**: Organization, LocalBusiness (city/region), and Article for blog posts.
- OpenGraph/Twitter: site-wide defaults + per‑page overrides.
- Sitemap.xml + robots.txt; internal linking from posts to builds and contact.

**JSON‑LD examples**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Nazwa warsztatu]",
  "address": { "@type": "PostalAddress", "addressLocality": "[Miasto]", "addressCountry": "PL" },
  "url": "https://twojadomena.pl",
  "telephone": "+48 [telefon]",
  "areaServed": "Poland"
}
```

---

## 11) Accessibility (WCAG 2.2 AA)

- Color contrast AA; no text in images for key info.
- Keyboard navigable menus; visible focus states.
- Alt text on all non‑decorative images.
- Form labels + error messages announced to screen readers.
- Motion reduced for prefers‑reduced‑motion.

---

## 12) Performance Budget & Image Strategy

**Budgets (mobile 4G):**

- HTML ≤ 30KB; CSS ≤ 40KB (Tailwind purged); JS ≤ 80KB (islands only).
- Hero image ≤ 200KB; other images ≤ 150KB each where possible.

**Strategy**

- Use WebP/AVIF with JPEG fallback; responsive `srcset` (480/768/1024/1600).
- Lazy‑load non‑hero images; preload hero & critical fonts.
- Cloudflare CDN caching; immutable asset hashes.

---

## 13) Security & Compliance

- HTTPS only; HSTS on (Cloudflare).
- Turnstile on public forms.
- Minimal JS; no third‑party trackers beyond analytics.
- Cookie banner only if non‑essential cookies exist.
- Privacy Policy (RODO): data controller, purpose, basis, retention, rights, contact.
- Terms/Returns: distance selling rules; deposit conditions for custom builds.

---

## 14) Tech Stack & Repo Structure

**Framework**: Astro + Tailwind CSS.
**Hosting**: Cloudflare Pages (free).
**Serverless**: Pages Functions for forms.
**Analytics**: Cloudflare Web Analytics.

**Repo layout**

```
/src
  /components        # Header, Footer, Hero, Cards, Gallery, Form, etc.
  /layouts           # BaseLayout.astro, PostLayout.astro
  /pages             # index.astro, custom-builds.astro, gallery.astro, shop.astro, blog/, about.astro, contact.astro, legal/
  /content           # posts/, builds/, products/
  /styles            # tailwind.css, tokens.css
  /lib               # seo.ts, helpers
/public              # static assets (favicon, robots.txt, og-images)
/functions           # contact.ts (form handler)
```

---

## 15) Environments, CI/CD & DNS

- **GitHub → Cloudflare Pages**: main = production; PRs = preview builds.
- Build command: `astro build`; Output dir: `dist`.
- **DNS/Domain**: Register/transfer to Cloudflare Registrar; set `A`/CNAME via Pages wizard; HTTPS auto‑provisioned.

**CI checks**

- Lint/format; type check; build; link checker (optional); Lighthouse CI (optional).

---

## 16) Day‑by‑Day Plan (10 days)

**Day 1 — Setup**: Domain + Pages project + Astro/Tailwind scaffold; header/footer shell.
**Day 2 — Design System**: tokens, typography, buttons, cards, grid.
**Day 3 — Home**: hero, USP, featured build, process, CTA, testimonials.
**Day 4 — Gallery**: masonry grid, filters; image pipeline.
**Day 5 — Payments**: Stripe account (PLN), enable BLIK/P24, create Payment Links; wire buttons.
**Day 6 — Blog**: index + post layout; 2 seed posts.
**Day 7 — Contact**: form + Turnstile + Pages Function + email delivery.
**Day 8 — SEO & Legal**: JSON‑LD, OG, sitemap; privacy/terms/returns/cookies.
**Day 9 — QA & Perf**: responsive polish; Lighthouse; copy editing.
**Day 10 — Launch**: connect domain → prod; switch Stripe to live; final tests.

---

## 17) Launch Checklist

- [ ] Stripe live mode; BLIK/P24 test on real purchase (small amount).
- [ ] All CTAs function; 404 page exists.
- [ ] Forms deliver email; spam blocked; success screen ok.
- [ ] Sitemap & robots deployed; OG images render in social share.
- [ ] Lighthouse ≥ 90 mobile on Home, Gallery, Custom‑Builds, Contact.
- [ ] Legal pages accessible from footer; company info present.
- [ ] Cloudflare Web Analytics receiving data.

---

## 18) Acceptance Criteria

- **Design**: Matches design system (color/typography spacing); consistent components across pages.
- **Content**: At least 1 featured build, 12+ gallery images, 2 blog posts, About, Legal.
- **Payments**: Visible Stripe buttons for consultation + deposit; shipping set for merch (if enabled).
- **Performance**: CWV thresholds met; images responsive; no layout shifts.
- **Accessibility**: Keyboard‑navigable menu, alt text, labeled form fields.
- **Security**: HTTPS, Turnstile, no PII stored server‑side.

---

## 19) Risks & Mitigations

- **Photo quality/quantity** insufficient → Mitigate: schedule a 2‑hour shoot; use staged workshop shots.
- **Payment onboarding delay** → Mitigate: set up Stripe on Day 1–2; prepare fallback (Payment Link for consultation only).
- **Legal copy delay** → Mitigate: use starter templates and adjust details with owner approval.
- **Time crunch** → Mitigate: prioritize Home, Custom‑Builds, Gallery, Contact; blog/shop can follow.

---

## 20) Post‑Launch (Weeks 1–4)

- Publish 2–3 blog posts/month (build diaries, paint options, delivery stories).
- Add EN language; add FAQ.
- Add simple estimator form (quote request → email).
- Submit to Google Business Profile; add site link and photos.

---

## 21) Templates & Snippets

**Hero copy (PL)**

> Nagłówek: _Ręcznie budowane choppery z Polski._
> Podtytuł: _Od projektu po ostatni nit — tworzymy rowery, które żyją na drodze._
> CTA1: **Rozpocznij projekt**
> CTA2: **Zobacz galerię**

**Process steps**

1. Konsultacja i inspiracje
2. Projekt i dobór części
3. Budowa ramy i podzespołów
4. Malowanie i wykończenia
5. Odbiór i gwarancja

**Contact form fields (PL)**

- Imię i nazwisko\*
- E‑mail\*
- Telefon
- Wiadomość\*
- [ ] Wyrażam zgodę na kontakt w sprawie oferty (zgodnie z Polityką Prywatności)

**Footer legal**

- © \[Rok] \[Nazwa warsztatu] — \[Miasto, PL]
- NIP: \[\_\_\_\_] (jeśli dotyczy)
- Linki: Prywatność · Regulamin · Zwroty · Cookies

---

## 22) Legal Starters (outline)

**Privacy (RODO)**: administrator, zakres danych (imię, e‑mail, tel.), cel (kontakt, realizacja zamówienia), podstawa prawna, odbiorcy (dostawca e‑mail/Stripe), okres przechowywania, prawa użytkownika, kontakt do administratora, pliki cookies.
**Terms**: opis usług, płatności (Stripe), zadatek i warunki, terminy realizacji, gwarancja, ograniczenie odpowiedzialności, kontakt, postanowienia końcowe.
**Returns**: zasady dla merch (14 dni); zasady dla usług niestandardowych (indywidualne, poza pełnym odstąpieniem — zgodnie z prawem).
**Cookies**: tylko niezbędne; jeżeli dodamy narzędzia marketingowe → baner zgody.

---

## 23) Future Enhancements

- EN localization, newsletter (Buttondown/Resend), FAQ schema.
- Before/after sliders; video build diaries.
- Quote configurator (options → estimated price range).
- Migration path to WooCommerce if full store becomes necessary.

---

**End of Brief**
