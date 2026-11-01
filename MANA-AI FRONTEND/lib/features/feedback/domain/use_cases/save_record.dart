import 'package:mana_ai_app/features/feedback/domain/entities/record.dart';
import 'package:mana_ai_app/features/feedback/domain/repositories/feature_repository.dart';

final class FeedbackSaveRecord {
  const FeedbackSaveRecord(this._repository);

  final FeedbackFeatureRepository _repository;

  Future<void> call(FeedbackRecord record) => _repository.save(record);
}
