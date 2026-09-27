# Contributing

Use a short-lived branch from `main` and open a pull request. Keep UI, API, schema, and test changes for one customer journey together when they belong to the same feature.

Run `npm run check` from the repository root before review. Run `npm run test:e2e` for authentication, cart, checkout, and other cross-application journeys. For database changes, add a versioned migration and describe deployment order.

Do not commit real `.env` files, database files, credentials, or generated build output.
