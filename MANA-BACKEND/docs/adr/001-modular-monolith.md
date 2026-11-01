# ADR 001: Modular monolith

- Status: Accepted
- Date: 2026-10-26

## Context

Mana AI currently has a small set of related API capabilities owned and
released together. Splitting each route group into a network service would add
deployment, authentication, observability, and data-consistency overhead
without a demonstrated scaling or ownership need.

## Decision

Keep one deployable API and organize it into bounded TypeScript modules:
authentication, chat, images, preferences, administration, catalog, database,
and shared middleware. Keep provider and repository boundaries injectable so
tests can replace external dependencies.

## Consequences

- One build, image, and migration sequence is operationally simpler.
- Modules can evolve behind stable interfaces without premature network
  boundaries.
- The process and database remain shared capacity and failure domains.
- Extract a service only when independent ownership, scaling, isolation, or
  compliance needs justify the additional operational cost.
