// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Local starter';

  @override
  String get composerHint => 'Message Mana AI';

  @override
  String get sendMessage => 'Send message';

  @override
  String get stopGeneration => 'Stop generation';

  @override
  String get chatEmpty => 'Start a conversation with Mana AI.';

  @override
  String get localDataNotice =>
      'Messages stay in this session. No server is connected.';

  @override
  String get dismiss => 'Dismiss';

  @override
  String get invalidMessage =>
      'The message could not be sent. Check its length and content.';
}
