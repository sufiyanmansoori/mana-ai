// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Vietnamese (`vi`).
class AppLocalizationsVi extends AppLocalizations {
  AppLocalizationsVi([String locale = 'vi']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Bản khởi đầu cục bộ';

  @override
  String get composerHint => 'Nhắn tin cho Mana AI';

  @override
  String get sendMessage => 'Gửi tin nhắn';

  @override
  String get stopGeneration => 'Dừng tạo phản hồi';

  @override
  String get chatEmpty => 'Bắt đầu cuộc trò chuyện với Mana AI.';

  @override
  String get localDataNotice =>
      'Tin nhắn chỉ tồn tại trong phiên này. Chưa kết nối máy chủ.';

  @override
  String get dismiss => 'Đóng';

  @override
  String get invalidMessage =>
      'Không thể gửi tin nhắn. Hãy kiểm tra độ dài và nội dung.';
}
