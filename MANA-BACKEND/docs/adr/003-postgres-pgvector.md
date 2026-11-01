# ADR 003: PostgreSQL as system of record; defer pgvector

- Status: Accepted (PostgreSQL); deferred (pgvector)
- Date: 2026-10-26

## Context

The API needs transactional conversation storage, ownership constraints,
preferences, audit records, quotas, and catalog queries. Semantic/vector
retrieval is not currently implemented, and there is no measured embedding
workload or vector schema to support.

## Decision

Use PostgreSQL as the durable system of record and manage schema through
versioned SQL migrations. Do not install or enable the pgvector extension yet.
Revisit vector storage when a scoped retrieval feature has a defined embedding
provider, dimensions, indexing strategy, retention policy, and evaluation set.

## Consequences

- The current deployment needs a PostgreSQL service, backups, and migration
  discipline.
- Relational constraints and transactions cover present application needs.
- No vector search capability is implied by this decision or current schema.
- A future pgvector migration must verify extension availability in the target
  managed PostgreSQL service and benchmark index/query behavior before rollout.
