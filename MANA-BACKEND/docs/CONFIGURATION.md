# API configuration

Runtime configuration is validated once at startup by Zod in
`src/config/env-schema.ts`, then grouped into typed settings by the matching
module under `src/config/`. Invalid settings fail startup. Validation messages
identify the setting but do not include its submitted value.

## Core service

| Setting | Default | Notes |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development`, `test`, or `production`. |
| `API_HOST` / `API_PORT` | `127.0.0.1` / `3000` | Use `0.0.0.0` inside a container. |
| `API_CORS_ORIGINS` | `http://localhost:8080` | Comma-separated exact origins; paths and wildcards are rejected. |
| `API_SHUTDOWN_TIMEOUT_MS` | `15000` | Bounded graceful shutdown deadline. |
| `API_TRUST_PROXY_HOPS` | `0` | Explicit hop count only; leave at zero unless every trusted proxy hop is known. |
| `API_BODY_LIMIT_BYTES` | `1048576` | JSON request-body byte limit (1 KiB–10 MiB). |
| `DATABASE_URL` | required | Must be a PostgreSQL URL. |
| `DATABASE_SSL` | `disable` | Production requires `require`. |
| `DATABASE_POOL_MAX` | `20` | Maximum connections per API process (1–200). |

## Authentication and provider selection

Production requires OIDC issuer, JWKS, audience, TLS PostgreSQL, and an
administrator subject allowlist. Local JWT is development/test only. Configure
only the provider actually selected by `AI_PROVIDER`; all credentials stay in
the backend environment.

`AI_API_VERSION` and a resource URL are required by Azure OpenAI. Mail, OAuth,
payments, Redis, queues, and remote storage remain disabled unless their
provider and complete credentials are configured. Enabling settings does not
mean an integration adapter or related API flow is implemented.

## Optional settings groups

- **AI:** `AI_TIMEOUT_MS`, `AI_MAX_RETRIES`, circuit-breaker thresholds, model
  allowlist, and image provider settings. Retries default to zero.
- **Traffic limits:** `CHAT_RATE_LIMIT_PER_MINUTE`, input/output bounds,
  `RATE_LIMIT_WINDOW_MS`, and `RATE_LIMIT_MAX_REQUESTS`.
- **Logging/telemetry:** `LOG_LEVEL`, additional `LOG_REDACT_PATHS`,
  `SERVICE_NAME`, `METRICS_ENABLED`, and `OTEL_EXPORTER_OTLP_ENDPOINT`.
- **Redis/queues:** `REDIS_URL`, TLS verification, key prefix, and worker
  concurrency. Production Redis requires `rediss://`. Redis-backed workers
  and rate limiting are not implemented; configured Redis does not switch the
  current PostgreSQL-backed rate limiter.
- **Features/locales:** image, voice, web search, and document-RAG flags plus
  default and supported locales. Only feature routes explicitly wired by the
  application are affected.
- **Mail/OAuth/payments:** provider selectors require their complete sender,
  client, webhook, or SMTP settings; disabled integrations do not start clients.
- **Storage:** local/S3/GCS/Azure provider selection, bucket, upload size, and
  MIME allowlist. Remote storage adapters and upload routes are separate work.
- **Edge/security:** `CDN_BASE_URL` is HTTPS-only in production,
  `CDN_CACHE_CONTROL` is checked against header injection, and Helmet CSP/HSTS
  settings are applied by the Express app.
- **Regions/search/realtime:** `APP_REGION` must be included in `APP_REGIONS`;
  search, vector-store, and WebSocket limits are validated and exposed in the
  typed runtime config. These settings do not start additional services.
- **Push/SMS/docs:** push and SMS providers require complete provider
  credentials before they can be selected. Swagger UI is disabled by default
  and rejected in production until a protected docs route is implemented.

See `src/config/env-schema.ts` for the complete set of accepted names, ranges,
and defaults. Do not put real secrets in `.env.example` or source control.
