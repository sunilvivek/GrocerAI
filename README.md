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
- **Catalog** — 85 products across categories, curated images with accessible
  fallbacks, recipes with ingredients and notes
- **Search** — natural-language input, keyword + semantic hybrid ranking,
  filters (category, price, rating) and pagination
- **Cart** — persistent (cookie-backed) cart, quantity controls, merge on sign-in
- **Checkout** — order creation with Razorpay (INR/paise), order + payment status
- **Admin** — dashboard analytics, product/category/recipe CRUD with image audit
- **AI assistant** — `/api/ai/chat` chat endpoint for meal-to-cart help

## Project Structure

```text
prisma/                # schema, seed data (products, images, recipes), scripts
  scripts/             # make-admin, index-embeddings, test-* verification suites
src/
  app/                 # App Router: (auth), (marketing), (protected), admin, api
  components/          # shared + shadcn/ui components
  constants/           # app name, nav, currency config
  features/            # admin, auth, cart, checkout, landing, profile, search, settings
  lib/                 # ai, auth, cart, prisma, search (embedding providers)
  utils/               # format.ts — INR formatters + rupees↔paise
  middleware.ts        # custom middleware
```

## Tests

Verification suites live in `prisma/scripts/` and are run with `pnpm test:*`.
They validate embedding indexing, hybrid search ranking, INR currency
formatting, Razorpay paise handling, and product image consistency against the
seed data.