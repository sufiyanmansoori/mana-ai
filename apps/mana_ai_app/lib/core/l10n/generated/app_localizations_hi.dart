// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Hindi (`hi`).
class AppLocalizationsHi extends AppLocalizations {
  AppLocalizationsHi([String locale = 'hi']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'स्थानीय प्रारंभिक संस्करण';

  @override
  String get composerHint => 'Mana AI को संदेश भेजें';

  @override
  String get sendMessage => 'संदेश भेजें';

  @override
  String get stopGeneration => 'जवाब बनाना रोकें';

  @override
  String get chatEmpty => 'Mana AI के साथ बातचीत शुरू करें।';

  @override
  String get localDataNotice =>
      'संदेश केवल इस सत्र में रहते हैं। कोई सर्वर कनेक्ट नहीं है।';

  @override
  String get dismiss => 'खारिज करें';

  @override
  String get invalidMessage =>
      'संदेश नहीं भेजा जा सका। उसकी लंबाई और सामग्री जाँचें।';
}
