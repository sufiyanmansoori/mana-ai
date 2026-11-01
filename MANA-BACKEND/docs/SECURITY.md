# Security

## Authentication and authorization

Production access tokens are verified against the configured OIDC issuer,
JWKS, audience, and expiry. The local token issuer is enabled only in
development. Never deploy `LOCAL_JWT_SECRET` in production. Administrator
routes require both a valid token and an exact subject match from
`ADMIN_SUBJECTS`; display names and client-supplied role fields are not trusted.

Conversation and preference operations are scoped to the authenticated subject.
Database operations use bound parameters. Request schemas reject invalid and
unexpected fields where strict schemas are defined.

## Transport and secrets

Production database connections must use TLS. Serve public traffic through
HTTPS and a trusted ingress. Keep database passwords, OIDC settings, and AI
provider keys in a managed secret store. Do not put secrets in source control,
container layers, build logs, Flutter assets, or `--dart-define`.

Rotate exposed credentials immediately. Local `.env` files are for development
only and must never be uploaded.

## Browser and response protections

Helmet security headers are enabled. CORS allows only configured origins in
production; the dynamic-port loopback exception is development-only. Sensitive
administrator and image responses are marked `no-store`. Error responses
avoid returning internal stack traces.

## Abuse and resource limits

JSON request bodies are limited to 1 MiB. Chat and image requests consume a
shared, per-subject database quota. Provider calls have configured timeouts;
chat output and message counts have configured limits. Keep limits appropriate
to provider cost and capacity. Apply edge-level rate limiting and request-size
limits before exposing the service to the public internet.

## Data handling

Conversation content is persisted in PostgreSQL. Define and enforce retention,
deletion, backup encryption, and restore-access policies for the deployment.
Backups contain the same sensitive data as the primary database. The
administrator feature-flag audit records include actor subject IDs.

## Dependency and change security

CI runs dependency review for pull requests, `npm audit`, and CodeQL static
analysis. Review all dependency updates and generated lockfile changes. Apply
database migrations through the reviewed migration process. Report suspected
vulnerabilities privately to the repository maintainers; do not publish
unpatched exploit details.

## Operational checklist

- Use production OIDC and TLS-only PostgreSQL settings.
- Restrict `ADMIN_SUBJECTS` to individually approved subjects.
- Store and rotate secrets outside GitHub logs and source files.
- Restrict database and ingress network access.
- Configure provider spending limits and abuse controls.
- Test backup restoration and deletion/retention procedures.
- Review audit and security alerts on a defined operational schedule.
