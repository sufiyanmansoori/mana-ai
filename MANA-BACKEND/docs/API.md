# Mana AI API

Base path: `/v1`. JSON endpoints accept and return UTF-8 JSON unless noted.
All protected endpoints require `Authorization: Bearer <access-token>`.
Administrator endpoints additionally require the verified token subject to
appear exactly in `ADMIN_SUBJECTS`.

## Health

| Method | Path | Authentication | Purpose |
|---|---|---|---|
| GET | `/health/live` | No | Process liveness; returns `{"status":"ok"}`. |
| GET | `/health/ready` | No | PostgreSQL readiness; returns 503 when the database is unavailable. |

## Authentication and models

| Method | Path | Authentication | Purpose |
|---|---|---|---|
| POST | `/v1/auth/dev-token` | Development only | Issues a local token for `{"subject":"..."}`. Not available outside development. |
| GET | `/v1/me` | Yes | Returns the verified subject. |
| GET | `/v1/models` | Yes | Returns the server-configured model allowlist. |

## Chat and conversation management

`POST /v1/chat/completions` accepts a streaming request:

```json
{
  "model": "gpt-4o-mini",
  "stream": true,
  "messages": [{"role": "user", "content": "Hello"}]
}
```

`model` and `conversation_id` are optional. Messages are limited by
`CHAT_MAX_INPUT_MESSAGES` and `CHAT_MAX_MESSAGE_CHARACTERS`; at least one user
message is required. The response is Server-Sent Events. A newly created
conversation ID is returned in `X-Conversation-Id`; send it as
`conversation_id` on later requests.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/conversations?page=1&limit=25&q=term&folder_id={uuid}&pinned=true` | List the authenticated user's conversations and optional filters. |
| GET | `/v1/conversations/{uuid}/messages?limit=100` | Read messages from an owned conversation. |
| PATCH | `/v1/conversations/{uuid}` | Rename with `{"title":"..."}`. |
| PATCH | `/v1/conversations/{uuid}/pin` | Set pin state with `{"pinned":true}`. |
| PATCH | `/v1/conversations/{uuid}/folder` | Assign with `{"folder_id":"{uuid}"}` or clear with `{"folder_id":null}`. |
| DELETE | `/v1/conversations/{uuid}` | Archive an owned conversation. |
| GET, POST | `/v1/conversation-folders` | List or create a folder with `{"name":"..."}`. |
| PATCH, DELETE | `/v1/conversation-folders/{uuid}` | Rename or delete a folder. |

Conversation list pagination uses `page` and `limit`; the maximum limit is 100.
Conversation and folder ownership is scoped to the verified subject.

## User preferences

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/preferences` | Read this subject's preferences (defaults when none are saved). |
| PATCH | `/v1/preferences` | Update one or more of `locale`, `theme_mode`, `default_model`. |
| DELETE | `/v1/preferences` | Reset this subject's saved preferences. |

`theme_mode` is `system`, `light`, or `dark`. `default_model` must be in the
server's enabled model allowlist. Empty updates and unknown JSON properties are
rejected.

## Image generation

`POST /v1/images/generations` accepts
`{"prompt":"A small red kite in a blue sky","size":"1024x1024"}`. Supported
sizes are `1024x1024`, `1536x1024`, and `1024x1536`; prompt length is at most
4,000 characters. The endpoint requires authentication and consumes the
configured per-subject chat quota. Provider credentials remain on the server.
When no image credential is configured, the endpoint returns 503 with code
`image_provider_not_configured`.

## Administrator endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/admin/feature-flags` | List feature flags. |
| GET | `/v1/admin/feature-flags/audit?limit=50` | Read recent flag audit entries. |
| POST | `/v1/admin/feature-flags` | Create `{ "key":"...", "description":"...", "enabled":false }`. |
| PATCH | `/v1/admin/feature-flags/{key}` | Change `{ "enabled":true }`. |
| DELETE | `/v1/admin/feature-flags/{key}` | Delete a flag. |
| GET | `/v1/admin/records?limit=20&cursor={cursor}` | Read records using opaque cursor pagination. |
| GET | `/v1/admin/records/{id}` | Read one record. |
| PUT | `/v1/admin/records/{id}` | Upsert `{ "createdAt":"2026-10-25T00:00:00Z" }`. |
| DELETE | `/v1/admin/records/{id}` | Delete a record. |

Admin record IDs are 1–128 printable characters. Record page limits are 1–100.
Responses use `{ "data": [...] , "next_cursor": "..." }` for lists and
`{ "data": {...} }` for a single record. The cursor is opaque to clients.

## Catalog

The optional product catalog is a separate public, read-only API. It does not
turn the chat application into a checkout or order system.

| Method | Path | Purpose |
|---|---|---|
| GET | `/v1/store/categories` | List active categories. |
| GET | `/v1/store/products?q=phone&category=mobiles&sort=popular&page=1&limit=24` | Search, filter, sort, and page in-stock products. |
| GET | `/v1/store/products/{slug}` | Read an active, in-stock product. |

Sort values are `popular`, `price_asc`, `price_desc`, and `newest`; page size
is at most 48. Prices are integer INR paise.

## Errors and request correlation

Errors have the form:

```json
{
  "error": {
    "code": "validation_error",
    "message": "The request contains invalid fields.",
    "request_id": "..."
  }
}
```

Validation failures return 400; missing/invalid authentication returns 401;
insufficient administrator access returns 403; missing resources return 404;
quota exhaustion returns 429; unavailable dependencies or providers return 503.
Every response receives an `X-Request-Id` header. Do not rely on error messages
as machine-readable identifiers; use `error.code`.
