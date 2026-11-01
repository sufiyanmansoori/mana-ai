// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Chinese (`zh`).
class AppLocalizationsZh extends AppLocalizations {
  AppLocalizationsZh([String locale = 'zh']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => '本地起始版本';

  @override
  String get composerHint => '给 Mana AI 发送消息';

  @override
  String get sendMessage => '发送消息';

  @override
  String get stopGeneration => '停止生成';

  @override
  String get chatEmpty => '开始与 Mana AI 对话。';

  @override
  String get localDataNotice => '消息仅保留在当前会话中。尚未连接服务器。';

  @override
  String get dismiss => '关闭';

  @override
  String get invalidMessage => '消息未能发送。请检查其长度和内容。';
}
