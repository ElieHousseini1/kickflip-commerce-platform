# Working on the frontend

This is the Next.js frontend for the Mini E-Commerce Platform assessment. Keep the work focused on a small, complete shop that is easy to use and easy to explain. A polished screen is useful, but it does not replace a working flow or a clear error message.

## Start with the assessment

The reference is **Full Stack Engineer — Take-Home Assessment: Mini E-Commerce Platform**, supplied as `Full_Stack_Engineer_Assessment.pdf`. The section numbers below refer to that paper. They describe requirements, not a claim that every requirement has already been verified.

Follow the requested phase from the project context file and finish that scope before moving on. If the context file, the paper, and the current implementation disagree, point out the difference instead of silently choosing a new direction. Ask before adding features or changing the architecture.

The paper leaves the frontend framework and storage approach open (section 2). Next.js and SQLite are choices made in this project, not technologies required by the assessment. Keep that distinction clear when explaining the implementation.

## What the screens need to do

### Login — section 3.1

Keep the login flow simple and make access rules clear. Follow the existing session flow and route protection. A frontend redirect is useful for navigation, but the backend still has to authorize protected requests.

Show validation errors and failed login requests where the user can see them. On a slow connection, show that the request is pending and prevent repeated submissions. A failed request must not leave the screen looking as though it is still logging in.

### Product listing — section 3.2

The required catalog contains 15 products. Each product needs a title, price, and its available variants; at least three products must have more than one variant. Use the API data rather than creating a separate hardcoded catalog in the frontend. If the seed data does not meet these counts, report the backend gap instead of inventing products in the UI.

Keep every product reachable. If filters or pagination are present, users should still be able to find all 15 products and understand when a filter returns no results.

### Product details — section 3.3

Users must be able to open a detail page from the listing. Show the title, price, full description, remaining stock, and variants where they exist. Include both Add to Cart and Add to Wishlist.

Make the selected variant and quantity clear before adding an item. Handle unavailable products, out-of-stock items, and rejected requests without showing a false success message. Do not assume the stock displayed earlier is still current when the user clicks.

### Cart — section 3.4

Adding from the detail page is required; adding directly from the listing is optional. The cart must show each item, its quantity and subtotal, and the cart total. Users must be able to change quantities, remove items, and change their selected variants from the cart itself.

Changing variants is easy to overlook, so check it explicitly. Keep the cart page, header count, and checkout summary in sync after a successful change. If an update fails, retain the last confirmed state and explain the failure. Do not clear the cart merely because an order request was sent.

### Wishlist — section 3.5

Users need to be able to save products and view them in a separate wishlist. Keep the saved state consistent between the detail page, product cards, and wishlist page. Include a useful empty state.

Moving a wishlist item directly into the cart is a nice-to-have in the paper, not a prerequisite for completing the required flows. Do not let optional work delay required behavior.

### Checkout and confirmation — section 3.6

Let users review their cart and confirm an order. The paper does not require a real payment integration. Use the existing backend order flow and show the confirmation returned after a successful request.

After confirmed success, the cart should be empty and the user should see a meaningful confirmation or order summary. On a confirmed rejection before commit, keep the cart available and show the error. For a timeout or lost response, follow the uncertain-outcome policy below. Prevent duplicate submissions while the request is pending, and do not present frontend-calculated prices or stock as authoritative.

### Mandatory rollback and uncertain-outcome policy

The backend owns database rollback. Checkout writes must roll back together when a step fails before commit. The frontend must never assume that displaying an error, aborting a fetch, closing the page, or losing the connection undoes a database operation.

If the backend commits but the confirmation never reaches the browser, the order still exists. Treat a timeout or lost response as an unknown outcome, not a confirmed failed order. Tell the user that the order could not be confirmed; do not state that nothing was saved or that the operation rolled back.

