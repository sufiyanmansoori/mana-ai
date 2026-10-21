import 'package:flutter/material.dart';

final class UserAvatar extends StatelessWidget {
  const UserAvatar({
    this.label,
    this.imageUrl,
    this.radius = 20,
    super.key,
  });

  final String? label;
  final Uri? imageUrl;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final value = label?.trim() ?? '';
    final initials = value.isEmpty
        ? '?'
        : String.fromCharCode(value.runes.first).toUpperCase();
    final uri = imageUrl;
    final safeUri = uri != null &&
            uri.scheme == 'https' &&
            uri.host.isNotEmpty &&
            uri.userInfo.isEmpty
        ? uri
        : null;

    return CircleAvatar(
      radius: radius,
      foregroundImage:
          safeUri == null ? null : NetworkImage(safeUri.toString()),
      child: Text(initials),
    );
  }
}
