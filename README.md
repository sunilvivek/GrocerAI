# SmartCart AI — GrocerAI

**SmartCart AI** is a full-stack AI grocery assistant. Describe a meal in plain
English ("butter for baking") and it uses hybrid search — keyword + semantic
embeddings — to find matching products, builds a cart, and lets you check out
with Razorpay.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix UI, CVA, tw-animate-css)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Better Auth (email/password + Google OAuth, RBAC for admins)
- **AI:** Vercel AI SDK + OpenAI (assistant chat, `text-embedding-3-small`)
- **Search:** Hybrid — keyword search + local on-device embeddings
  (`@huggingface/transformers`) or OpenAI embeddings, hybrid relevance ranking
- **Payments:** Razorpay (amounts handled as paise)
- **Currency:** INR (`en-IN`) via a shared formatter
- **Fonts:** Geist (Sans + Mono) via `next/font/google`

## Build Progress

Current state: **Milestone 8 of 10 — live app core complete.** 37 commits,
clean working tree, pushed to `origin/main`.

| # | Milestone | Status | Notes |
| - | --------- | ------ | ----- |
| 1 | Scaffold (Next 15, TS, Tailwind v4) | ✅ | `create-next-app`, lint + typecheck setup |
| 2 | Database schema | ✅ | 15 Prisma models, 12 migrations |
| 3 | Auth | ✅ | Better Auth, email/Google, RBAC, profile/settings |
| 4 | AI assistant backend | ✅ | `/api/ai/chat` streaming endpoint |
| 5 | Cart + checkout | ✅ | Persistent cart, merge on sign-in, Razorpay (paise) |
| 6 | Admin | ✅ | Analytics dashboard, product/category/recipe CRUD |
| 7 | Search | ✅ | Hybrid keyword + semantic embeddings, filters, pagination |
| 8 | Currency + content | ✅ | INR migration, curated images, public recipes + assistant UI |
| 9 | Product detail pages | ⏳ | Product cards already link to `/products/[slug]` |
| 10 | Marketing extras | ⏳ | `/about`, `/categories`, footer/legal pages still 404 |

### Public surface today

- **Marketing:** `/`, `/products`, `/recipes`, `/recipes/[slug]`, `/assistant`,
  `/cart`, `/checkout`
- **Auth:** `/sign-in`, `/sign-up`, `/forgot-password`
- **Account:** `/profile`, `/settings`
- **Admin:** `/admin` (analytics + product/category/recipe management)

### Known gaps

- `/products/[slug]` is linked from product cards but not implemented
- `/about`, `/categories` (nav) and footer links (`/help`, `/privacy`,
  `/terms`, etc.) return 404
- No custom `not-found.tsx` — dead links show the default Next.js 404
- AI assistant requires a funded `OPENAI_API_KEY` to reply

## Getting Started

```bash
pnpm install
cp .env.example .env.local   # fill in values (see below)
pnpm db:seed                 # load grocery catalog + recipes
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [`.env.example`](.env.example) for the full list. Notable ones:

| Variable                     | Purpose                                          |
| ---------------------------- | ------------------------------------------------ |
| `DATABASE_URL`               | PostgreSQL connection string                     |
| `BETTER_AUTH_SECRET`         | Session cookie signing secret                    |
| `BETTER_AUTH_URL`            | Auth base URL                                    |
| `GOOGLE_CLIENT_ID/SECRET`    | Google OAuth (optional)                          |
| `OPENAI_API_KEY`             | API key for assistant + embedding (optional)     |
| `OPENAI_MODEL`               | Assistant model (default `gpt-4o-mini`)          |
| `OPENAI_EMBEDDING_MODEL`     | Embedding model (default `text-embedding-3-small`) |
| `EMBEDDING_PROVIDER`         | `local` (default, free) or `openai`              |

## Scripts

```bash
pnpm dev              # dev server
pnpm build            # production build
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm check            # lint + typecheck

pnpm db:seed          # seed catalog
pnpm db:studio        # Prisma Studio
pnpm db:admin         # promote a user to admin
pnpm db:index         # build search embeddings for all products

pnpm test:all         # run all verification suites (search/indexing/currency/payment/images)
```

## Features

- **Landing page** — hero, categories, how-it-works, features, testimonials, FAQ
- **Auth** — sign-up, sign-in, forgot-password, profile + settings, admin RBAC
- **Catalog** — 85 products across 8 categories, 21 recipes, 84 ingredients,
  curated images with accessible fallbacks
- **Search** — natural-language input, keyword + semantic hybrid ranking,
  filters (category, price, in-stock) and pagination
- **Recipes** — public listing with difficulty filter/sort/pagination and a
  detail page with instructions, ingredients, times, and calories
- **AI assistant** — `/assistant` chat UI streaming from `/api/ai/chat`
  (suggestion prompts, live status, retry/stop)
- **Cart** — persistent (cookie-backed) cart, quantity controls, merge on sign-in
- **Checkout** — order creation with Razorpay (INR/paise), order + payment status
- **Admin** — dashboard analytics, product/category/recipe CRUD with image audit

## Project Structure

```text
prisma/                # schema, seed data (products, images, recipes), scripts
  scripts/             # make-admin, index-embeddings, test-* verification suites
src/
  app/                 # App Router: (auth), (marketing), (protected), admin, api
  components/          # shared + shadcn/ui components
  constants/           # app name, nav, currency config
  features/            # admin, assistant, auth, cart, checkout, landing,
                       # profile, recipes, search, settings
  lib/                 # ai, auth, cart, prisma, search (embedding providers)
  utils/               # format.ts — INR formatters + rupees↔paise
  middleware.ts        # custom middleware
```

## Tests

Verification suites live in `prisma/scripts/` and are run with `pnpm test:*`.
They validate embedding indexing, hybrid search ranking, INR currency
formatting, Razorpay paise handling, and product image consistency against the
seed data.