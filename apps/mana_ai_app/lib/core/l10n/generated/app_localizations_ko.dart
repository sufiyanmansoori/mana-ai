// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Korean (`ko`).
class AppLocalizationsKo extends AppLocalizations {
  AppLocalizationsKo([String locale = 'ko']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => '로컬 시작 버전';

  @override
  String get composerHint => 'Mana AI에 메시지 보내기';

  @override
  String get sendMessage => '메시지 보내기';

  @override
  String get stopGeneration => '생성 중지';

  @override
  String get chatEmpty => 'Mana AI와 대화를 시작하세요.';

  @override
  String get localDataNotice => '메시지는 현재 세션에만 보관됩니다. 서버가 연결되지 않았습니다.';

  @override
  String get dismiss => '닫기';

  @override
  String get invalidMessage => '메시지를 보낼 수 없습니다. 길이와 내용을 확인하세요.';
}
