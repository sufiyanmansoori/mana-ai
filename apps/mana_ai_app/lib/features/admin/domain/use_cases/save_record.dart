import 'package:mana_ai_app/features/admin/domain/entities/record.dart';
import 'package:mana_ai_app/features/admin/domain/repositories/feature_repository.dart';

final class AdminSaveRecord {
  const AdminSaveRecord(this._repository);

  final AdminFeatureRepository _repository;

  Future<void> call(AdminRecord record) => _repository.save(record);
}
