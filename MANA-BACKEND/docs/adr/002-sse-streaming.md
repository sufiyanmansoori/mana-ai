# ADR 002: Server-Sent Events for streamed chat

- Status: Accepted
- Date: 2026-10-26

## Context

Model responses arrive incrementally. Buffering the full answer would increase
perceived latency and memory use. Chat requires server-to-client delivery;
clients already submit each turn through HTTP.

## Decision

Use an authenticated HTTP request with a Server-Sent Events response for chat
completion streams. Parse upstream provider streams in server-side adapters,
normalize events, enforce time/output limits, and persist the completed turn
only after a successful terminal event.

## Consequences

- Clients receive text as it is generated using broadly supported HTTP
  streaming.
- The API must handle cancellation, disconnected clients, incomplete provider
  streams, and proxy buffering/timeouts.
- The current protocol is not bidirectional; use a separate design review
  before introducing WebSockets or resumable streams.
