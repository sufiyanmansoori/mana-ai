import 'package:mana_ai_app/features/voice/domain/entities/record.dart';
import 'package:mana_ai_app/features/voice/domain/repositories/feature_repository.dart';

final class VoiceSaveRecord {
  const VoiceSaveRecord(this._repository);

  final VoiceFeatureRepository _repository;

  Future<void> call(VoiceRecord record) => _repository.save(record);
}
