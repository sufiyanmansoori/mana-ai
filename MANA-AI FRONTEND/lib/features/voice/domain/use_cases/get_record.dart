import 'package:mana_ai_app/features/voice/domain/entities/record.dart';
import 'package:mana_ai_app/features/voice/domain/repositories/feature_repository.dart';

final class VoiceGetRecord {
  const VoiceGetRecord(this._repository);

  final VoiceFeatureRepository _repository;

  Future<VoiceRecord?> call(String id) => _repository.getById(id);
}
