// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Spanish Castilian (`es`).
class AppLocalizationsEs extends AppLocalizations {
  AppLocalizationsEs([String locale = 'es']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Versión inicial local';

  @override
  String get composerHint => 'Envía un mensaje a Mana AI';

  @override
  String get sendMessage => 'Enviar mensaje';

  @override
  String get stopGeneration => 'Detener generación';

  @override
  String get chatEmpty => 'Inicia una conversación con Mana AI.';

  @override
  String get localDataNotice =>
      'Los mensajes solo permanecen en esta sesión. No hay un servidor conectado.';

  @override
  String get dismiss => 'Cerrar';

  @override
  String get invalidMessage =>
      'No se pudo enviar el mensaje. Revisa su longitud y contenido.';
}
