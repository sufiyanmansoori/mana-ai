// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Bengali Bangla (`bn`).
class AppLocalizationsBn extends AppLocalizations {
  AppLocalizationsBn([String locale = 'bn']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'স্থানীয় প্রাথমিক সংস্করণ';

  @override
  String get composerHint => 'Mana AI-কে বার্তা পাঠান';

  @override
  String get sendMessage => 'বার্তা পাঠান';

  @override
  String get stopGeneration => 'উত্তর তৈরি বন্ধ করুন';

  @override
  String get chatEmpty => 'Mana AI-এর সঙ্গে একটি কথোপকথন শুরু করুন।';

  @override
  String get localDataNotice =>
      'বার্তাগুলো শুধু এই সেশনেই থাকে। কোনো সার্ভার সংযুক্ত নেই।';

  @override
  String get dismiss => 'বন্ধ করুন';

  @override
  String get invalidMessage =>
      'বার্তাটি পাঠানো যায়নি। এর দৈর্ঘ্য ও বিষয়বস্তু পরীক্ষা করুন।';
}
