# Form Commerce API

An interview-ready REST API for the storefront in `../web`. It is built with Express 5, TypeScript, Sequelize, and SQLite, with deliberately explicit application layers and production-minded defaults.

## Quick start

Use an active LTS release of Node.js (20.19+, 22.13+, or 24+).

```bash
npm install
cp .env.example .env
npm run dev
```

The API starts on `http://localhost:4000`. On first startup it applies versioned migrations and idempotently seeds the 15-product catalog. User accounts are created only through registration.

Images are stored as BLOBs in SQLite. The idempotent seed imports the checked-in source files under `assets/`, and the API serves them through `GET /api/assets/:key` with MIME types, ETags, and cache headers. The frontend therefore needs no public asset host.

Useful endpoints:

- Health: `GET http://localhost:4000/health`
- Interactive OpenAPI docs: `http://localhost:4000/docs`
- OpenAPI JSON: `http://localhost:4000/openapi.json`
- Database asset: `GET http://localhost:4000/api/assets/images/skate-hero.jpg`

Run the storefront from the other application directory in this monorepo:

```bash
cd ../web
cp .env.example .env.local
npm install
npm run dev
```

## Architecture

```text
HTTP request
    │
    ▼
middleware ── authentication, origin checks, rate limits, validation
    │
    ▼
routes → controllers → services → repositories → Sequelize → SQLite
                         │
                         └── policies (pricing and stock rules)
```

- **Routes** declare URLs and middleware.
- **Controllers** translate HTTP requests and responses.
- **Services** own use cases, transactions, and business decisions.
- **Repositories** isolate persistence queries.
- **Models and migrations** describe storage without leaking it into the UI.
- **Contracts** validate untrusted input at the boundary with Zod.
- **Serializers** explicitly shape public responses and prevent accidental field exposure.

This is intentionally a modular monolith: it is easier to understand and deploy than microservices for this scope, while maintaining boundaries that can be extracted later. See [Architecture](docs/ARCHITECTURE.md) for the decisions and trade-offs.

## API surface

| Method                  | Endpoint              | Authentication | Purpose                        |
| ----------------------- | --------------------- | -------------- | ------------------------------ |
| `POST`                  | `/api/auth/register`  | Public         | Register and start a session   |
| `POST`                  | `/api/auth/login`     | Public         | Log in                         |
| `GET`                   | `/api/auth/session`   | Optional       | Resolve the current user       |
| `POST`                  | `/api/auth/logout`    | Public         | Clear the session              |
| `GET`                   | `/api/products`       | Public         | List all products and variants |
| `GET`                   | `/api/products/:slug` | Public         | Get product detail             |
| `GET`                   | `/api/assets/:key`    | Public         | Stream a database-backed image |
| `GET/POST/PATCH/DELETE` | `/api/cart`           | Required       | Manage the current cart        |
| `GET/POST/DELETE`       | `/api/wishlist`       | Required       | Manage the wishlist            |
| `POST`                  | `/api/orders`         | Required       | Atomically place an order      |

The exact schemas and example responses live in Swagger at `/docs`.

## Security choices

- Passwords are hashed with bcrypt at cost 12 and never serialized.
- Sessions use signed, expiring JWTs in `HttpOnly`, `SameSite=Lax` cookies. SQLite stores a hash of each active token. Logout removes the current token's record, so a copied cookie cannot be reused; other sessions remain active. Tokens issued before this migration must log in again.
- Mutating browser requests are checked against an explicit origin allowlist.
- CORS allows credentials only for configured frontend origins.
- Authentication endpoints and the wider API have separate rate limits.
- Helmet headers, request-size limits, HTTP parameter pollution protection, strict Zod schemas, and generic production errors reduce common attack surface.
- Checkout calculates prices on the server and reserves stock inside one database transaction; client totals are never trusted.
- Logs redact cookies, authorization headers, passwords, and tokens.
- Secrets and environment-specific database paths stay outside source control.

Read [SECURITY.md](SECURITY.md) for deployment expectations and known scope boundaries.

## Database lifecycle

The server runs numbered, one-way migrations tracked in `schema_migrations`; it does not use Sequelize `sync({ alter: true })`. Catalog seeding is idempotent. Monetary values are stored as integer cents to avoid floating-point persistence errors.

```bash
npm run db:migrate
npm run db:seed
```

SQLite is a strong fit for a single-instance assessment and makes setup reproducible. For horizontal production scaling, keep the repository/service layers and move Sequelize to PostgreSQL, then add a shared rate-limit/session strategy.

## Quality commands

```bash
npm run check          # formatting, lint, types, tests, production build
npm test               # unit and HTTP integration tests
npm run test:coverage
npm audit --omit=dev   # production dependency audit
```

The integration suite exercises registration, session cookies, product listing, wishlist changes, cart mutations, variant changes, checkout, cart clearing, validation, and cross-origin rejection. CI runs the same `check` command on every push and pull request.

## Interview walkthrough

Start with `src/app.ts`, then follow one use case from route to controller, service, repository, and model. Checkout is the richest example because it demonstrates server-owned totals, conditional stock reservation, an atomic transaction, immutable order snapshots, and cart clearing. A focused discussion guide is available in [docs/INTERVIEW_GUIDE.md](docs/INTERVIEW_GUIDE.md).
