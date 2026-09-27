# Working on the backend

This is the Node.js API for the Mini E-Commerce Platform assessment. It uses Express, TypeScript, Sequelize, and SQLite. Keep it small enough to understand, but reliable enough that a failed request cannot leave the shop in an inconsistent state.

## Start with the assessment

The reference is **Full Stack Engineer — Take-Home Assessment: Mini E-Commerce Platform**, supplied as `Full_Stack_Engineer_Assessment.pdf`. The section numbers below refer to that paper. These are requirements to preserve and check, not a claim that everything has already been tested.

Work on the requested phase from the project context file. Read the existing implementation before changing it, and explain any mismatch between the context file, the paper, and the code. Do not quietly expand the scope or redesign the application.

Section 2 asks for a Node.js backend and allows Express or an alternative. It also leaves storage open: in-memory data, JSON files, and databases are all acceptable. TypeScript, Sequelize, SQLite, and the layered structure are choices in this project, not mandatory technologies from the paper.

## What the API needs to support

### Authentication — section 3.1

The paper asks for a simple login flow and gated access. Follow the existing password hashing and cookie-based session flow. Never store plaintext passwords, return password hashes, or trust a user ID supplied by the browser as proof of identity.

Authenticate protected requests on the backend, even when the frontend already redirects unauthenticated users. Use the authenticated user from the request when reading or changing their cart, wishlist, or orders. Test with different accounts so that one user's data cannot appear in another user's session.

Handle invalid credentials and expired or missing sessions with clear, consistent responses. Keep unexpected failures separate from ordinary authentication failures. Do not add new account features just because they are common in larger stores; the assessment only requires simple login.

### Product listing and details — sections 3.2 and 3.3

The required catalog has 15 products, and at least three products must have more than one variant. Keep the seed data consistent with those requirements. The listing must supply titles, prices, and variants; the detail response also needs the full description and remaining stock.

Keep product identifiers, slugs, and variant relationships consistent across endpoints. A variant must belong to the selected product. Return an appropriate not-found response for a missing product instead of an empty success response or an unexplained server error.

The current model tracks stock per product, not separately per variant. Preserve that assumption unless a change is explicitly requested. Quantities across different variants of the same product still draw from the same stock.

### Cart — section 3.4

Support adding a product from its detail page, listing the current user's cart, updating quantities, removing items, and changing the selected variant. Adding from the listing page is optional UI behavior and should reuse the same API rules.

Changing a variant is a required feature, not an extra. Check that the replacement variant belongs to the product and handle an existing destination cart line consistently. Do not lose items or duplicate quantities when merging lines.

Validate quantities against the contract and check the total quantity of a product across the user's cart. Adding to the cart does not reserve inventory in the current design, so checkout must check stock again. Return data consistent with the existing cart response shape so the frontend can refresh its state reliably.

### Wishlist — section 3.5

Allow users to save products and retrieve their own wishlist as a separate list. Check that the product exists and keep repeated save requests from creating duplicate entries. Do not mix wishlist data between accounts.

Moving an item directly from the wishlist to the cart is a nice-to-have in the paper. If that flow is changed, use the existing cart validation rules rather than creating a second way to bypass product, variant, or stock checks.

### Checkout and confirmation — section 3.6

The required flow lets a user review their cart, place an order, receive confirmation, and see the cart cleared. A real payment integration is not required. The current implementation records an order with a pay-on-delivery payment method; do not describe this as a processed online payment.

Calculate prices and totals using database values and the shared commerce policy. Never accept a browser-supplied total as the amount to charge or record. Keep monetary calculations in integer cents and convert only at the API boundary where the existing contract expects it.

Keep stock updates, order creation, order-item snapshots, and cart clearing in one database transaction. Use the existing guarded stock update so stock cannot be decremented below zero. Apply the mandatory rollback policy below.

Preserve the order's product names, variant names, and prices as snapshots. An existing order should not change just because the catalog is edited later. Return enough information for the frontend to show a meaningful confirmation after success.

### Supporting the frontend — section 3.7

Responsive layouts are the frontend's responsibility, but every screen still needs reliable API behavior. Keep response shapes predictable, provide useful errors, and avoid returning unnecessary data. A passing API test does not prove that login, cart, or checkout works on mobile; those flows also need frontend checks.

## Mandatory rollback and commit policy

For a business operation with multiple dependent database writes, keep those writes in one transaction. Pass the same transaction to every participating repository call and await every write. In checkout, stock deductions, the order, order items, and cart clearing must either all commit or all roll back.

