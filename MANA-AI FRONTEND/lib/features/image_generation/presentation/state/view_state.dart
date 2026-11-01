import 'package:mana_ai_app/features/image_generation/domain/entities/record.dart';

enum ImageGenerationViewPhase {
  initial,
  loading,
  loaded,
  failed,
}

final class ImageGenerationViewState {
  ImageGenerationViewState({
    required this.phase,
    List<ImageGenerationRecord> records = const [],
    this.error,
  }) : records = List.unmodifiable(records);

  final ImageGenerationViewPhase phase;
  final List<ImageGenerationRecord> records;
  final Object? error;
}
