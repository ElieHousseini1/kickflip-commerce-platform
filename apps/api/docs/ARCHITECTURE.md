# Architecture and decisions

## Runtime view

The Next.js frontend in `apps/web` is a separate runtime consumer of this HTTP API. Public catalog reads can be server-rendered by Next.js; browser interactions use credentialed requests. Express owns authentication and authorization for every protected resource.

Within the API, dependency direction is inward:

```text
routes → controllers → services → repositories → models
                         ↓
                      policies
```

Transport concerns stop at controllers. Business workflows stay in services. Persistence details stay in repositories. That makes policy tests fast, HTTP integration tests realistic, and a future database change localized.

## Key decisions

### Cookie session instead of browser storage

The signed JWT is kept in an `HttpOnly` cookie, so application JavaScript cannot read it. `SameSite=Lax`, explicit origin validation, and restrictive credentialed CORS provide layered CSRF protection. The API—not the frontend proxy—remains the authorization boundary.

### Integer money

Prices and order totals are stored as cents. API serializers convert them to display-friendly decimal values. Checkout always recomputes totals from database records.

### Transactional checkout

Checkout reads the cart, conditionally decrements stock, writes the order and immutable line-item snapshots, then clears the cart in one transaction. Any failure rolls the entire workflow back.

### Versioned migrations

Schema changes are explicit, ordered, and recorded in `schema_migrations`. Runtime schema guessing (`sync({ alter: true })`) is intentionally avoided because it is difficult to review and unsafe for controlled deployments.

### Database-backed images

The `assets` table stores image bytes, MIME types, and content hashes. Product rows keep a small asset key, and the public asset endpoint streams the matching BLOB with ETag and cache headers. The seed imports all checked-in source images idempotently, keeping this assessment self-contained without a storage service.

### SQLite for the assessment

SQLite eliminates external infrastructure and supports real transactions, constraints, and integration tests. WAL mode improves local read/write behavior. A multi-instance deployment should use PostgreSQL and a shared rate-limit store; the service/repository boundaries make that evolution straightforward.

## Request lifecycle

1. Pino assigns a request ID and records structured request metadata.
2. Helmet, CORS, body-size limits, cookie parsing, and HPP normalize the boundary.
3. Origin guards and rate limits reject abusive requests early.
4. Zod parses input; downstream code receives normalized values.
5. Authentication resolves the cookie to a current database user.
6. A controller invokes one service use case.
7. Services enforce stock, pricing, and transaction rules.
8. Serializers expose an explicit response shape.
9. Central error handling maps known errors and hides unexpected internals.

## Growth path

- Add pagination and query filtering when the catalog grows.
- Replace SQLite with PostgreSQL before horizontal scaling.
- Add Redis-backed rate limiting for multiple API instances.
- Rotate signing keys and introduce refresh-token/session revocation if long-lived sessions become a requirement.
- Add idempotency keys to order creation before accepting real payments.
- Add an outbox and background worker for confirmation email or inventory integrations.
