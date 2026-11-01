import 'package:mana_ai_app/features/notifications/domain/entities/record.dart';
import 'package:mana_ai_app/features/notifications/domain/repositories/feature_repository.dart';

final class NotificationsGetRecord {
  const NotificationsGetRecord(this._repository);

  final NotificationsFeatureRepository _repository;

  Future<NotificationsRecord?> call(String id) => _repository.getById(id);
}
