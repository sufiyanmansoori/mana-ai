// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for French (`fr`).
class AppLocalizationsFr extends AppLocalizations {
  AppLocalizationsFr([String locale = 'fr']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Version locale de démarrage';

  @override
  String get composerHint => 'Envoyer un message à Mana AI';

  @override
  String get sendMessage => 'Envoyer le message';

  @override
  String get stopGeneration => 'Arrêter la génération';

  @override
  String get chatEmpty => 'Commencez une conversation avec Mana AI.';

  @override
  String get localDataNotice =>
      'Les messages restent dans cette session. Aucun serveur n’est connecté.';

  @override
  String get dismiss => 'Fermer';

  @override
  String get invalidMessage =>
      'Le message n’a pas pu être envoyé. Vérifiez sa longueur et son contenu.';
}
