# Contributing

## Local workflow

1. Start the API in `apps/api`.
2. Install dependencies and copy `.env.example` to `.env.local`.
3. Start the storefront with `npm run dev`.
4. Keep changes focused and add tests for changed behavior.
5. Run `npm run check` before opening a pull request.
6. Run `npm run test:e2e` when changing a customer journey, authentication, API integration, or responsive layout.

## Code organization

- Pages coordinate data and workflows; focused components own presentation.
- Browser and server HTTP calls belong in `src/services` rather than components.
- Backend contracts, authentication, persistence, and business rules belong in `apps/api`.
- Client totals are for presentation and must never be treated as authoritative order values.
- Component-specific styles should remain colocated CSS Modules.

## Pull requests

Explain the user-visible outcome, API compatibility impact, important decisions, and verification performed. Avoid combining unrelated refactors and features. Screenshots are expected for visual changes, including a mobile viewport when responsive behavior changes.
