abstract interface class DownloadService {
  Future<Uri> download(
    Uri source, {
    required String suggestedFileName,
    required int maximumBytes,
  });

  Future<void> cancel(String downloadId);
}