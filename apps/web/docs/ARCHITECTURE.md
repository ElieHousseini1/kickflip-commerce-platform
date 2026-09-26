# Frontend architecture and decisions

## System boundary

```text
React client providers ──credentialed fetch──┐
                                             ├── Express API ── Sequelize ── SQLite
Next.js Server Components ──server fetch─────┘
```

Next.js owns presentation, routing, rendering, responsive behavior, and short-lived UI state. The `apps/api` service owns identity, validation, business rules, transactions, and persistence.

## Responsibilities

| Area                         | Responsibility                                            |
| ---------------------------- | --------------------------------------------------------- |
| `src/app`                    | Routing, page composition, metadata, and route boundaries |
| `src/components`             | Focused UI, interactions, and client state providers      |
| `src/services/*-service.js`  | Feature-specific browser operations for auth and commerce |
| `src/services/api-client.js` | Credentialed browser transport and structured API errors  |
| `src/services/server-api.js` | Server-only catalog/session calls with cookie forwarding  |
| `src/lib`                    | Pure presentation totals, errors, URLs, and formatting    |
| `src/styles`                 | Shared layout and control primitives                      |

The frontend intentionally has no API route handlers or persistence dependencies.

## Key decisions

### Server and browser API adapters

Server Components fetch catalog data without sending database logic to the client. Feature services perform browser mutations through one credentialed transport. These adapters preserve a small, explicit boundary rather than allowing fetch details throughout components and providers.

### Optimistic page gating

The Next.js proxy checks only whether a session cookie exists so navigation redirects remain fast. It does not treat that check as authorization. Every protected backend endpoint verifies the signature and resolves the current user independently.

### Provider-owned remote state

Cart, wishlist, and authentication are small application-wide domains. Focused providers make loading, mutation, and failure behavior available without adding a large state library. Components retain local state for transient interaction feedback.

### CSS Modules and feature components

Styles are locally scoped with shared design tokens and reusable primitives. Components are grouped by feature, keeping business journeys discoverable without creating wrappers that add no semantic value.

### Client totals are presentation only

The cart and checkout can display calculated totals immediately, but the backend recomputes authoritative prices and delivery costs during order creation. The client never sends or controls the order amount.

## Scaling path

- Introduce a query cache such as TanStack Query if server state becomes more complex or frequently invalidated.
- Generate TypeScript clients from the backend OpenAPI document when the API surface grows.
- Add localized strings and currency formatting before supporting multiple markets.
- Add route-level analytics and real-user performance monitoring for production optimization.
