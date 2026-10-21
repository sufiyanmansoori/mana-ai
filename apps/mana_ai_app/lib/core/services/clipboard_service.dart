import 'package:flutter/services.dart';

abstract interface class ClipboardService {
  Future<void> writeText(String text);

  Future<String?> readText();
}

final class PlatformClipboardService implements ClipboardService {
  const PlatformClipboardService();

  @override
  Future<void> writeText(String text) async {
    await Clipboard.setData(ClipboardData(text: text));
  }

  @override
  Future<String?> readText() async {
    final data = await Clipboard.getData(Clipboard.kTextPlain);
    return data?.text;
  }
}