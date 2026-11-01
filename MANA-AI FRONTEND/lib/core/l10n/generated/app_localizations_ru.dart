// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Russian (`ru`).
class AppLocalizationsRu extends AppLocalizations {
  AppLocalizationsRu([String locale = 'ru']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Локальная стартовая версия';

  @override
  String get composerHint => 'Сообщение для Mana AI';

  @override
  String get sendMessage => 'Отправить сообщение';

  @override
  String get stopGeneration => 'Остановить генерацию';

  @override
  String get chatEmpty => 'Начните разговор с Mana AI.';

  @override
  String get localDataNotice =>
      'Сообщения хранятся только в этом сеансе. Сервер не подключён.';

  @override
  String get dismiss => 'Закрыть';

  @override
  String get invalidMessage =>
      'Не удалось отправить сообщение. Проверьте его длину и содержимое.';
}
