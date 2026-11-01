// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Portuguese (`pt`).
class AppLocalizationsPt extends AppLocalizations {
  AppLocalizationsPt([String locale = 'pt']) : super(locale);

  @override
  String get appTitle => 'Mana AI';

  @override
  String get localStarter => 'Versão inicial local';

  @override
  String get composerHint => 'Envie uma mensagem para Mana AI';

  @override
  String get sendMessage => 'Enviar mensagem';

  @override
  String get stopGeneration => 'Parar geração';

  @override
  String get chatEmpty => 'Comece uma conversa com o Mana AI.';

  @override
  String get localDataNotice =>
      'As mensagens ficam nesta sessão. Nenhum servidor está conectado.';

  @override
  String get dismiss => 'Fechar';

  @override
  String get invalidMessage =>
      'Não foi possível enviar a mensagem. Verifique o tamanho e o conteúdo.';
}
