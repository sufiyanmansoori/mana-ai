# Testing

The API uses Node's test runner through `tsx`. Tests use injected providers,
repositories, and local HTTP servers; the normal unit and integration suites do
not require external provider credentials.

## Local commands

Run from the repository root:

```powershell
npm ci
npm run lint --workspace=@mana-ai/api
npm run typecheck --workspace=@mana-ai/api
npm run test:unit --workspace=@mana-ai/api
npm run test:integration --workspace=@mana-ai/api
npm test --workspace=@mana-ai/api
npm run build --workspace=@mana-ai/api
```

`test:unit` covers configuration/token rules, SQL parameterization and query
ownership, provider adapters, and SSE parsing. `test:integration` exercises
authenticated Express routes with injected test dependencies, including chat,
images, feature flags, and admin records. These route tests are not a substitute
for running against a real database.

## End-to-end test

The `test-e2e.yml` workflow starts an ephemeral PostgreSQL service, applies all
migrations, builds the API, starts the compiled server, and verifies health,
development authentication, subject lookup, and admin-record listing. It does
not call external AI providers. The workflow also builds the production Docker
image from the repository-root context.

## Adding tests

- Cover validation boundaries and malformed upstream responses.
- Verify authentication and authorization independently.
- Assert SQL values are parameterized and user-scoped.
- Test stream completion, cancellation, and provider failures.
- Use fake providers/repositories for deterministic unit tests.
- Add a database-backed end-to-end assertion when a behavior depends on actual
  PostgreSQL semantics or migrations.
- Never place real tokens or provider keys in fixtures.
