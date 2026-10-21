import 'package:mana_ai_app/features/attachments/domain/entities/record.dart';
import 'package:mana_ai_app/features/attachments/domain/repositories/feature_repository.dart';

final class AttachmentsGetRecord {
  const AttachmentsGetRecord(this._repository);

  final AttachmentsFeatureRepository _repository;

  Future<AttachmentsRecord?> call(String id) => _repository.getById(id);
}
