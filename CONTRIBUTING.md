# Contributing

## Before making a change

1. Check the open issue or create one describing the user-visible outcome.
2. Keep features within package boundaries and add tests for changed behavior.
3. Never commit credentials, user data, build output, or local environment
   files.

## Local checks

Use Node.js 22 LTS, npm 10+, Flutter stable, and Dart 3.6+.

```sh
npm ci
npm run verify
```

For Flutter-only work:

```sh
cd apps/mana_ai_app
flutter pub get
flutter analyze
flutter test
```

Describe behavior, security/privacy implications, and migrations in pull
requests. Keep each source/configuration file below 500 lines and split cohesive
code rather than growing oversized files. Update operator documentation when
deployment or recovery behavior changes. Do not label an integration
production-ready until its authorization, failure paths, observability, and
release tests exist.

Do not publish suspected vulnerability details in an issue. Follow
[SECURITY.md](./SECURITY.md).
