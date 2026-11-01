import 'package:flutter/material.dart';

@immutable
final class ManaThemeExtension extends ThemeExtension<ManaThemeExtension> {
  const ManaThemeExtension({
    required this.success,
    required this.warning,
    required this.danger,
  });

  final Color success;
  final Color warning;
  final Color danger;

  @override
  ManaThemeExtension copyWith({
    Color? success,
    Color? warning,
    Color? danger,
  }) =>
      ManaThemeExtension(
        success: success ?? this.success,
        warning: warning ?? this.warning,
        danger: danger ?? this.danger,
      );

  @override
  ManaThemeExtension lerp(
    covariant ManaThemeExtension? other,
    double t,
  ) {
    if (other == null) return this;
    return ManaThemeExtension(
      success: Color.lerp(success, other.success, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      danger: Color.lerp(danger, other.danger, t)!,
    );
  }
}
