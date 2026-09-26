# Kickflip Supply

A responsive Next.js skate shop backed by an Express/TypeScript API. The storefront and API live in one Git repository but retain separate packages, lockfiles, environment configuration, tests, and deployment targets.

## Repository layout

```text
apps/
  web/       Next.js storefront, UI tests, and Playwright journeys
  api/       Express API, validation, database migrations, and integration tests
docs/        Cross-application architecture and version-control strategy
.github/     One CI pipeline for both applications
```

## Run locally

Use Node.js 22.23+ for both applications and their test tools. Install each application from its own lockfile:

```bash
npm ci --prefix apps/api
npm ci --prefix apps/web
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Start the API and web app in separate terminals:

```bash
npm run dev:api
npm run dev:web
```

Visit http://localhost:3000. The API runs at http://localhost:4000; its OpenAPI documentation is at http://localhost:4000/docs. The API seeds its 15-product catalog on first startup.

## Verify

```bash
npm run check       # API and web formatting, linting, tests, and builds
npm run test:e2e    # Full Chromium journey; starts both applications
```

CI runs the API and web checks independently, then runs the cross-application browser journey. A change to either application is reviewed in one pull request, while each service can still deploy independently.

## Assessment scope

The application covers registration, login, product discovery, search and sorting, variants, cart, wishlist, shipping or pickup checkout, server-calculated totals, stock reservation, and order confirmation. Checkout uses pay-on-delivery; no payment provider or transactional email is connected. SQLite is appropriate for this single-instance assessment and would need replacement before horizontal production scaling.

See [the architecture and Git strategy](docs/ARCHITECTURE.md), [web documentation](apps/web/README.md), [API documentation](apps/api/README.md), and [deployment guide](apps/web/docs/DEPLOYMENT.md).
