# Form mini-commerce

A polished, responsive Next.js storefront backed by a separate TypeScript/Express API. It demonstrates the complete authenticated journey from product discovery through cart, wishlist, checkout, and order confirmation.

## Assessment coverage

| Requirement         | Implementation                                                                     |
| ------------------- | ---------------------------------------------------------------------------------- |
| Authentication      | Registration, login, logout, HttpOnly sessions, and protected pages                |
| Product listing     | All 15 products, prices, search, categories, sorting, and variant summaries        |
| Product detail      | Description, stock, variant selection, cart, and wishlist actions                  |
| Cart                | Persistent lines, quantity changes, subtotals, total, removal, and variant changes |
| Wishlist            | Persistent dedicated list with add/remove behavior                                 |
| Checkout            | Delivery form, order review, transactional stock reservation, and confirmation     |
| Responsive design   | Desktop, tablet, mobile navigation and layouts with automated overflow coverage    |
| Engineering quality | CSS Modules, isolated components, loading/error states, CI, unit and E2E tests     |

## Application boundary

The application now has a deliberate frontend/backend boundary:

- `apps/web` — this Next.js and React storefront
- `apps/api` — the Express 5, TypeScript, Sequelize, and SQLite API

The frontend contains no database driver, password hashing, JWT signing, Sequelize model, or API route handler. Browser requests and React Server Components both consume the standalone API.

## Quick start

Use an active Node.js LTS release. From the monorepo root, start the API first:

```bash
cd apps/api
npm install
cp .env.example .env
npm run dev
```

In a second terminal from the monorepo root, start the storefront:

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register an account from
the login screen.

## Frontend architecture

```text
src/
├── app/                 Pages, metadata, loading and error boundaries
├── components/
│   ├── auth/            Login and registration workflow
│   ├── cart/            Cart lines, quantity, variant and summary UI
│   ├── checkout/        Delivery form and review UI
│   ├── layout/          Shell and responsive navigation
│   ├── product/         Catalog, cards, detail and purchase actions
│   ├── providers/       Auth, cart and wishlist client state
│   └── ui/              Reusable feedback and image primitives
├── lib/                 Pure formatting and display-total helpers
├── services/            Feature services plus browser/server API adapters
└── styles/              Shared CSS Module primitives
```

Server-rendered pages use `src/services/server-api.js`. Interactive features use focused auth, cart, wishlist, and order services over the credentialed browser client. The Next.js proxy provides fast, optimistic navigation redirects, while the Express API independently authenticates every protected resource.

See [Architecture and engineering decisions](docs/ARCHITECTURE.md) for component ownership and trade-offs. Backend architecture, security decisions, Swagger documentation, and an interview walkthrough live in `apps/api`. The [repository strategy](../../docs/ARCHITECTURE.md) explains why both applications share one Git history.

## Pages

- `/login`
- `/signup`
- `/products` and `/products/[slug]`
- `/cart`
- `/wishlist`
- `/checkout` and its in-flow order confirmation

## Configuration

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SESSION_COOKIE_NAME=form_session
BACKEND_API_URL=http://127.0.0.1:4000/api
```

`NEXT_PUBLIC_API_URL` and the cookie name are embedded at build time. The cookie name must match the backend's `COOKIE_NAME`. `BACKEND_API_URL` is server-only and may point to an internal service address in deployment. Images are loaded from the API's database-backed asset endpoint.

## Quality evidence

```bash
npm run check      # format check, ESLint, Vitest, production build
npm run test:e2e   # starts both applications and runs the real Chromium journey
```

The E2E suite uses an isolated SQLite database and covers registration, catalog rendering, product detail, cart, checkout, confirmation, and a 390px horizontal-overflow check. GitHub Actions runs quality and browser suites.

## Known scope boundaries

- Checkout uses mocked pay-on-delivery rather than a payment provider.
- No transactional email or fulfillment integration is connected.
- Catalog administration and order history are outside this storefront assessment.
- SQLite is intended for a single API instance; the backend documents the PostgreSQL scaling path.

See the [deployment guide](docs/DEPLOYMENT.md) and [contribution guide](../../CONTRIBUTING.md) for operational and review expectations.
