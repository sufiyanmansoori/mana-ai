final class UserReference {
  const UserReference({
    required this.id,
    this.displayName,
    this.avatarUrl,
  }) : assert(id != '');

  final String id;
  final String? displayName;
  final Uri? avatarUrl;
}
