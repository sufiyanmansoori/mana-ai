abstract interface class BackgroundTaskService {
  Future<void> registerPeriodic({
    required String uniqueName,
    required Duration interval,
    required Future<void> Function() task,
  });

  Future<void> cancel(String uniqueName);
}