// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'نسخة تجريبية محلية';

  @override
  String get composerHint => 'أرسل رسالة إلى Mana AI';

  @override
  String get sendMessage => 'إرسال الرسالة';

  @override
  String get stopGeneration => 'إيقاف التوليد';

  @override
  String get chatEmpty => 'ابدأ محادثة مع Mana AI.';

  @override
  String get localDataNotice =>
      'تبقى الرسائل في هذه الجلسة فقط. لا يوجد خادم متصل.';

  @override
  String get dismiss => 'إغلاق';

  @override
  String get invalidMessage => 'تعذر إرسال الرسالة. تحقق من طولها ومحتواها.';
}
