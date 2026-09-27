# Contributing

Use a supported Node.js LTS release and create a short-lived branch from `main`. Keep changes focused, while keeping UI, API, schema, and test changes for the same customer journey together.

## Code organization

- Web pages coordinate data and workflows; focused components own presentation.
- Browser and server HTTP calls belong in `apps/web/src/services` rather than components.
- API transport, business, and persistence concerns stay in their existing layers.
- The API owns authentication, persistence, pricing, stock, and other business rules. Client totals are presentational only.
- Component-specific styles remain colocated CSS Modules.

## Database and configuration

Add a versioned migration for every schema change; do not use destructive synchronization. Describe the required deployment order when a migration changes an API contract.

Commit changes to the relevant `.env.example` when configuration changes. Never commit real environment files, database files, tokens, credentials, or generated build output.

## Verification

Add or update tests for changed behavior. Run `npm run check` from the repository root before review. Run `npm run test:e2e` when changing authentication, API integration, responsive layout, or another cross-application customer journey.

## Pull requests

Explain the user-visible outcome, API compatibility impact, important decisions, and verification performed. Avoid combining unrelated refactors and features.
