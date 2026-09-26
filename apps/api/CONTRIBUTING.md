# Contributing

1. Use a supported Node.js LTS version.
2. Create a focused branch and keep transport, business, and persistence concerns in their existing layers.
3. Add a migration for every schema change; do not use destructive synchronization.
4. Add or update tests for changed behavior.
5. Run `npm run check` before opening a pull request.

Commit `.env.example` changes when configuration changes, but never commit `.env`, database files, tokens, or credentials.
