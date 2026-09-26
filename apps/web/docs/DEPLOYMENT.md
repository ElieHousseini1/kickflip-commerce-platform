# Deployment guide

The storefront and API are deployed as two Node.js services. Deploy the backend first so server-rendered catalog requests are available when frontend traffic begins.

## Frontend configuration

| Variable                          | Purpose                                                            |
| --------------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`            | Canonical storefront origin for metadata                           |
| `NEXT_PUBLIC_API_URL`             | Public API base URL embedded into browser JavaScript at build time |
| `NEXT_PUBLIC_SESSION_COOKIE_NAME` | Session-cookie name; must match the backend                        |
| `BACKEND_API_URL`                 | Optional private/internal API base URL used by Next.js at runtime  |

```bash
npm ci
npm run check
npm run start
```

## Cross-service requirements

- The backend `CORS_ORIGINS` must include the exact public storefront origin.
- Both services must use HTTPS in production.
- Prefer exposing the API through the storefront's public origin with a reverse proxy. For trusted sibling subdomains such as `shop.example.com` and `api.example.com`, configure the backend's `COOKIE_DOMAIN=.example.com`; cross-site deployments require an explicit redesign and testing of `SameSite`, CSRF, and cookie policy.
- Health checks should target the backend `/health` endpoint and a storefront page separately.
- `NEXT_PUBLIC_API_URL` must be correct at build time; changing it requires a frontend rebuild.

The API documentation in `apps/api` contains its database, secret, backup, container, and scaling guidance.
