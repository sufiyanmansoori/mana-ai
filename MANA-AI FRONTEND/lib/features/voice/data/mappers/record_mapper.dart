import 'package:mana_ai_app/features/voice/domain/entities/record.dart';
import 'package:mana_ai_app/features/voice/data/models/record_model.dart';

abstract final class VoiceRecordMapper {
  static VoiceRecord fromModel(
    VoiceRecordModel model,
  ) =>
      VoiceRecord(id: model.id, createdAt: model.createdAt);

  static VoiceRecordModel toModel(
    VoiceRecord record,
  ) =>
      VoiceRecordModel(
        id: record.id,
        createdAt: record.createdAt,
      );
}
