# Security policy

## Supported code

Security fixes are accepted for the current default branch. A release branch
is supported only when maintainers identify it in a release notice.

## Report a vulnerability

Do not publish exploit details, personal data, or credentials in a public
issue. Contact maintainers through the hosting provider's private
vulnerability-reporting feature. This repository does not yet publish a
dedicated security email address.

Include the affected package/version, impact, reproducible steps, and a
suggested mitigation where possible. Allow maintainers time to investigate
and coordinate a fix before public disclosure.

## Deployment requirements

- Store database, Redis, signing, OAuth, and provider credentials in a managed
  secret store. Never commit `.env` files or put secrets in client build-time
  defines.
- Terminate TLS at a trusted ingress and use HTTPS/WSS across trust
  boundaries where supported.
- Keep PostgreSQL and Redis private; never publish their ports to the Internet.
- Configure an external OIDC issuer and verify issuer, audience, signature,
  and expiry. The local development token endpoint must remain disabled in
  production.
- Keep the API's conversation routes private and retain the owner-scoped SQL
  predicates when extending them. Do not expose admin routes without a separate
  privileged identity and audit policy.
- Scan dependencies and container images before release.
- Configure backups, retention, incident response, audits, and data deletion
  before storing real user data.

## Current limitations

The Flutter chat is local-only and is not wired to the API. The API supports
OIDC access-token verification and PostgreSQL-backed chat, but no identity
provider, AI provider, billing provider, or production secret store is
configured by default. Configure and test those dependencies before storing
real user data or deploying publicly.