Do not automatically retry order creation or invite a blind resubmission. Reconcile the outcome using an authoritative order/status mechanism if one exists, or use a tested server-enforced idempotency mechanism before retrying. An empty cart alone does not prove which order succeeded. If the API cannot resolve the outcome, report that limitation instead of inventing confirmation data or claiming safe retry support.

Do not clear the cart optimistically, recreate its contents on the server, or show a success screen based only on local state. Preserve local information while the outcome is uncertain, then refresh from authoritative backend data when available. Any retry path must follow the rules above.

For changes to checkout request handling, test both a confirmed rejection and a lost response after the backend commits. Verify the UI does not show false success or a false rollback claim, and does not submit a second order automatically. Mocked network failures alone do not prove database rollback; that requires backend integration tests.

### Responsive behavior — section 3.7

Responsiveness is mandatory across login, listing, details, cart, wishlist, checkout, and confirmation. Check desktop, tablet, and mobile layouts, not just the product grid.

Pay attention to navigation, forms, variant controls, images, long product names, cart rows, and order summaries. There should be no unwanted horizontal scrolling, clipped controls, or functionality that can only be reached by hovering. Keep text readable and controls usable with touch and keyboard. Use labels, visible focus states, and accessible feedback for forms.

## Keep changes consistent with this project

Read nearby code before introducing a new pattern. Keep routes and page composition in `src/app`, feature components in `src/components`, and small reusable helpers in `src/lib`. Use CSS Modules and the existing shared styles where appropriate. Extract components when they have a clear responsibility, not just to make more files.

Keep browser API calls in the existing `src/services` modules. Server-side requests belong in `src/services/server-api.js`; do not import server-only code into client components. Use Server Components where possible and add `"use client"` when interaction or browser APIs require it.

Reuse the existing auth, cart, and wishlist providers instead of creating competing copies of shared state. The backend owns validation, prices, stock, and order creation. Frontend validation should help the user and match the API contract; it is not a security boundary.

Product image data is stored in SQLite and served by the backend in the current implementation. Use `getAssetUrl` from `src/lib/assets.js` and the existing image components. Do not add another product image collection under the frontend or replace working URLs with placeholder domains. This storage approach is a project decision, not a requirement from the paper.

Use the root Prettier configuration and keep the frontend's Next.js-specific ESLint configuration. Do not duplicate shared configuration. Never put secrets in client code or `NEXT_PUBLIC_` variables.

Before changing Next.js-specific behavior, read the relevant documentation in `node_modules/next/dist/docs/`, relative to `apps/web`. The installed version may differ from examples remembered from older versions.

## Non-negotiable quality rules

These are working rules for this project, not additional requirements quoted from the assessment. Apply them to the requested change; they do not authorize an unrelated rewrite.

- Good: fix the cause of a problem and preserve existing behavior outside the request. Bad: hide the symptom with a hardcoded value, fake success response, empty catch block, or unrelated refactor. Do not do this.
- Good: keep one source of truth for shared state and reusable rules. Bad: duplicate cart state, validation rules, API clients, or configuration because it is faster to copy them.
- Good: show pending and error states and let the user recover. Bad: leave a spinner running forever, swallow a rejected request, clear user input unnecessarily, or report success before the backend confirms it.
- Good: use semantic controls, labels, visible focus, and usable mobile layouts. Bad: clickable non-interactive elements without keyboard support, placeholder-only labels, hover-only actions, or hiding overflow to conceal a broken layout.
- Good: keep server-only data on the server and follow the API contract. Bad: expose secrets, trust browser prices or permissions, or bypass authentication to make a flow work.
- Good: remove the cause of a lint or test failure. Bad: disable a rule, suppress an error, exclude a file, or add a broad exception just to get a green result. A justified exception must be narrow, explained, and reported.

## Tests are part of the change

A behavior change is not complete without automated tests covering it. A bug fix needs a regression test that fails for the original bug and passes with the fix. If the original failure cannot safely be reproduced, explain why and state exactly what the new test proves. Do not introduce an unrelated testing framework.

