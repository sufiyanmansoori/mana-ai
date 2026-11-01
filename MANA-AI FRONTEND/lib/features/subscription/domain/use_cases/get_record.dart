import 'package:mana_ai_app/features/subscription/domain/entities/record.dart';
import 'package:mana_ai_app/features/subscription/domain/repositories/feature_repository.dart';

final class SubscriptionGetRecord {
  const SubscriptionGetRecord(this._repository);

  final SubscriptionFeatureRepository _repository;

  Future<SubscriptionRecord?> call(String id) => _repository.getById(id);
}
