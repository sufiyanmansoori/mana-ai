final class RequestMetadata {
  const RequestMetadata({
    required this.requestId,
    required this.startedAt,
    this.attempt = 1,
  })  : assert(requestId != ''),
        assert(attempt > 0);

  final String requestId;
  final DateTime startedAt;
  final int attempt;
}