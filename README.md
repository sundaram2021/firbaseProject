# Modern Fire Safety Solution

A modern, fully responsive marketing website for **Modern Fire Safety Solution** — an
authorised fire-safety dealer — with authentication built in.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**,
**Better Auth** (Google + email/password), **Drizzle ORM**, and **Supabase Postgres**.

> Inspired by the client's reference design and rebuilt from the ground up:
> refined typography, a cohesive crimson/charcoal system, scroll-reveal motion,
> accessible components, real authentication, and a working enquiry form that
> persists to the database.

---

## ✨ Features

- **11-section landing page** — hero, about, services, why-choose-us, training,
  products, "how we help", quote form, CTA banner, contact (with live map + WhatsApp),
  and footer.
- **Authentication** with [Better Auth](https://better-auth.com):
  - Google OAuth (social sign-in)
  - Email + password (sign up / log in)
  - Session-aware navbar and a protected `/account` page.
- **Enquiry form** → server action → **Drizzle** insert into **Supabase Postgres**.
- **Fully responsive**, keyboard-accessible, with `prefers-reduced-motion` support.

## 🧱 Tech stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19 + TS  |
| Styling        | Tailwind CSS v4 (CSS-first config)       |
| Auth           | Better Auth (`better-auth/adapters/drizzle`) |
| ORM            | Drizzle ORM (`postgres` / postgres.js)   |
| Database       | Supabase Postgres                        |

---

## 🚀 Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable                | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL`   | Public base URL (e.g. `http://localhost:3000`).                    |
| `BETTER_AUTH_SECRET`    | 32+ char secret. Generate with `openssl rand -base64 32`.          |
| `BETTER_AUTH_URL`       | Base URL of the app (same as above in dev).                        |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID.                                            |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret.                                        |
| `DATABASE_URL`          | Supabase Postgres connection string.                               |

**Google OAuth** — in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
create an OAuth 2.0 Client (Web application) and add this authorized redirect URI:

```
http://localhost:3000/api/auth/callback/google
https://YOUR_DOMAIN/api/auth/callback/google   # production
```

**Supabase** — from *Project Settings → Database → Connection string*, use the
**Transaction pooler** URI (port `6543`) for `DATABASE_URL` (the app runtime uses
`prepare: false` for pooler compatibility). For migrations you may swap in the
**Direct connection** (port `5432`).

### 3. Create the database tables

The Drizzle schema already includes the Better Auth tables (`db/auth-schema.ts`) and
the app's `enquiries` table (`db/schema.ts`). Push it to Supabase:

```bash
pnpm db:push
# or, for a reviewable migration history:
pnpm db:generate && pnpm db:migrate
```

> To regenerate the Better Auth schema after adding plugins: `pnpm auth:generate`.

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Script             | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `pnpm dev`         | Start the dev server                          |
| `pnpm build`       | Production build                              |
| `pnpm start`       | Run the production build                      |
| `pnpm lint`        | ESLint                                        |
| `pnpm db:push`     | Push the Drizzle schema to the database       |
| `pnpm db:generate` | Generate a SQL migration                      |
| `pnpm db:migrate`  | Apply migrations                              |
| `pnpm db:studio`   | Open Drizzle Studio                           |
| `pnpm assets`      | Download site imagery into `/public/images`   |

---

## 🗂️ Project structure

```
app/
  api/auth/[...all]/route.ts   Better Auth handler
  actions/enquiry.ts           Server action: save enquiries
  account/page.tsx             Protected page (server session check)
  login/ · signup/             Auth pages
  page.tsx                     Landing page (composes all sections)
  layout.tsx · globals.css     Fonts, metadata, design system
components/
  site/                        Landing-page sections
  auth/                        Auth form + sign-out
  ui/                          Button, Logo, Icons
db/
  index.ts                     Drizzle client (postgres.js)
  auth-schema.ts               Better Auth tables
  schema.ts                    App tables (enquiries)
lib/
  auth.ts · auth-client.ts     Better Auth server + client
  site.ts                      All site content, links & image URLs
drizzle.config.ts
```

---

## 🖼️ Imagery

Site images are hosted on a CDN and referenced from `lib/site.ts` so the site renders
out of the box. To **self-host** them instead:

```bash
pnpm assets           # downloads them into /public/images
```

Then point `IMAGES.*` in `lib/site.ts` at local paths (e.g. `/images/hero.jpg`).

---

## 🔒 Security & production hardening

- **Rate limiting**
  - Auth: Better Auth rate limiting with **database storage** (holds across serverless
    instances). Stricter caps on `/sign-in/email`, `/sign-up/email`, `/forget-password`.
  - Enquiry form: per-email (3 / hour) and per-IP (8 / 10 min), keyed on a SHA-256 hash
    of the IP (`enquiries.ip_hash`) — no raw IPs stored.
  - Checkout: per-user throttle on Stripe session creation.
- **Email hardening** (`lib/email.ts`) — addresses are normalised (trim + lowercase),
  format-validated, and disposable/temporary domains are rejected. Enforced on sign-up
  (`databaseHooks.user.create.before`, covering Google + email) and on the enquiry form.
- **Spam protection** (enquiry form) — hidden honeypot field, a minimum time-to-submit
  check, and a link-stuffing heuristic. Bot submissions get a generic success response
  so they learn nothing.
- **HTTP security headers** (`next.config.ts`) — `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS; `poweredByHeader` off.
- **CSRF** — Better Auth `trustedOrigins` derived from `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL`.
- **SEO** — `app/robots.ts` and `app/sitemap.ts` (excludes `/account` and `/api`).

> **Migration required:** these changes add the Better Auth `rateLimit` table and the
> `enquiries.ip_hash` column. Run `pnpm db:push` (or `db:generate` + `db:migrate`) when
> deploying.

---

## 🚢 Deployment

Deploy to Vercel (or any Node host). Set all environment variables from the table
above, and update `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` plus the Google redirect
URI to your production domain. Then run `pnpm db:push` against the production database.
