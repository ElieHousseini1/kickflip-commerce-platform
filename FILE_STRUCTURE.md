# File Structure

A monorepo with two apps: a TypeScript/Express REST API (`apps/api`) backed by
SQLite, and a Next.js storefront (`apps/web`). Tracked files only.

```
kickflip-commerce-platform/
├── .github/
│   ├── workflows/
│   │   └── quality.yml
│   └── pull_request_template.md
├── apps/
│   ├── api/
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── products/
│   │   │       │   ├── curb-crusher-v3.jpg
│   │   │       │   ├── diy-quarter-pipe-v3.jpg
│   │   │       │   ├── formula-wheels-v3.jpg
│   │   │       │   ├── grind-rail-v3.jpg
│   │   │       │   ├── hi-top-shoes-v3.jpg
│   │   │       │   ├── hollow-trucks-v3.jpg
│   │   │       │   ├── impact-helmet-v3.jpg
│   │   │       │   ├── knee-pads-v3.jpg
│   │   │       │   ├── logo-tee-v3.jpg
│   │   │       │   ├── mini-ramp-v3.jpg
│   │   │       │   ├── pool-deck-v3.jpg
│   │   │       │   ├── skate-backpack-v3.jpg
│   │   │       │   ├── skate-tool-v3.jpg
│   │   │       │   ├── speed-bearings-v3.jpg
│   │   │       │   └── street-complete-v3.jpg
│   │   │       ├── hero-still-life.png
│   │   │       ├── kickflip-watermark.png
│   │   │       ├── product-fallback.png
│   │   │       └── skate-hero.jpg
│   │   ├── docs/
│   │   │   ├── ARCHITECTURE.md
│   │   │   └── INTERVIEW_GUIDE.md
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── env.ts
│   │   │   │   └── logger.ts
│   │   │   ├── contracts/
│   │   │   │   ├── auth.contract.ts
│   │   │   │   ├── cart.contract.ts
│   │   │   │   ├── checkout.contract.ts
│   │   │   │   ├── input-boundaries.test.ts
│   │   │   │   ├── product.contract.ts
│   │   │   │   └── wishlist.contract.ts
│   │   │   ├── controllers/
│   │   │   │   ├── asset.controller.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── cart.controller.ts
│   │   │   │   ├── order.controller.ts
│   │   │   │   ├── product.controller.ts
│   │   │   │   └── wishlist.controller.ts
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   │   ├── 001-initial-schema.ts
│   │   │   │   │   ├── 002-pocket-skate-tool-price.ts
│   │   │   │   │   ├── 003-repair-pocket-skate-tool-timestamp.ts
│   │   │   │   │   ├── 004-order-delivery-method.ts
│   │   │   │   │   ├── 005-order-contact-details.ts
│   │   │   │   │   ├── 006-product-compare-at-price.ts
│   │   │   │   │   ├── 007-assets.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── migration.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── asset.model.ts
│   │   │   │   │   ├── cart-item.model.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── order-item.model.ts
│   │   │   │   │   ├── order.model.ts
│   │   │   │   │   ├── product-variant.model.ts
│   │   │   │   │   ├── product.model.ts
│   │   │   │   │   ├── user.model.ts
│   │   │   │   │   └── wishlist-item.model.ts
│   │   │   │   ├── bootstrap.ts
│   │   │   │   ├── catalog.ts
│   │   │   │   ├── migrate.ts
│   │   │   │   └── seed.ts
│   │   │   ├── docs/
│   │   │   │   └── openapi.ts
│   │   │   ├── errors/
│   │   │   │   └── app-error.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authenticate.ts
│   │   │   │   ├── error-handler.ts
│   │   │   │   ├── origin-guard.ts
│   │   │   │   ├── rate-limits.ts
│   │   │   │   └── validate.ts
│   │   │   ├── policies/
│   │   │   │   ├── commerce.policy.test.ts
│   │   │   │   └── commerce.policy.ts
│   │   │   ├── repositories/
│   │   │   │   ├── asset.repository.ts
│   │   │   │   ├── cart.repository.ts
│   │   │   │   ├── order.repository.ts
│   │   │   │   ├── product.repository.ts
│   │   │   │   ├── user.repository.ts
│   │   │   │   └── wishlist.repository.ts
│   │   │   ├── routes/
│   │   │   │   ├── asset.routes.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── cart.routes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── order.routes.ts
│   │   │   │   ├── product.routes.ts
│   │   │   │   └── wishlist.routes.ts
│   │   │   ├── security/
│   │   │   │   ├── authenticated-user.ts
│   │   │   │   └── session.ts
│   │   │   ├── serializers/
│   │   │   │   ├── cart.serializer.ts
│   │   │   │   ├── product.serializer.ts
│   │   │   │   └── user.serializer.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   └── wishlist.service.ts
│   │   │   ├── types/
│   │   │   │   ├── domain.ts
│   │   │   │   └── express.d.ts
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── test/
│   │   │   ├── api.integration.test.ts
│   │   │   └── setup.ts
│   │   ├── .dockerignore
│   │   ├── .env.example
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── SECURITY.md
│   │   ├── eslint.config.mjs
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── tsconfig.build.json
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   └── web/
│       ├── docs/
│       │   ├── ARCHITECTURE.md
│       │   └── DEPLOYMENT.md
│       ├── e2e/
│       │   └── storefront.spec.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── cart/
│       │   │   │   ├── cart.module.css
│       │   │   │   ├── layout.jsx
│       │   │   │   └── page.jsx
│       │   │   ├── checkout/
│       │   │   │   ├── checkout.module.css
│       │   │   │   ├── layout.jsx
│       │   │   │   └── page.jsx
│       │   │   ├── login/
│       │   │   │   └── page.jsx
│       │   │   ├── products/
│       │   │   │   ├── [slug]/
│       │   │   │   │   └── page.jsx
│       │   │   │   └── page.jsx
│       │   │   ├── signup/
│       │   │   │   └── page.jsx
│       │   │   ├── wishlist/
│       │   │   │   ├── layout.jsx
│       │   │   │   └── page.jsx
│       │   │   ├── error.jsx
│       │   │   ├── favicon.ico
│       │   │   ├── global-error.jsx
│       │   │   ├── globals.css
│       │   │   ├── layout.jsx
│       │   │   ├── loading.jsx
│       │   │   ├── not-found.jsx
│       │   │   ├── page.jsx
│       │   │   ├── robots.js
│       │   │   └── sitemap.js
│       │   ├── components/
│       │   │   ├── auth/
│       │   │   │   ├── login-form.jsx
│       │   │   │   └── login.module.css
│       │   │   ├── cart/
│       │   │   │   ├── cart-line-item.jsx
│       │   │   │   ├── cart-line-item.module.css
│       │   │   │   ├── order-summary.jsx
│       │   │   │   └── order-summary.module.css
│       │   │   ├── checkout/
│       │   │   │   ├── checkout-form.jsx
│       │   │   │   ├── checkout-form.module.css
│       │   │   │   ├── checkout-summary.jsx
│       │   │   │   └── checkout-summary.module.css
│       │   │   ├── layout/
│       │   │   │   ├── app-shell.jsx
│       │   │   │   ├── promotion-popup.jsx
│       │   │   │   ├── promotion-popup.module.css
│       │   │   │   ├── site-footer.jsx
│       │   │   │   ├── site-footer.module.css
│       │   │   │   ├── site-header.jsx
│       │   │   │   └── site-header.module.css
│       │   │   ├── product/
│       │   │   │   ├── add-to-cart.jsx
│       │   │   │   ├── product-card.jsx
│       │   │   │   ├── product-card.module.css
│       │   │   │   ├── product-card.test.jsx
│       │   │   │   ├── product-catalog.jsx
│       │   │   │   ├── product-catalog.module.css
│       │   │   │   ├── product-catalog.test.jsx
│       │   │   │   ├── product-detail.module.css
│       │   │   │   ├── product-purchase.jsx
│       │   │   │   ├── product-purchase.test.jsx
│       │   │   │   └── wishlist-button.jsx
│       │   │   ├── providers/
│       │   │   │   ├── auth-provider.jsx
│       │   │   │   ├── cart-provider.jsx
│       │   │   │   ├── currency-provider.jsx
│       │   │   │   └── wishlist-provider.jsx
│       │   │   └── ui/
│       │   │       ├── brand-logo.jsx
│       │   │       ├── brand-logo.module.css
│       │   │       ├── currency-price.jsx
│       │   │       ├── dropdown.jsx
│       │   │       ├── dropdown.module.css
│       │   │       ├── empty-state.jsx
│       │   │       ├── empty-state.module.css
│       │   │       ├── error-view.jsx
│       │   │       ├── error-view.module.css
│       │   │       ├── page-loader.jsx
│       │   │       ├── page-loader.module.css
│       │   │       ├── page-loader.test.jsx
│       │   │       └── resilient-image.jsx
│       │   ├── lib/
│       │   │   ├── assets.js
│       │   │   ├── cart-totals.js
│       │   │   ├── cart-totals.test.js
│       │   │   ├── checkout-input.js
│       │   │   ├── checkout-input.test.js
│       │   │   ├── error-message.js
│       │   │   ├── error-message.test.js
│       │   │   ├── format.js
│       │   │   └── site-url.js
│       │   ├── services/
│       │   │   ├── api-client.js
│       │   │   ├── api-client.test.js
│       │   │   ├── auth-service.js
│       │   │   ├── cart-service.js
│       │   │   ├── order-service.js
│       │   │   ├── product-service.js
│       │   │   ├── product-service.test.js
│       │   │   ├── server-api.js
│       │   │   └── wishlist-service.js
│       │   ├── styles/
│       │   │   └── shared.module.css
│       │   └── proxy.js
│       ├── test/
│       │   ├── server-only.js
│       │   └── setup.js
│       ├── .env.example
│       ├── AGENTS.md
│       ├── README.md
│       ├── eslint.config.mjs
│       ├── jsconfig.json
│       ├── next.config.mjs
│       ├── package-lock.json
│       ├── package.json
│       ├── playwright.config.mjs
│       └── vitest.config.mjs
├── docs/
│   └── ARCHITECTURE.md
├── .gitattributes
├── .gitignore
├── .prettierignore
├── CONTRIBUTING.md
├── README.md
├── SECURITY.md
├── package.json
└── prettier.config.mjs
```

## Top-level layout

| Path | Description |
| --- | --- |
| `apps/api/` | Express + TypeScript REST API (controllers → services → repositories → SQLite models), with migrations, seed data, and product image assets. |
| `apps/web/` | Next.js App Router storefront (routes, React components, providers, services proxying the API). |
| `docs/` | Repo-wide architecture documentation. |
| `.github/` | CI workflow and PR template. |
| Root configs | `package.json`, `prettier.config.mjs`, `.gitignore`, `CONTRIBUTING.md`, `SECURITY.md`, `README.md`. |
