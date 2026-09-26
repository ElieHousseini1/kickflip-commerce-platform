# Interview guide

## A concise project story

“I separated the original Next.js persistence code into an Express API so the frontend and backend have clear ownership. I chose a modular monolith because the domain is small, then used routes, controllers, services, repositories, and serializers so each concern has one home. SQLite keeps the exercise easy to run, Sequelize keeps the persistence layer portable, and TypeScript plus runtime Zod validation covers both trusted and untrusted data.”

## Code paths worth demonstrating

1. **Startup:** `server.ts` → database bootstrap → migrations → idempotent seed.
2. **Authentication:** auth route → validated contract → bcrypt verification → signed HttpOnly cookie.
3. **Cart update:** contract → stock policy → transaction → repository mutation → serialized cart.
4. **Checkout:** server-calculated totals → conditional stock reservation → order snapshots → cart clear in one transaction.
5. **Failure handling:** typed application errors → centralized safe JSON response and structured log.

## Questions this design anticipates

**Why not keep Next.js route handlers?**

The assessment asks for Node.js and React, and the standalone service makes backend ownership, independent testing, deployment, and future non-web clients explicit.

**Why not microservices?**

The operational overhead would outweigh the benefit at this scale. The boundaries are modular without introducing distributed transactions or network failure modes.

**Why both TypeScript and Zod?**

TypeScript protects code at development time. Zod protects runtime boundaries where request JSON is untrusted.

**What makes checkout safe?**

It ignores browser totals, reads authoritative prices, verifies stock with a conditional update, and commits all changes atomically. Real payments would additionally require provider idempotency and reconciliation.

**What would change in production?**

PostgreSQL, managed secrets, TLS, a shared rate-limit store, observability export, key rotation/session revocation, backups, and deployment-specific cookie/domain configuration.

## Honest scope boundaries

This is a focused commerce assessment, not a complete retail platform. It has no payment processor, tax engine, fulfillment integration, admin catalog, email delivery, refresh tokens, or order-history UI. Those omissions are deliberate and documented rather than hidden behind abstractions that are not yet needed.
