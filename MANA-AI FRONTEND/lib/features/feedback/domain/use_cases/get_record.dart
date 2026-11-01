import 'package:mana_ai_app/features/feedback/domain/entities/record.dart';
import 'package:mana_ai_app/features/feedback/domain/repositories/feature_repository.dart';

final class FeedbackGetRecord {
  const FeedbackGetRecord(this._repository);

  final FeedbackFeatureRepository _repository;

  Future<FeedbackRecord?> call(String id) => _repository.getById(id);
}
