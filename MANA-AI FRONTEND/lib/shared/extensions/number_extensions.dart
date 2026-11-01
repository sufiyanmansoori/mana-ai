extension ManaNumberExtensions on num {
  Duration get milliseconds => Duration(milliseconds: round());

  Duration get seconds => Duration(milliseconds: (this * 1000).round());

  double clampDouble(double minimum, double maximum) =>
      toDouble().clamp(minimum, maximum);
}
