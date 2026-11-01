import 'package:mana_ai_app/features/share/domain/entities/record.dart';
import 'package:mana_ai_app/features/share/domain/repositories/feature_repository.dart';

final class ShareSaveRecord {
  const ShareSaveRecord(this._repository);

  final ShareFeatureRepository _repository;

  Future<void> call(ShareRecord record) => _repository.save(record);
}
