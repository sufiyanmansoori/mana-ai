import 'package:mana_ai_app/features/voice/domain/entities/record.dart';

abstract interface class VoiceLocalDataSource {
  Future<List<VoiceRecord>> readAll();

  Future<VoiceRecord?> getById(String id);

  Future<void> save(VoiceRecord record);

  Future<void> delete(String id);
}
