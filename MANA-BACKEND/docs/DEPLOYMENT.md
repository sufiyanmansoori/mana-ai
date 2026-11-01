# Deployment

## Requirements

- Node.js 22.13 or newer and npm 10 or newer for non-container operation.
- PostgreSQL supported by the current SQL migrations.
- A managed secret store and TLS termination for production.
- A server-side AI provider key only when chat/image generation is enabled.

## Environment configuration

Start from `apps/mana_ai_api/.env.example` for local work. In production,
provide environment variables through the platform secret/configuration system;
do not bake `.env` files or provider keys into the image.

Production requires:

- `NODE_ENV=production`
- `DATABASE_URL` for a private PostgreSQL endpoint
- `DATABASE_SSL=require`
- `OIDC_ISSUER_URL`, `OIDC_JWKS_URL`, and `OIDC_AUDIENCE`
- one or more exact trusted subject IDs in `ADMIN_SUBJECTS`

Set `API_HOST=0.0.0.0` inside a container. Set `API_CORS_ORIGINS` to explicit
browser origins. Configure AI models and keys according to
`apps/mana_ai_api/.env.example`; keys stay server-side. Image generation
requires an image-capable configured credential.

The chat adapter registry supports OpenAI, OpenAI-compatible APIs, Anthropic,
Azure OpenAI, Cohere, Gemini, Groq, Mistral, and Ollama. Configure only the
provider selected by `AI_PROVIDER`; Azure additionally requires its resource
URL and API version. Ollama's default endpoint is loopback and is suitable for
local development only; production deployments must configure a trusted
reachable HTTPS endpoint.

## Container build and run

The Docker build context is the repository root because the image consumes the
root npm workspace manifest and lockfile:

```powershell
docker build -f apps/mana_ai_api/Dockerfile -t mana-ai-api:local .
```

Run migrations as a separate deployment step, using the same application
revision and database configuration:

```powershell
npm ci
npm run migrate --workspace=@mana-ai/api
```

Then deploy the image with the required environment variables and publish
container port 3000 behind a TLS ingress. The image runs as the unprivileged
`node` user. Do not expose the database publicly.

## Release sequence

1. Review the schema changes and backup/restore readiness.
2. Deploy additive, backward-compatible migrations before the API rollout.
3. Roll out the immutable image and observe readiness, error rates, and logs.
4. Roll back application code if needed; forward-fix migrations unless the
   migration has a separately reviewed, tested reversal plan.
5. Record the deployed revision and migration versions.

Migrations use a PostgreSQL advisory lock and record applied versions. Back up
the database before production migration changes. Test restoration, retention,
and deletion procedures in the target environment; this repository does not
provision those cloud policies.

## Health checks and scaling

Use `GET /health/live` for process liveness and `GET /health/ready` for database
readiness. Readiness requires a successful PostgreSQL query. Set shutdown grace
periods to at least the server's 15-second graceful-shutdown timeout. Add
replicas only with a shared database, shared ingress/rate limiting policy, and
capacity planning for the configured pool size.

There is no checked-in production Compose or cloud deployment manifest.
Infrastructure-specific networking, secret management, TLS, backups, and
autoscaling must be supplied by the deployment environment.