If a step fails before commit, let the error escape the managed transaction callback so Sequelize rolls back its writes. Never catch the error inside that callback and return an apparent success, continue after a failed write, or perform part of the operation outside the transaction. Do not send a success response until the transaction has committed.

A failed HTTP response is not proof of rollback. If the database commits and the connection drops before the client receives confirmation, the order remains committed. Do not delete that order, restore stock, or recreate the cart simply because delivery of the response failed. Cancellation after commit is a separate business operation, not transaction rollback.

Do not assume a timeout or retry means the original operation did not happen. Before adding automatic retries for order creation, require a server-enforced idempotency mechanism or a reliable way to reconcile the original operation's outcome. Do not claim those mechanisms exist unless they have been implemented and tested. Database rollback also cannot undo external side effects such as sending an email or charging a payment provider.

For changes affecting this boundary, tests must distinguish failure before commit from response loss after commit. Inject a failure after actual database writes and verify full rollback using fresh queries. Separately simulate a lost response after a successful commit and verify the committed order and stock remain intact. Report gaps in these tests rather than assuming an error status proves safety.

## Keep responsibilities clear

Follow the existing flow: routes connect middleware and controllers, controllers deal with HTTP, services coordinate business rules, and repositories handle database access. Models describe persistence, contracts validate inputs, serializers shape public responses, and policies hold reusable calculations.

Use the existing structure rather than introducing a second pattern for one endpoint. Keep business rules out of route handlers and avoid exposing raw Sequelize objects as public responses. Do not add layers that only forward arguments without making a responsibility clearer.

TypeScript helps during development, but it does not validate incoming requests. Use the Zod contracts and validation middleware for runtime checks. Keep accepted fields, boundaries, error responses, serializers, and `src/docs/openapi.ts` in agreement when an endpoint changes. Flag any frontend impact instead of silently breaking its contract.

## Database and image handling

Use migrations for schema changes. Do not edit an already-applied migration to change an existing database, rely on automatic schema alteration, or delete the database as a shortcut. Keep model definitions and migrations aligned, and explain how existing data is affected.

The current startup sequence configures the database, runs migrations, initializes models, and seeds data before the server starts listening. Seeding runs on each process startup. Keep repeat runs safe, and do not accidentally reset user data or remaining stock while updating the catalog.

Image bytes are stored in the SQLite assets table and served through `/api/assets/...`. Product records reference asset keys. The files under `apps/api/assets` are still needed by the seed process, even though normal image requests read the database. Do not remove those source files without first changing and verifying the initialization workflow.

Preserve content types, cache headers, and ETag behavior when changing asset responses. Do not reintroduce placeholder image domains, frontend product-image copies, or Cloudflare R2 without an explicit request. Database-backed images are a project choice, not a requirement from the assessment.

## Errors, configuration, and security

Use the existing `AppError` and central error handler for expected failures. Return helpful public messages and log unexpected failures without exposing stack traces, SQL details, passwords, session tokens, or secrets to clients.

Keep environment validation in the existing config module. Document new settings in `.env.example` with safe placeholders, not real credentials. Preserve the existing authentication, origin checks, rate limits, and request-size limits; do not disable them just to make development or tests easier. CORS is not a substitute for authorization.

Keep the root Prettier configuration and the backend's TypeScript-aware ESLint configuration. Do not duplicate shared configuration or change dependencies unless the task needs it.

## Non-negotiable quality rules

These are working rules for this project, not additional requirements quoted from the assessment. Apply them to the requested change; they do not authorize an unrelated rewrite.

- Good: enforce identity and ownership on every protected operation. Bad: trust a user ID from the request body, rely on the frontend to block access, or query another user's records without ownership checks.
- Good: validate external input and calculate amounts from trusted database values. Bad: trust client totals, allow a variant from a different product, or assume TypeScript validates JSON at runtime.
- Good: keep stock, order writes, and cart clearing atomic. Bad: clear the cart before success, commit a partial order, or deduct stock without a guarded update. Do not weaken these guarantees to simplify code.
- Good: use integer cents and shared commerce rules. Bad: duplicate pricing rules in controllers or use floating-point arithmetic for persisted monetary calculations.
- Good: use explicit migrations and repeatable seeds that preserve user data. Bad: drop tables, reset a working database, rewrite applied migrations, or overwrite stock as a shortcut.
- Good: return a meaningful error with the proper status and log unexpected failures safely. Bad: return HTTP 200 for a failed operation, swallow an exception, or expose credentials, tokens, SQL details, or stack traces.
- Good: preserve clear layer boundaries and parameterized database access. Bad: interpolate untrusted values into SQL, scatter database queries across routes, or copy business rules into multiple endpoints.
- Good: fix the cause of compiler, lint, or test failures. Bad: add `any`, unchecked casts, suppression comments, relaxed validation, or disabled checks merely to silence them. Any necessary exception must be narrow, justified, and reported.

