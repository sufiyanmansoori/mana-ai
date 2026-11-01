import 'package:mana_ai_app/features/chat/domain/entities/record.dart';
import 'package:mana_ai_app/features/chat/domain/repositories/feature_repository.dart';

final class ChatSaveRecord {
  const ChatSaveRecord(this._repository);

  final ChatFeatureRepository _repository;

  Future<void> call(ChatRecord record) => _repository.save(record);
}
