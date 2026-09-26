# Security policy

## Supported version

The current `main` branch is supported for this assessment.

## Reporting

Do not open a public issue for a suspected vulnerability. Share reproduction steps, impact, and affected endpoint privately with the repository owner.

## Deployment checklist

- Use an active Node.js LTS release and run `npm ci` from the lockfile.
- Set `NODE_ENV=production` and provide a unique high-entropy `AUTH_SECRET` of at least 32 characters.
- Serve both applications over HTTPS; secure cookies are enabled in production.
- Restrict `CORS_ORIGINS` to exact trusted frontend origins.
- Prefer one public site through a reverse proxy. If trusted frontend and API subdomains must share the session, set `COOKIE_DOMAIN` to their narrowly scoped parent domain.
- Store the SQLite file outside the image on an encrypted, backed-up volume with least-privilege filesystem permissions.
- Do not expose SQLite through a shared network filesystem or run multiple writers across instances.
- Review `npm audit --omit=dev`, logs, and rate-limit behavior as part of each release.
- Put the service behind a trusted reverse proxy; production mode trusts one proxy hop.

## Security model

Protected resources are scoped exclusively by the authenticated user ID. Checkout and cart rules run on the server. Unexpected exceptions return generic messages, while structured internal logs retain request IDs for diagnosis and redact common secrets.

This project demonstrates appropriate controls for an assessment. It has not undergone an independent penetration test and should not process real payments or sensitive production customer data without a broader security review.
