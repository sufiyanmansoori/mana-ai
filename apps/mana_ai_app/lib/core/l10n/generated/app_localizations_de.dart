// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for German (`de`).
class AppLocalizationsDe extends AppLocalizations {
  AppLocalizationsDe([String locale = 'de']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Lokale Startversion';

  @override
  String get composerHint => 'Nachricht an Mana AI';

  @override
  String get sendMessage => 'Nachricht senden';

  @override
  String get stopGeneration => 'Generierung stoppen';

  @override
  String get chatEmpty => 'Beginne eine Unterhaltung mit Mana AI.';

  @override
  String get localDataNotice =>
      'Nachrichten bleiben in dieser Sitzung. Es ist kein Server verbunden.';

  @override
  String get dismiss => 'Schließen';

  @override
  String get invalidMessage =>
      'Die Nachricht konnte nicht gesendet werden. Prüfe Länge und Inhalt.';
}
