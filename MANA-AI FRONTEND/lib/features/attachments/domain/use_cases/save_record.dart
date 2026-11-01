import 'package:mana_ai_app/features/attachments/domain/entities/record.dart';
import 'package:mana_ai_app/features/attachments/domain/repositories/feature_repository.dart';

final class AttachmentsSaveRecord {
  const AttachmentsSaveRecord(this._repository);

  final AttachmentsFeatureRepository _repository;

  Future<void> call(AttachmentsRecord record) => _repository.save(record);
}
