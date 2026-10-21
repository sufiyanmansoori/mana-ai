import 'package:mana_ai_app/features/subscription/domain/entities/record.dart';
import 'package:mana_ai_app/features/subscription/domain/repositories/feature_repository.dart';

final class SubscriptionSaveRecord {
  const SubscriptionSaveRecord(this._repository);

  final SubscriptionFeatureRepository _repository;

  Future<void> call(SubscriptionRecord record) => _repository.save(record);
}
