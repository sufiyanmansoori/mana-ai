import 'package:mana_ai_app/features/explore/domain/entities/record.dart';

abstract interface class ExploreLocalDataSource {
  Future<List<ExploreRecord>> readAll();

  Future<ExploreRecord?> getById(String id);

  Future<void> save(ExploreRecord record);

  Future<void> delete(String id);
}
