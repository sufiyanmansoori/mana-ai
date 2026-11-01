import 'package:mana_ai_app/features/notifications/domain/entities/record.dart';

abstract interface class NotificationsLocalDataSource {
  Future<List<NotificationsRecord>> readAll();

  Future<NotificationsRecord?> getById(String id);

  Future<void> save(NotificationsRecord record);

  Future<void> delete(String id);
}
