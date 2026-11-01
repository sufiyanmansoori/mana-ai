final class StreamChunkEntity {
  const StreamChunkEntity({
    this.content = '',
    this.isComplete = false,
  });

  final String content;
  final bool isComplete;
}
