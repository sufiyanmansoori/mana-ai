// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Indonesian (`id`).
class AppLocalizationsId extends AppLocalizations {
  AppLocalizationsId([String locale = 'id']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Versi awal lokal';

  @override
  String get composerHint => 'Kirim pesan ke Mana AI';

  @override
  String get sendMessage => 'Kirim pesan';

  @override
  String get stopGeneration => 'Hentikan pembuatan';

  @override
  String get chatEmpty => 'Mulai percakapan dengan Mana AI.';

  @override
  String get localDataNotice =>
      'Pesan hanya tersimpan dalam sesi ini. Tidak ada server yang terhubung.';

  @override
  String get dismiss => 'Tutup';

  @override
  String get invalidMessage =>
      'Pesan tidak dapat dikirim. Periksa panjang dan isinya.';
}
