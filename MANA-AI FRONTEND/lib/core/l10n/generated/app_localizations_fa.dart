// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Persian (`fa`).
class AppLocalizationsFa extends AppLocalizations {
  AppLocalizationsFa([String locale = 'fa']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'نسخه آغازین محلی';

  @override
  String get composerHint => 'برای Mana AI پیام بنویسید';

  @override
  String get sendMessage => 'ارسال پیام';

  @override
  String get stopGeneration => 'توقف تولید';

  @override
  String get chatEmpty => 'گفت‌وگویی با Mana AI شروع کنید.';

  @override
  String get localDataNotice =>
      'پیام‌ها فقط در این نشست باقی می‌مانند. هیچ سروری متصل نیست.';

  @override
  String get dismiss => 'بستن';

  @override
  String get invalidMessage => 'پیام ارسال نشد. طول و محتوای آن را بررسی کنید.';
}
