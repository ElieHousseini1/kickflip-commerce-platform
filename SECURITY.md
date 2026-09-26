# Security

Report suspected vulnerabilities privately to the repository owner; do not open a public issue with reproduction details. The API security model and deployment checklist are in [apps/api/SECURITY.md](apps/api/SECURITY.md).

Environment secrets and SQLite database files are excluded from Git. This assessment does not process real payments. Before production use, review session revocation, managed secrets, TLS, backups, and the API's security checklist.
