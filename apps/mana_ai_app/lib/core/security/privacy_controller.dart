import 'package:flutter/foundation.dart';

final class PrivacyController extends ChangeNotifier {
  bool _analyticsAllowed = false;
  bool _crashReportingAllowed = false;
  bool _personalizationAllowed = false;

  bool get analyticsAllowed => _analyticsAllowed;
  bool get crashReportingAllowed => _crashReportingAllowed;
  bool get personalizationAllowed => _personalizationAllowed;

  void update({
    bool? analyticsAllowed,
    bool? crashReportingAllowed,
    bool? personalizationAllowed,
  }) {
    final nextAnalytics = analyticsAllowed ?? _analyticsAllowed;
    final nextCrashReporting =
        crashReportingAllowed ?? _crashReportingAllowed;
    final nextPersonalization =
        personalizationAllowed ?? _personalizationAllowed;

    if (nextAnalytics == _analyticsAllowed &&
        nextCrashReporting == _crashReportingAllowed &&
        nextPersonalization == _personalizationAllowed) {
      return;
    }

    _analyticsAllowed = nextAnalytics;
    _crashReportingAllowed = nextCrashReporting;
    _personalizationAllowed = nextPersonalization;
    notifyListeners();
  }
}
