// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Turkish (`tr`).
class AppLocalizationsTr extends AppLocalizations {
  AppLocalizationsTr([String locale = 'tr']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Yerel başlangıç sürümü';

  @override
  String get composerHint => 'Mana AI\'ye mesaj gönder';

  @override
  String get sendMessage => 'Mesaj gönder';

  @override
  String get stopGeneration => 'Üretimi durdur';

  @override
  String get chatEmpty => 'Mana AI ile bir sohbet başlatın.';

  @override
  String get localDataNotice =>
      'Mesajlar yalnızca bu oturumda tutulur. Bağlı bir sunucu yok.';

  @override
  String get dismiss => 'Kapat';

  @override
  String get invalidMessage =>
      'Mesaj gönderilemedi. Uzunluğunu ve içeriğini kontrol edin.';
}
