// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Japanese (`ja`).
class AppLocalizationsJa extends AppLocalizations {
  AppLocalizationsJa([String locale = 'ja']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'ローカルスターター';

  @override
  String get composerHint => 'Mana AI にメッセージを送信';

  @override
  String get sendMessage => 'メッセージを送信';

  @override
  String get stopGeneration => '生成を停止';

  @override
  String get chatEmpty => 'Mana AI との会話を始めましょう。';

  @override
  String get localDataNotice => 'メッセージはこのセッション内にのみ保存されます。サーバーは未接続です。';

  @override
  String get dismiss => '閉じる';

  @override
  String get invalidMessage => 'メッセージを送信できませんでした。長さと内容を確認してください。';
}
