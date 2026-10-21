import 'package:mana_ai_app/features/canvas/domain/entities/record.dart';

abstract interface class CanvasLocalDataSource {
  Future<List<CanvasRecord>> readAll();

  Future<CanvasRecord?> getById(String id);

  Future<void> save(CanvasRecord record);

  Future<void> delete(String id);
}
