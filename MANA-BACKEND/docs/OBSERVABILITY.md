# Observability

## Structured logs

The API uses Pino JSON logs with service name `mana-ai-api` and a configurable
`LOG_LEVEL`. HTTP completion logs include request ID, method, path, response
status, and duration. Provider and database failures are logged as errors;
expected client errors are represented by stable API error codes.

Authorization, cookie, token, and API-key fields are redacted by the logger.
Never add request bodies, prompts, access tokens, provider credentials, or
other sensitive user content to routine logs. Review any new log fields for
privacy and cardinality before merging.

## Request correlation

Each request gets a server-generated UUID exposed as `X-Request-Id` and
included in error envelopes and request logs. Clients may use this identifier
when reporting failures; it is not an authentication credential.

## Health checks

- `GET /health/live` indicates that the process can serve requests.
- `GET /health/ready` checks connectivity to PostgreSQL and returns 503 when
  the dependency is unavailable.

Use liveness for restart decisions and readiness for load-balancer admission.
Do not use a provider generation request as a health probe.

## Metrics and alerts

The repository does not currently expose a Prometheus/OpenTelemetry metrics
endpoint or tracing exporter. Platform monitoring should collect container
CPU/memory/restarts and PostgreSQL connection/storage signals. Recommended
alerts include sustained readiness failures, elevated 5xx/429 rates, provider
timeouts, pool exhaustion, migration failures, and repeated graceful-shutdown
timeouts.

If metrics are introduced, avoid user IDs, conversation IDs, prompts, and
unbounded request paths as labels. Prefer bounded route names, status classes,
provider names, and latency buckets.

## Incident triage

Correlate the client-provided request ID with API logs, verify readiness and
database connectivity, then inspect provider status without copying credentials
or user prompts into tickets. Keep incident artifacts within approved
organizational storage and follow retention policy.
