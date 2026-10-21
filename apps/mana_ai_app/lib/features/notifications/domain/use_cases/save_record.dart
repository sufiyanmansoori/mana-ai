import 'package:mana_ai_app/features/notifications/domain/entities/record.dart';
import 'package:mana_ai_app/features/notifications/domain/repositories/feature_repository.dart';

final class NotificationsSaveRecord {
  const NotificationsSaveRecord(this._repository);

  final NotificationsFeatureRepository _repository;

  Future<void> call(NotificationsRecord record) => _repository.save(record);
}
