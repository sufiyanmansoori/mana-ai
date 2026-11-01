// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Urdu (`ur`).
class AppLocalizationsUr extends AppLocalizations {
  AppLocalizationsUr([String locale = 'ur']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'مقامی ابتدائی ورژن';

  @override
  String get composerHint => 'Mana AI کو پیغام بھیجیں';

  @override
  String get sendMessage => 'پیغام بھیجیں';

  @override
  String get stopGeneration => 'جواب بنانا روکیں';

  @override
  String get chatEmpty => 'Mana AI کے ساتھ گفتگو شروع کریں۔';

  @override
  String get localDataNotice =>
      'پیغامات صرف اسی سیشن میں رہتے ہیں۔ کوئی سرور منسلک نہیں ہے۔';

  @override
  String get dismiss => 'بند کریں';

  @override
  String get invalidMessage =>
      'پیغام نہیں بھیجا جا سکا۔ اس کی لمبائی اور مواد چیک کریں۔';
}
