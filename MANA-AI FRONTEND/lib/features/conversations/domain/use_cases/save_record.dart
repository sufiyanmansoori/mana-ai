import 'package:mana_ai_app/features/conversations/domain/entities/record.dart';
import 'package:mana_ai_app/features/conversations/domain/repositories/feature_repository.dart';

final class ConversationsSaveRecord {
  const ConversationsSaveRecord(this._repository);

  final ConversationsFeatureRepository _repository;

  Future<void> call(ConversationsRecord record) => _repository.save(record);
}
