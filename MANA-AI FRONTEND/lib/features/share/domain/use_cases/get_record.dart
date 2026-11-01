import 'package:mana_ai_app/features/share/domain/entities/record.dart';
import 'package:mana_ai_app/features/share/domain/repositories/feature_repository.dart';

final class ShareGetRecord {
  const ShareGetRecord(this._repository);

  final ShareFeatureRepository _repository;

  Future<ShareRecord?> call(String id) => _repository.getById(id);
}
