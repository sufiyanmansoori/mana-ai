import 'package:mana_ai_app/features/support/domain/entities/record.dart';
import 'package:mana_ai_app/features/support/domain/repositories/feature_repository.dart';

final class SupportGetRecord {
  const SupportGetRecord(this._repository);

  final SupportFeatureRepository _repository;

  Future<SupportRecord?> call(String id) => _repository.getById(id);
}
