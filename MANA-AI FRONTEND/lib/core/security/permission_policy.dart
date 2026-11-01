enum AppPermission { camera, microphone, photos, documents, notifications }

enum PermissionDecision { granted, denied, restricted, permanentlyDenied }

abstract interface class PermissionPolicy {
  Future<PermissionDecision> request(AppPermission permission);

  Future<PermissionDecision> check(AppPermission permission);
}
