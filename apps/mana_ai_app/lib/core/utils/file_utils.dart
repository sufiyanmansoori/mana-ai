abstract final class FileUtils {
  static String extensionOf(String name) {
    final basename = name.split(RegExp(r'[/\\]')).last;
    final separator = basename.lastIndexOf('.');
    if (separator <= 0 || separator == basename.length - 1) return '';
    return basename.substring(separator + 1).toLowerCase();
  }

  static String safeDisplayName(String name, {int maximumLength = 128}) {
    final basename = name.split(RegExp(r'[/\\]')).last;
    final cleaned = basename.replaceAll(
      RegExp(r'[\u0000-\u001f\u007f]'),
      '',
    );
    if (cleaned.isEmpty) return 'file';
    return cleaned.length <= maximumLength
        ? cleaned
        : cleaned.substring(0, maximumLength);
  }
}
