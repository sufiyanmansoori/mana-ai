// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Panjabi Punjabi (`pa`).
class AppLocalizationsPa extends AppLocalizations {
  AppLocalizationsPa([String locale = 'pa']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'ਸਥਾਨਕ ਸ਼ੁਰੂਆਤੀ ਸੰਸਕਰਣ';

  @override
  String get composerHint => 'Mana AI ਨੂੰ ਸੁਨੇਹਾ ਭੇਜੋ';

  @override
  String get sendMessage => 'ਸੁਨੇਹਾ ਭੇਜੋ';

  @override
  String get stopGeneration => 'ਜਵਾਬ ਬਣਾਉਣਾ ਰੋਕੋ';

  @override
  String get chatEmpty => 'Mana AI ਨਾਲ ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰੋ।';

  @override
  String get localDataNotice =>
      'ਸੁਨੇਹੇ ਸਿਰਫ਼ ਇਸ ਸੈਸ਼ਨ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ। ਕੋਈ ਸਰਵਰ ਜੁੜਿਆ ਨਹੀਂ ਹੈ।';

  @override
  String get dismiss => 'ਬੰਦ ਕਰੋ';

  @override
  String get invalidMessage =>
      'ਸੁਨੇਹਾ ਨਹੀਂ ਭੇਜਿਆ ਜਾ ਸਕਿਆ। ਇਸਦੀ ਲੰਬਾਈ ਅਤੇ ਸਮੱਗਰੀ ਜਾਂਚੋ।';
}
