# Architecture and version-control strategy

## Why one repository

This is one small product with one storefront and one API. A customer journey often changes both sides of their HTTP contract, so one pull request can include the UI, API, migrations, and tests together. A single repository gives reviewers one history, one issue/PR surface, and one CI result. Two repositories would add cross-repository synchronization without independent teams or release cadences to justify it.

The monorepo is not a single deployable. `apps/web` and `apps/api` have independent dependencies, lockfiles, environment variables, builds, and runtime processes. This keeps deployment flexible and avoids introducing a build-system dependency for two small packages.

## Runtime boundary

```text
Browser / Next.js server  →  Express API  →  Sequelize  →  SQLite
                                                  ├── commerce data
                                                  └── image BLOBs
```

Next.js owns routing and presentation. The API owns authentication, validation, pricing, stock, persistence, and database-backed image delivery. Product rows reference asset keys; the API streams the corresponding BLOBs with HTTP cache metadata. Client totals are previews; checkout recalculates them on the server.

## GitHub workflow

- `main` is the integration branch; changes land through short-lived feature/fix branches and pull requests.
- Each PR documents user-visible behavior, API compatibility or migration impact, and verification.
- CI checks each package independently and runs the end-to-end purchase journey against both services.
- The two lockfiles and package-specific environment examples make dependency and configuration changes explicit.
- Deploy the API before the storefront when a change requires an API contract or migration; separate service deployments remain possible.

At a larger scale, independent teams, unrelated consumers, or different release policies could justify splitting repositories. This assessment does not yet have those operational pressures.

## Deliberate limits

The API uses SQLite and pay-on-delivery for reproducibility. It is not a real-payments deployment. Session logout clears the browser cookie, but a previously copied signed token remains valid until expiry; server-side session revocation is a future security improvement.
