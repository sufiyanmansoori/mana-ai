# Mana AI Flutter app

This directory contains the Mana AI chat client and its generated Android,
iOS, web, Windows, and macOS host projects.

From this directory, run `flutter pub get`, `flutter analyze`, and
`flutter test`. For project scope and integration details, see the
[workspace README](../../README.md).

## Run the chat app

Start the local Flutter app:

```powershell
flutter pub get
flutter run -d chrome
```

The app opens in local preview mode by default. To connect it to the development
API, start the API and pass its URL:

```powershell
flutter run -d chrome --dart-define=API_BASE_URL=http://127.0.0.1:3000
```

For an Android emulator, use `http://10.0.2.2:3000` as the API URL. The web
client must run on an origin permitted by the API's `API_CORS_ORIGINS`.

## Install the web app

Do not open `web/index.html` directly from File Explorer. Browsers only allow
web-app installation from a secure origin: use the local Flutter server above
(`localhost`) or deploy the built web app over HTTPS. In Chrome, use the
install icon in the address bar or **Menu > Cast, save, and share > Install
page as app**. The installed name and icon come from `web/manifest.json` and
its referenced PNG files. If an older install still shows stale branding,
uninstall it and install Mana AI again after deploying the updated files.
