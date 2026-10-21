# Cross-platform commands are also available through scripts/check.ps1.
.PHONY: bootstrap verify flutter-check node-check web-build

bootstrap:
	npm ci
	cd apps/mana_ai_app && flutter pub get

flutter-check:
	cd apps/mana_ai_app && flutter analyze && flutter test

node-check:
	npm test
	npm run typecheck

web-build:
	cd apps/mana_ai_app && flutter build web --release

verify: node-check flutter-check web-build