## Tests are part of the change

A behavior change is not complete without automated tests covering it. A bug fix needs a regression test that fails for the original bug and passes with the fix. If reproducing the original failure is unsafe or impractical, explain the limitation and what the new test actually proves.

Use Vitest for contracts and pure policies, and Supertest with the real application and an isolated SQLite database for endpoint behavior. Do not mock authentication, repositories, or transactions in a test claiming to verify ownership or persistence. Narrow failure injection is appropriate for rollback tests, but the transaction and database writes being checked must remain real.

For the affected behavior, cover the relevant cases below. Mark a case as not applicable with a reason instead of silently omitting it:

- Contracts: valid input, missing required fields, wrong types, and values just below, at, and just above defined limits. Derive expected outcomes from the contract, not the observed output of broken code.
- Authentication and ownership: missing, invalid, and expired sessions; valid access; and two users whose carts, wishlists, and orders remain isolated.
- Catalog and cart: missing products, mismatched variants, quantity limits, stock shared across variants, variant changes into an existing cart line, and removal behavior.
- Wishlist: valid saves, duplicate saves, missing products, and per-user retrieval.
- Checkout: empty cart, exact money calculations, insufficient stock, successful stock deduction, order snapshots, cart clearing, and confirmation data.
- Rollback: force a failure after a write has occurred, then query the database to prove that stock, orders, order items, and cart contents are unchanged. An error response alone does not prove rollback.
- Repeated or competing writes: verify the invariants affected by the change, including no negative stock or partial orders. Assert outcomes, not an assumed winner or execution order. A transaction alone does not prove idempotency.
- Database changes: test migration from a fresh database and a representative earlier schema in disposable databases, and check repeated seeding preserves existing user data and stock.
- Asset changes: verify returned bytes, content type, missing-key behavior, ETag, and conditional requests rather than checking only HTTP 200.

Assert status, response shape, and relevant persistent side effects. For rejected writes, also assert that data did not change. Hardcoded success responses, shallow truthiness assertions, and tests that only echo mock values are not acceptable proof.

Use an isolated test database. The current test setup uses in-memory SQLite; file-based migration or concurrency tests must use disposable, explicitly identified databases. Never run destructive tests or reset commands against the developer's working database. Read the setup first, create deterministic fixtures, and clean up resources. Do not depend on test order, the developer's `.env`, an external service, or arbitrary sleeps.

Never delete, skip, mark as todo, focus with `.only`, or weaken a test to hide a regression. Do not lower coverage thresholds, exclude difficult files, or bypass middleware to manufacture a passing suite. A changed expectation needs a changed requirement and an explanation. Fix flaky tests at their cause instead of repeatedly rerunning until green. Any deliberate defect used to validate a regression test must be safely isolated or reverted, followed by a clean rerun.

Run commands from `apps/api`:

- `npm run lint` for lint checks.
- `npm run typecheck` for TypeScript checks.
- `npm test` for unit and integration tests.
- `npm run build` to compile the backend.
- `npm run check` for formatting, lint, type checks, tests, and build together.

For runtime code, dependencies, database changes, or build/test configuration changes, run targeted tests during development and `npm run check` before handoff. Run `npm run test:e2e` from `apps/web` when changes affect browser-facing authentication, cart, wishlist, checkout, or API contracts. For documentation-only changes, formatting and diff checks are sufficient; say that application tests were not run because behavior did not change.

If a required check cannot run, report the exact command, blocker, and unverified behavior. Fix failures introduced by the change before calling it complete. Report unrelated pre-existing failures without silently changing their tests or expanding the task. State actual results, not planned checks: skipped is not passed, and passing unit tests or a high coverage percentage does not prove end-to-end correctness.

## Keep the submission honest and appropriately sized

Section 1 evaluates project structure, engineering decisions, edge cases, and clean state updates, not only whether the happy path works. Section 5 asks for a solution scaled to these requirements. Keep the existing monorepo focused; do not introduce microservices, queues, external storage, deployment infrastructure, or payment services without a concrete need and an explicit request.

Section 5 also requires the author to write their own Database, Backend, and Frontend rationale and a separate account of AI usage, without AI assistance. This `AGENTS.md` is an AI-assisted working instruction file, not either of those submission documents. Leave the assessed personal explanations to the author. Do not invent their motivations, testing history, or development decisions.

At the end of a change, explain what changed, which requirement it supports, what was checked, and what remains unresolved. Separate verified behavior from assumptions and suggested improvements.
