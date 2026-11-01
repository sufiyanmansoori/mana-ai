// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Italian (`it`).
class AppLocalizationsIt extends AppLocalizations {
  AppLocalizationsIt([String locale = 'it']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Versione iniziale locale';

  @override
  String get composerHint => 'Scrivi a Mana AI';

  @override
  String get sendMessage => 'Invia messaggio';

  @override
  String get stopGeneration => 'Interrompi la generazione';

  @override
  String get chatEmpty => 'Inizia una conversazione con Mana AI.';

  @override
  String get localDataNotice =>
      'I messaggi restano in questa sessione. Nessun server è connesso.';

  @override
  String get dismiss => 'Chiudi';

  @override
  String get invalidMessage =>
      'Impossibile inviare il messaggio. Controlla lunghezza e contenuto.';
}
