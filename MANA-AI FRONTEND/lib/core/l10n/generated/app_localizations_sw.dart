// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Swahili (`sw`).
class AppLocalizationsSw extends AppLocalizations {
  AppLocalizationsSw([String locale = 'sw']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Toleo la mwanzo la ndani';

  @override
  String get composerHint => 'Tuma ujumbe kwa Mana AI';

  @override
  String get sendMessage => 'Tuma ujumbe';

  @override
  String get stopGeneration => 'Simamisha utengenezaji';

  @override
  String get chatEmpty => 'Anza mazungumzo na Mana AI.';

  @override
  String get localDataNotice =>
      'Ujumbe hubaki kwenye kipindi hiki pekee. Hakuna seva iliyounganishwa.';

  @override
  String get dismiss => 'Funga';

  @override
  String get invalidMessage =>
      'Ujumbe haukutumwa. Angalia urefu na maudhui yake.';
}
