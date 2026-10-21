# Mana AI

Mana AI is a Flutter-first assistant monorepo with a typed Node.js API and web
status console. The app lives in `apps/mana_ai_app/` and uses a feature-first
structure with reusable Dart packages.

## Current scope

- Responsive Material 3 chat interface with 20 configured locales and system
  light/dark themes.
- Local, in-memory chat messages with validated input and clear local-mode
  disclosure.
- Shared configuration validation, service registration, typed failures,
  pagination, retry rules, secure IDs, and an incremental SSE decoder.
- An authenticated Node.js/TypeScript API with PostgreSQL-backed conversation
  history, an OpenAI-compatible streaming adapter, and OIDC token verification.
- A local-only token issuer for development; production requires an external
  OIDC issuer, PostgreSQL TLS, and managed secrets.
- Unit, widget, API, and provider-stream tests plus a local PostgreSQL Compose
  stack.

The 22 client feature directories are architectural scaffolds; creating a
feature folder does not implement that product capability. The Flutter chat
remains a local demo and is not yet wired to the API. The API currently
implements authentication-token verification, chat streaming, model listing,
and conversation history only. You must configure a real OIDC provider and
AI-provider credentials before using those capabilities. Billing, OAuth login
flows, uploads, payments, and other provider/cloud integrations are not
implemented. Never ship the local token route or put secrets in client code,
build arguments, or `--dart-define`.

## Run the app

Install Flutter/Dart and Node.js 22 LTS/npm 10+, then from the repository root:

```sh
npm ci
npm run verify
```

Flutter can generate the platform host folders for your target with
`flutter create --platforms=<target> .`. Android, iOS, web, Windows, and macOS
host projects are included. Build targets still require their platform SDKs;
iOS and macOS builds require macOS.

Run the local Flutter demo:

```sh
cd apps/mana_ai_app
flutter pub get
flutter run -t lib/main_dev.dart
```

The API and local PostgreSQL can be started with
`docker compose --env-file .env -f infrastructure/docker/compose.yaml up
--build` after copying `.env.example` to `.env` and changing the development
password and local JWT secret. Set `AI_API_KEY` to enable actual model
responses. In development, obtain a test token from
`POST /v1/auth/dev-token`; this endpoint is disabled outside development. The
API exposes `/health/live` and `/health/ready`. The Flutter demo does not call
this API yet.

Read [API setup](./apps/mana_ai_api/README.md), [SECURITY.md](./SECURITY.md),
[deployment guidance](./docs/deployment.md), and the
[runbook](./docs/runbook.md) before deploying. Production secrets belong in a
managed secret store. No cloud provider is assumed.

Flutter checks can also be run independently:

```sh
cd apps/mana_ai_app
flutter analyze
flutter test
```
