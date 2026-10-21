final class ShareFeatureId {
  ShareFeatureId(String value) : value = value.trim() {
    if (this.value.isEmpty) {
      throw ArgumentError.value(value, 'value', 'Must not be empty.');
    }
  }

  final String value;
}
