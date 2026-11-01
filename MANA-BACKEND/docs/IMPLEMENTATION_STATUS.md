# Backend implementation status

The requested backend blueprint describes a planned system, not an existing
1,000-file implementation. The actual backend is a Node.js 22, TypeScript
modular monolith using Express 5, PostgreSQL, Zod, Pino, and Node's test
runner. This status tracks implemented behavior rather than planned filenames.

## Phase 1: bootstrap and runtime foundations

- [x] Validate environment configuration at startup and enforce production
  authentication and TLS requirements.
- [x] Create a bounded PostgreSQL connection pool with connection timeouts.
- [x] Provide structured Pino logging with credential redaction.
- [x] Attach a server-generated request ID and log HTTP completion metadata.
- [x] Apply Helmet, explicit CORS policy, and a bounded strict JSON parser.
- [x] Return consistent client-safe errors without exposing internal stack
  traces.
- [x] Provide public liveness and database-backed readiness probes.
- [x] Gracefully close the HTTP server and PostgreSQL pool on shutdown.
- [x] Exercise health, CORS, request-ID, and security-header behavior in tests.
- [x] Provide a safe test environment template; normal automated tests use
  injected dependencies and do not require a live database.
- [x] Split runtime configuration into 19 validated, typed configuration
  modules and wire core app, auth, AI, database, logging, CORS, and image
  feature settings into the runtime.
- [x] Add 12 shared constants modules and use them for runtime limits, model
  IDs, locale validation, permissions, API errors, store cache headers, and
  administrative audit actions.

## Remaining implementation

- [ ] Complete authentication lifecycle: user credentials, verification and
  reset flows, refresh-token rotation/reuse detection, and session revocation.
- [ ] Add permission policies and object-level authorization for each private
  resource.
- [ ] Expand chat persistence and streaming lifecycle: idempotency, cancellation,
  durable event replay, and concurrent request handling.
- [ ] Wire prompt, routing, token-estimation, moderation, speech, vision, and
  tool utilities into authenticated chat flows with explicit per-model policy.
- [ ] Add configurable model capability/pricing data, provider retry and
  circuit-breaker policy, usage accounting, and provider-specific moderation.
- [ ] Add reviewed database migrations for the pgvector extension and
  owner-scoped `ai_document_chunks` table before enabling PostgreSQL RAG.
- [ ] Implement private attachment storage and safe document parsing before
  exposing RAG, uploaded-file tools, or code-interpreter features.
- [ ] Implement remaining product modules only as their API, data ownership,
  authorization, migrations, and tests are defined.
- [ ] Add isolated disposable-PostgreSQL end-to-end coverage and verify the
  deployment workflows in CI.

## Architecture notes

- PostgreSQL is the relational source of truth. The current migrations do not
  enable pgvector; the vector/RAG work remains deferred.
- The existing implementation is TypeScript with Node's built-in test runner,
  not JavaScript with Jest. Keep the established stack unless a concrete
  migration requirement is approved.
- Redis, BullMQ, Kubernetes, and Terraform are not prerequisites for the
  current API and must not be represented as active runtime capabilities until
  they are implemented and tested.
- Production deployment still requires external operational controls such as
  managed secrets, TLS ingress, backup/restore verification, and configured
  identity-provider credentials.

## AI source-tree progress

The requested 52 TypeScript module paths now exist across providers,
guardrails, prompts, RAG, routing, speech, streaming, tokens, tools, and vision.
The shared provider registry can select OpenAI, OpenAI-compatible, Anthropic,
Azure OpenAI, Cohere, Gemini, Groq, Mistral, and Ollama adapters. Prompt,
guardrail, token, routing, streaming, RAG, speech, vision, and tool helpers
have focused unit tests.

These are tested library modules, not a claim that every AI capability is
enabled in chat. Heuristic jailbreak, injection, and PII checks are not
security boundaries; moderation, embeddings, speech, vision, and search
require configured provider implementations; the tiktoken adapter requires a
caller-provided encoding; the weighted balancer and replay buffer are
process-local. `PgVectorStore` expects an owner-scoped table and pgvector
extension that are not included in current migrations. Tool helpers are not
automatically exposed to model output, and code execution remains disabled
unless an isolated remote sandbox is supplied.

## Configuration source-tree progress

All 19 requested files exist under `src/config/`. Central `loadConfig` parses
the environment once and builds settings for app, auth, AI, CORS, database,
features, i18n, logging, mail, OAuth, observability, payments, queues, rate
limiting, Redis, security, and storage. Core settings drive the existing app,
database pool, logger, JWT verifier, and image feature gate. Other integrations
are validated typed configuration only; they do not imply implemented mail,
OAuth, billing, queue, Redis, telemetry, or storage clients.

## Constants source-tree progress

All 12 requested files exist under `src/constants/`. Runtime limits and model
IDs are shared with configuration and request schemas; roles and permissions
retain the existing exact-subject admin allowlist; cache TTLs describe HTTP
cache headers, while the cache-key helpers are not backed by a Redis cache.
Queue names and billing plan/status values are reserved domain constants and
do not enable queue workers or subscription processing.

## Core source-tree progress

The requested 82 core modules exist as TypeScript under `src/core/`, following
the repository's NodeNext/TypeScript conventions rather than adding parallel
JavaScript implementations. They provide reusable database, validation,
middleware, events, i18n, logging, security, queue, observability, and realtime
primitives. Optional Redis, compression, telemetry, and WebSocket integrations
require caller-provided adapters; in-memory rate limiting and token revocation
are process-local and are not substitutes for shared production infrastructure.

## Database blueprint progress

The requested 48-file database blueprint exists under `src/database/`: 39
ordered SQL migrations, six idempotent seed scripts, a TypeScript manifest,
and two explicitly optional extension scripts. These proposed migrations are
not registered with `src/db/migrate.ts` and are not applied by the API. They
preserve current conversation and preference ownership fields and backfill
external identity subjects before adding references. The admin seed requires
an explicit PostgreSQL session setting. Run migrations only after separately
reviewing and approving integration with the active database migration flow.
Billing, document retrieval, account lifecycle, notifications, and related
tables do not by themselves implement those API services.
