import 'dart:io';

abstract interface class SecureFileHandler {
  Future<File> copyToPrivateDirectory(File source);

  Future<void> delete(File file);
}
