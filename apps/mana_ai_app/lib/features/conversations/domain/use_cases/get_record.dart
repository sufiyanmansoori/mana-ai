import 'package:mana_ai_app/features/conversations/domain/entities/record.dart';
import 'package:mana_ai_app/features/conversations/domain/repositories/feature_repository.dart';

final class ConversationsGetRecord {
  const ConversationsGetRecord(this._repository);

  final ConversationsFeatureRepository _repository;

  Future<ConversationsRecord?> call(String id) => _repository.getById(id);
}
