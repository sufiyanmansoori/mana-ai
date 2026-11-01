import 'package:mana_ai_app/features/chat/domain/entities/record.dart';
import 'package:mana_ai_app/features/chat/domain/repositories/feature_repository.dart';

final class ChatGetRecord {
  const ChatGetRecord(this._repository);

  final ChatFeatureRepository _repository;

  Future<ChatRecord?> call(String id) => _repository.getById(id);
}
