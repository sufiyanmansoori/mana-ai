import 'package:mana_ai_app/features/admin/domain/entities/record.dart';
import 'package:mana_ai_app/features/admin/domain/repositories/feature_repository.dart';

final class AdminGetRecord {
  const AdminGetRecord(this._repository);

  final AdminFeatureRepository _repository;

  Future<AdminRecord?> call(String id) => _repository.getById(id);
}
