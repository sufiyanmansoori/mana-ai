abstract interface class ShareService {
  Future<void> shareText(String text, {String? subject});

  Future<void> shareFile(Uri fileUri, {String? text});
}