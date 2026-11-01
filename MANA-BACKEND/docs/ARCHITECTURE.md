# Architecture

## Current system

Mana AI API is a Node.js 22, TypeScript, Express 5 modular monolith. One HTTP
process hosts authentication, chat, conversation management, preferences,
image generation, administrator tools, and the optional read-only catalog.
PostgreSQL is the durable system of record. There are no independently
deployed feature services or message brokers in the current implementation.

```text
Flutter / trusted clients
        |
        v
Express app: middleware -> authenticated routes -> services/providers
        |                                  |
        v                                  v
PostgreSQL (pg pool)                 external AI providers
```

## Module boundaries

- `src/app.ts` constructs the HTTP application and injects shared dependencies.
- `src/auth` verifies local development tokens or OIDC JWTs and establishes the
  trusted request subject.
- `src/chat` owns conversation/message persistence, quota checks, request
  validation, SSE response handling, and provider selection.
- `src/ai` contains provider adapters and reusable prompt, guardrail, routing,
  token-estimation, retrieval, streaming, speech, vision, and tool primitives.
  Only providers and features selected/configured by runtime wiring are active.
- `src/images` validates image requests and adapts the configured provider.
- `src/preferences`, `src/admin`, and `src/store` contain route/schema and
  persistence modules for their bounded features.
- `src/db` owns the PostgreSQL pool, ordered SQL migrations, and seed data.
- `src/middleware` handles request IDs, structured request logs, and safe
  error responses.

Routes depend on repository/provider ports or injected implementations where
testability and isolation are needed. SQL repositories use parameterized
queries. Express error middleware maps expected API errors and validation
failures to stable response envelopes.

## Data ownership and consistency

Conversations, messages, folders, rate-limit windows, user preferences,
feature-flag state/audit entries, administrator records, and catalog data are
stored in PostgreSQL. Conversation queries are scoped by the verified subject.
Flag changes and their audit rows are committed together. Database schema
changes are versioned under `src/db/migrations` and applied by the migration
command, not implicitly at API startup.

AI provider credentials are configuration secrets and never belong in Flutter
or database records. External model generation is performed by server-side
provider adapters. Successful chat turns are persisted only after generation
completes; interrupted responses are not stored as completed turns.

## Runtime behavior

The process exposes liveness and PostgreSQL readiness probes. The PostgreSQL
pool is shared by repositories. Shutdown stops accepting HTTP requests and
closes the pool with a bounded grace period. The server periodically removes
expired rate-limit window rows and logs cleanup errors.

Chat responses use SSE. Request IDs correlate response headers and structured
logs. Error responses avoid returning internal exception details.

## Deliberate limits

This is a modular monolith, not a microservice deployment. The current database
does not enable `pgvector` or create the `ai_document_chunks` table expected by
the optional pgvector adapter; database-backed RAG is not enabled. The
catalog is public and read-only: cart, checkout, orders, payments, tax, shipping,
and returns are not implemented.

## Related decisions

- [ADR 001: Modular monolith](./adr/001-modular-monolith.md)
- [ADR 002: SSE streaming](./adr/002-sse-streaming.md)
- [ADR 003: PostgreSQL and deferred pgvector](./adr/003-postgres-pgvector.md)
