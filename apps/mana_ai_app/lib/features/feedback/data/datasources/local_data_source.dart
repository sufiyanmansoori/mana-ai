import 'package:mana_ai_app/features/feedback/domain/entities/record.dart';

abstract interface class FeedbackLocalDataSource {
  Future<List<FeedbackRecord>> readAll();

  Future<FeedbackRecord?> getById(String id);

  Future<void> save(FeedbackRecord record);

  Future<void> delete(String id);
}