Use Vitest and Testing Library for helpers, components, and provider behavior. Use Playwright for integration between the browser and backend. Mock network boundaries in component tests, but do not mock away the state transitions or validation being tested. A browser test with mocked endpoints does not prove that the real API works.

For each changed flow, cover the relevant cases below. Mark a case as not applicable with a reason instead of silently omitting it:

- Successful action: assert the visible result and the relevant request data, not just that a click handler ran.
- Invalid input: test the actual contract boundaries, including just below, at, and just above a limit where applicable. Assert the error and that an invalid submission does not reach the API.
- Pending request: hold the response open and check loading feedback and duplicate-submit prevention. Use controlled promises or request interception rather than arbitrary sleeps.
- Failed request: check the visible error, retained confirmed state, and recovery or retry. Controls must become usable again.
- Empty or unavailable data: check empty cart and wishlist states, missing products, stock rejection, and session expiry when relevant.
- Shared state: check that cart counts, lines, totals, wishlist indicators, and checkout confirmation remain consistent after the changed action.
- Layout and accessibility: check affected screens on mobile, tablet, and desktop, including keyboard access, long content, and overflow. DOM tests alone do not prove responsive behavior.

Test through accessible roles, labels, and user-visible outcomes where possible. Do not couple tests to generated CSS class names or private component state. Keep fixtures realistic and aligned with the API contract. Reset mocks and state between tests; test order must not determine the result.

Never delete, skip, mark as todo, focus with `.only`, or weaken an existing test to hide a regression. Do not replace meaningful assertions with snapshots, truthiness checks, or assertions that merely repeat a mocked return value. Do not blindly update snapshots or change expected values to match broken behavior. Change an expectation only when the intended requirement changes, and explain that change.

Retries and longer timeouts are not fixes for flaky tests. Find the uncontrolled request, timing, or shared-state problem. If deliberately breaking behavior to validate a test, do it only in an isolated test setup or a safely reversible local edit, then restore the intended code and rerun the checks. Never leave the deliberate defect behind.

Run commands from `apps/web`:

- `npm run lint` for lint checks.
- `npm run test` for unit and component tests.
- `npm run build` for the production build.
- `npm run check` for formatting, lint, tests, and build together.
- `npm run test:e2e` for browser flows that involve both the frontend and backend.

For runtime code, dependencies, or build/test configuration changes, run the targeted tests during development and `npm run check` before handoff. Run `npm run test:e2e` when changing authentication, navigation, cart, wishlist, checkout, or the browser/API contract. For documentation-only changes, formatting and diff checks are sufficient; say that application tests were not run because behavior did not change.

The existing E2E configuration uses desktop Chromium; a passing run alone does not prove tablet or mobile responsiveness. Check those layouts separately when UI changes affect them. Do not add screenshot generation unless requested.

If a required check cannot run, report the exact command, blocker, and unverified behavior. A failed check is not a pass, and a skipped check is not evidence. Fix failures introduced by the change before calling it complete. Report unrelated pre-existing failures without silently repairing or hiding them. Never claim the whole application is verified from a single targeted test or a coverage percentage.

## Keep the submission honest and appropriately sized

Section 1 says the assessment evaluates structure, decisions, loading states, edge cases, and clean state updates, not only visual polish. Section 5 asks for a solution scaled to this exact scope. Favor clear responsibilities and reliable behavior over extra libraries, infrastructure, or unrelated features. Deployment and real payments are not listed as requirements.

Section 5 also requires the author to write their own Database, Backend, and Frontend rationale, along with a separate account of how AI was used, without AI assistance. This `AGENTS.md` is an AI-assisted working instruction file, not either of those submission documents. Leave the assessed personal explanations to the author and do not invent their reasoning, testing history, or decisions.

When handing back a change, briefly explain what changed, which requirement it serves, what was checked, and anything still unresolved. Do not claim that a feature works, a test passed, or the assessment is complete without evidence.
