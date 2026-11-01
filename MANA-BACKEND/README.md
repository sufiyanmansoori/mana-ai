# Mana AI API

Node.js 22 / TypeScript API for Mana AI chat services, with an optional,
separate product catalog API. Catalog data uses PostgreSQL, integer INR paise
prices, and public read-only product browsing endpoints; the Flutter app
continues to open to the Mana AI chat experience.

Engineering documentation:

- [API reference](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Configuration](./docs/CONFIGURATION.md)
- [Observability](./docs/OBSERVABILITY.md)
- [Security](./docs/SECURITY.md)
- [Testing](./docs/TESTING.md)
- [Implementation status](./docs/IMPLEMENTATION_STATUS.md)
- [Architecture decision records](./docs/adr/)

## Local setup

Copy the root environment template, then configure `DATABASE_URL` to point to
a PostgreSQL instance reachable from the API process. For a database published
on the local machine, use `localhost` rather than the Docker-only hostname
`postgres`.

### Windows Command Prompt

Run these commands from Command Prompt. If the root `.env` already exists,
keep it and update its values rather than overwriting it:

```cmd
cd /d C:\Users\mohds\OneDrive\Desktop\AICHATBOT
if not exist .env copy .env.example .env
notepad .env
npm ci
npm run migrate --workspace=@mana-ai/api
npm run dev:api
```

Set `DATABASE_URL` to a reachable PostgreSQL database and use a
`LOCAL_JWT_SECRET` of at least 32 characters for local authentication. The
test defaults are documented separately in
[`.env.test.example`](./.env.test.example).

```powershell
Copy-Item .env.example .env
Set-Location apps/mana_ai_api
npm run migrate
npm run dev
```

Set a valid provider key in the root `.env` before using AI features:

```dotenv
AI_API_KEY=your-server-side-provider-key
IMAGE_API_KEY=your-image-provider-key
```

Supported `AI_PROVIDER` values are `openai`, `openai-compatible`, `anthropic`,
`azure-openai`, `cohere`, `gemini`, `groq`, `mistral`, and `ollama`. Azure
requires `AI_BASE_URL` and `AI_API_VERSION`; other providers use documented
default API endpoints unless `AI_BASE_URL` is set. Supply `AI_MODEL` and keep
all provider keys only in the API server environment. `IMAGE_API_KEY` may reuse
`AI_API_KEY` only for OpenAI/OpenAI-compatible chat; otherwise configure an
OpenAI-compatible `IMAGE_BASE_URL` and image key.

Rebuild/redeploy the API after changing provider keys; the Flutter app never
receives them. Use URL-safe characters for local database passwords and keep
`LOCAL_JWT_SECRET` at least 32 characters long.

In development, the API permits HTTP origins on `localhost`, `127.0.0.1`, and
`::1` at any port so Flutter's automatically selected web port works. This
loopback-only CORS allowance is disabled outside development.

Run the Mana AI Flutter app on an origin allowed by `API_CORS_ORIGINS`, for
example:

```powershell
Set-Location apps/mana_ai_app
flutter run -d chrome --web-port 5173
```

For a physical device or emulator, set `API_BASE_URL` to an address reachable
from that device (Android emulator: `http://10.0.2.2:3000`).

## API

- `GET /health/live` — process liveness.
- `GET /health/ready` — PostgreSQL readiness.
- `GET /v1/store/categories` — active product categories and in-stock counts.
- `GET /v1/store/products?q=phone&category=mobiles&sort=popular&page=1&limit=24`
  — searchable, category-filtered, sorted and paginated in-stock products.
- `GET /v1/store/products/{slug}` — active in-stock product details.
- `POST /v1/auth/dev-token` — local-only test token issuer.
- `GET /v1/me` — authenticated token subject.
- `GET /v1/models` — enabled model allowlist.
- `GET /v1/preferences` — current user's saved settings or defaults.
- `PATCH /v1/preferences` with `locale`, `theme_mode`, and/or
  `default_model` — update validated user settings.
- `DELETE /v1/preferences` — reset preferences to defaults.
- `POST /v1/chat/completions` — authenticated AI SSE stream (legacy service).
- `POST /v1/images/generations` — authenticated image generation. Send
  `{"prompt":"...","size":"1024x1024"}`; supported sizes are `1024x1024`,
  `1536x1024`, and `1024x1536`. The endpoint uses the configured image model
  and returns a base64 image without exposing provider credentials.
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
- `GET /v1/admin/feature-flags` — list feature flags (administrator only).
- `GET /v1/admin/feature-flags/audit?limit=50` — recent flag changes.
- `POST /v1/admin/feature-flags` — create a flag with `key`, `description`,
  and optional `enabled`.
- `PATCH /v1/admin/feature-flags/{key}` — update a flag's `enabled` value.
- `DELETE /v1/admin/feature-flags/{key}` — delete a flag.
- `GET /v1/admin/records?limit=20&cursor={cursor}` — list administrator records
  with stable cursor pagination.
- `GET /v1/admin/records/{id}` — fetch an administrator record.
- `PUT /v1/admin/records/{id}` with `{"createdAt":"2026-10-25T00:00:00Z"}` —
  create or update a record.
- `DELETE /v1/admin/records/{id}` — delete an administrator record.

Preferences are scoped to the authenticated OIDC subject, persisted in
PostgreSQL, and limited to models enabled by the server configuration.

Feature-flag administration requires an authenticated token whose exact
subject is listed in `ADMIN_SUBJECTS`. Set
`ADMIN_SUBJECTS=mana-ai-local-development-user` for local Flutter development;
in production, configure one or more trusted OIDC subject IDs. Flag mutations
and the acting subject are written to the admin audit table.

To enable images, configure `IMAGE_API_KEY` on the API server (or reuse
`AI_API_KEY` when `AI_PROVIDER=openai` or `openai-compatible`), and use a compatible
image-generation model such as `gpt-image-1`. `IMAGE_BASE_URL` defaults to the
OpenAI-compatible chat base URL or the official OpenAI API when chat uses
another provider. Image generation is disabled with a clear `503` response
until a key is configured; provider keys must never be placed in Flutter
settings or `--dart-define`.

Chat requests accept `model`, `stream: true`, optional `conversation_id`, and
the standard `messages` array. A new conversation UUID is returned in the
`X-Conversation-Id` header. Pass it back as `conversation_id` on follow-up
requests. The API stores the latest user message and the completed assistant
response in one transaction; interrupted or failed generations are not stored
as successful turns.

The optional catalog endpoints are public and read-only. Prices are stored as
integer paise and displayed in INR. Product administration, cart, checkout,
tax calculation, delivery, payments, returns, and customer accounts are not
included; do not accept real orders until those flows and their operational
policies are implemented and tested.

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

The API tests exercise catalog request validation, authentication boundaries,
request validation, SSE formatting, and provider stream parsing without
requiring a live database.
