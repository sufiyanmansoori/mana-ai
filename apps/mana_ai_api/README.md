# Mana AI API

Node.js 22 / TypeScript API for authenticated, streamed AI chat and persistent
conversation history. The service uses PostgreSQL and an OpenAI-compatible
streaming endpoint. It does not ship provider credentials or assume a cloud
identity provider.

## Local setup

From the repository root:

```powershell
Copy-Item .env.example .env
# Use URL-safe characters for POSTGRES_PASSWORD; keep LOCAL_JWT_SECRET at least
# 32 characters and private even in development.
docker compose --env-file .env -f infrastructure/docker/compose.yaml up --build
```

The migration job runs once before the API starts. For local development
without containers, set `DATABASE_URL` to a local PostgreSQL database and run:

```powershell
npm install
npm run migrate --workspace=@mana-ai/api
npm run dev:api
```

The development token endpoint is available only when `NODE_ENV=development`:

```http
POST /v1/auth/dev-token
Content-Type: application/json

{"subject":"local-user"}
```

Use the returned bearer token for all `/v1` routes. Set `AI_API_KEY` and
`AI_BASE_URL` to an OpenAI-compatible provider to receive real completions. If
the key is unset, chat returns `503 ai_provider_not_configured`; it never
returns a fabricated answer.

## API

- `GET /health/live` — process liveness.
- `GET /health/ready` — PostgreSQL readiness.
- `POST /v1/auth/dev-token` — local-only test token issuer.
- `GET /v1/me` — authenticated token subject.
- `GET /v1/models` — enabled model allowlist.
- `GET /v1/preferences` — current user's saved settings or defaults.
- `PATCH /v1/preferences` with `locale`, `theme_mode`, and/or
  `default_model` — update validated user settings.
- `DELETE /v1/preferences` — reset preferences to defaults.
- `POST /v1/chat/completions` — authenticated OpenAI-compatible SSE stream.
- `GET /v1/conversations?page=1&limit=25&q=term&folder_id={uuid}&pinned=true` —
  current user's searchable, filterable conversations.
- `GET /v1/conversations/{uuid}/messages?limit=100` — conversation messages.
- `PATCH /v1/conversations/{uuid}` with `{"title":"..."}` — rename.
- `PATCH /v1/conversations/{uuid}/pin` with `{"pinned":true}` — pin/unpin.
- `PATCH /v1/conversations/{uuid}/folder` with `{"folder_id":"{uuid}"}` or
  `{"folder_id":null}` — organize/remove a folder.
- `DELETE /v1/conversations/{uuid}` — archive without exposing other users'
  conversations.
- `GET|POST /v1/conversation-folders` — list or create the current user's
  folders.
- `PATCH|DELETE /v1/conversation-folders/{uuid}` — rename/delete a folder.

Preferences are scoped to the authenticated OIDC subject, persisted in
PostgreSQL, and limited to models enabled by the server configuration.

Chat requests accept `model`, `stream: true`, optional `conversation_id`, and
the standard `messages` array. A new conversation UUID is returned in the
`X-Conversation-Id` header. Pass it back as `conversation_id` on follow-up
requests. The API stores the latest user message and the completed assistant
response in one transaction; interrupted or failed generations are not stored
as successful turns.

## Authentication and production

Production requires `OIDC_ISSUER_URL`, `OIDC_JWKS_URL`, and `OIDC_AUDIENCE`;
tokens are verified against the issuer's JWKS, issuer, audience, and expiry.
Production also requires `DATABASE_SSL=require`. Apply migrations separately
with `node dist/db/migrate.js`, then run the built service with `npm start`.
Use a managed secret store, TLS ingress, private database networking,
retention/deletion policies, tested backups, and an upstream abuse-control
policy before public deployment.

## Checks

```powershell
npm run typecheck --workspace=@mana-ai/api
npm test --workspace=@mana-ai/api
npm run build --workspace=@mana-ai/api
```

The API tests exercise authentication boundaries, request validation, SSE
formatting, and provider stream parsing without requiring paid provider
credentials or a live database.
