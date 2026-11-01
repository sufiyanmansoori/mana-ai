abstract interface class NotificationService {
  Future<void> initialize();

  Future<String?> requestPermission();

  Future<void> show({
    required String title,
    required String body,
    String? payload,
  });

  Future<void> cancelAll();
}