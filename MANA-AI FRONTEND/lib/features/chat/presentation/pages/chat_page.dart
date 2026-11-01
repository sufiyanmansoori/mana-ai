import 'dart:async';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:mana_ai_app/core/services/secure_id_generator.dart';

import '../../../../core/l10n/generated/app_localizations.dart';
import '../../data/repositories/local_chat_repository.dart';
import '../../domain/entities/chat_message.dart';
import '../chat_controller.dart';
import '../controllers/chat_session_controller.dart';
import '../widgets/message_bubble.dart';
import '../widgets/message_composer.dart';
import '../widgets/memory_detail_panel.dart';
import '../widgets/workspace_sidebar.dart';
import '../../../admin/presentation/controllers/feature_flags_controller.dart';
import '../../../admin/presentation/pages/feature_page.dart';
import '../../../image_generation/data/datasources/image_generation_api_data_source.dart';
import '../../../image_generation/presentation/pages/image_generation_workspace.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({
    required this.controller,
    this.chatSessionController,
    this.createChatSession,
    this.initialConversationId,
    this.model = 'gpt-4o-mini',
    this.models = const [],
    this.startupMessage,
    this.adminFeatureFlagsController,
    this.imageGenerationDataSource,
    super.key,
  });

  final ChatController controller;
  final ChatSessionController? chatSessionController;
  final ChatSessionController Function(String conversationId)?
      createChatSession;
  final String? initialConversationId;
  final String model;
  final List<String> models;
  final String? startupMessage;
  final AdminFeatureFlagsController? adminFeatureFlagsController;
  final ImageGenerationApiDataSource? imageGenerationDataSource;

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  static const _desktopBreakpoint = 760.0;
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final List<SidebarConversation> _conversations = [];
  late SidebarConversation _activeConversation;
  late String _selectedModel;
  String _selectedSection = 'Chat';
  bool _sidebarCollapsed = false;
  bool _showConversation = false;
  bool _hasSampleMemory = true;
  bool _showStartupMessage = true;
  List<String> _selectedFiles = [];

  @override
  void initState() {
    super.initState();
    _activeConversation = _ConversationEntry(
      id: widget.initialConversationId ?? 'current',
      controller: widget.controller,
      ownsController: false,
      sessionController: widget.chatSessionController,
    );
    _conversations.add(_activeConversation);
    _selectedModel = widget.model;
  }

  @override
  void dispose() {
    for (final conversation in _conversations) {
      if (conversation.ownsController) conversation.controller.dispose();
    }
    super.dispose();
  }

  bool _sendMessage(String content) {
    if (_selectedFiles.isNotEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Selected files are not uploaded in local preview. Remove the '
            'file chips before sending this text-only message.',
          ),
        ),
      );
      return false;
    }
    final sent = _activeConversation.controller.sendMessage(content);
    if (!sent) return false;

    setState(() {
      _selectedSection = 'Chat';
      _showConversation = true;
      _activeConversation.recordMessage(content);
    });
    return true;
  }

  Future<bool> _sendRemoteMessage(String content) async {
    if (_selectedFiles.isNotEmpty) return _sendMessage(content);
    final session = _activeConversation.sessionController;
    if (session == null) return _sendMessage(content);

    final previousMessageCount = session.messages.length;
    setState(() {
      _selectedSection = 'Chat';
      _showConversation = true;
    });
    final sent = await session.sendMessage(
      content: content,
      model: _selectedModel,
    );
    if (!mounted) return sent;

    final addedUserMessage = session.messages
        .skip(previousMessageCount)
        .any((message) => message.role == ChatMessageRole.user);
    if (addedUserMessage) {
      _activeConversation.controller.sendMessage(content);
      _activeConversation.recordMessage(content);
    }
    setState(() {});
    return sent;
  }

  void _startNewChat() {
    final conversationId = widget.createChatSession == null
        ? null
        : SecureIdGenerator().nextUuid();
    final sessionController = conversationId == null
        ? null
        : widget.createChatSession!(conversationId);
    final conversation = _ConversationEntry(
      id: conversationId ?? 'local-${DateTime.now().microsecondsSinceEpoch}',
      controller: ChatController(LocalChatRepository()),
      ownsController: true,
      sessionController: sessionController,
    );
    if (sessionController != null) {
      sessionController.initialize();
    }
    setState(() {
      _conversations.insert(0, conversation);
      _activeConversation = conversation;
      _selectedSection = 'Chat';
      _showConversation = false;
      _selectedFiles = [];
    });
    _closeMobileDrawer();
  }

  void _openConversation(SidebarConversation conversation) {
    final session = conversation.sessionController;
    if (session != null) {
      session.initialize();
    }
    setState(() {
      _activeConversation = conversation;
      _selectedSection = 'Chat';
      _showConversation = conversation.hasMessages;
      _selectedFiles = [];
    });
    _closeMobileDrawer();
  }

  void _openSection(String section) {
    if (section == 'New chat') {
      _startNewChat();
      return;
    }
    setState(() {
      _selectedSection = section;
      _showConversation = false;
    });
    _closeMobileDrawer();
  }

  void _closeMobileDrawer() {
    if (MediaQuery.sizeOf(context).width < _desktopBreakpoint) {
      _scaffoldKey.currentState?.closeDrawer();
    }
  }

  Future<void> _renameConversation(SidebarConversation conversation) async {
    final titleController = TextEditingController(text: conversation.title);
    final title = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Rename conversation'),
        content: TextField(
          controller: titleController,
          autofocus: true,
          maxLength: 80,
          decoration: const InputDecoration(labelText: 'Conversation name'),
          onSubmitted: (value) => Navigator.of(context).pop(value.trim()),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () =>
                Navigator.of(context).pop(titleController.text.trim()),
            child: const Text('Save'),
          ),
        ],
      ),
    );
    titleController.dispose();
    if (title == null || title.trim().isEmpty || !mounted) return;
    setState(() => conversation.title = title.trim());
  }

  Future<void> _deleteConversation(SidebarConversation conversation) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete conversation?'),
        content: Text('“${conversation.title}” will be removed from this app.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;

    setState(() {
      _conversations.remove(conversation);
      if (conversation.ownsController) conversation.controller.dispose();
      if (_conversations.isEmpty) {
        _activeConversation = _ConversationEntry(
          id: 'local-${DateTime.now().microsecondsSinceEpoch}',
          controller: ChatController(LocalChatRepository()),
          ownsController: true,
          sessionController: null,
        );
        _conversations.add(_activeConversation);
      } else if (identical(_activeConversation, conversation)) {
        _activeConversation = _conversations.first;
        _showConversation = _activeConversation.hasMessages;
        _selectedSection = 'Chat';
      }
    });
  }

  Future<void> _pickAttachments() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        allowMultiple: true,
        type: FileType.any,
      );
      if (!mounted || result == null) return;
      setState(() {
        _selectedFiles = {
          ..._selectedFiles,
          ...result.files.map((file) => file.name),
        }.toList();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Files are selected locally. Connect a secure upload service '
            'before sending them to an AI model.',
          ),
        ),
      );
    } on Exception {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('The file picker could not be opened.')),
      );
    }
  }

  void _removeAttachment(String fileName) {
    setState(() => _selectedFiles.remove(fileName));
  }

  void _showUnavailable(String feature) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        icon: const Icon(Icons.cloud_off_outlined),
        title: Text('$feature is not connected'),
        content: Text(
          'This app is running in local preview mode. Configure an '
          'authenticated Mana AI backend to enable $feature.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Got it'),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteSampleMemory() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete this sample memory?'),
        content: const Text(
          'This removes the example from the current local preview.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    setState(() => _hasSampleMemory = false);
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final compact = constraints.maxWidth < _desktopBreakpoint;
        if (compact) return _buildCompactWorkspace(context);
        return _buildDesktopWorkspace(context);
      },
    );
  }

  Widget _buildDesktopWorkspace(BuildContext context) {
    final sidebarWidth = _sidebarCollapsed ? 68.0 : 260.0;
    return Scaffold(
      body: SafeArea(
        child: Row(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              curve: Curves.easeOut,
              width: sidebarWidth,
              child: _buildSidebar(collapsed: _sidebarCollapsed),
            ),
            VerticalDivider(
              width: 1,
              thickness: 1,
              color: Theme.of(context).colorScheme.outlineVariant,
            ),
            Expanded(
              child: _buildMainColumn(context, compact: false),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCompactWorkspace(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      drawer: Drawer(
        width: 280,
        child: SafeArea(child: _buildSidebar(collapsed: false)),
      ),
      body: SafeArea(child: _buildMainColumn(context, compact: true)),
    );
  }

  Widget _buildSidebar({required bool collapsed}) => WorkspaceSidebar(
        selectedSection: _selectedSection,
        conversations: _conversations,
        activeConversationId: _activeConversation.id,
        collapsed: collapsed,
        onToggleCollapsed: () =>
            setState(() => _sidebarCollapsed = !_sidebarCollapsed),
        onNewChat: _startNewChat,
        onSelectSection: _openSection,
        onSelectConversation: _openConversation,
        onRenameConversation: _renameConversation,
        onDeleteConversation: _deleteConversation,
        onUpgrade: () => _showUnavailable('Premium plans'),
        onOpenProfile: () => _showUnavailable('Account management'),
        showAdminTools: widget.adminFeatureFlagsController != null,
      );

  Widget _buildMainColumn(BuildContext context, {required bool compact}) {
    if (_selectedSection == 'Images' &&
        widget.imageGenerationDataSource != null) {
      return ImageGenerationWorkspace(
        dataSource: widget.imageGenerationDataSource!,
      );
    }
    if (_selectedSection == 'Feature flags' &&
        widget.adminFeatureFlagsController != null) {
      return AdminFeaturePage(
        controller: widget.adminFeatureFlagsController,
      );
    }

    final localizations = AppLocalizations.of(context);
    return Column(
      children: [
        _MainHeader(
          compact: compact,
          title: _selectedSection == 'Chat'
              ? (_showConversation ? _activeConversation.title : 'New chat')
              : _selectedSection,
          onMenu:
              compact ? () => _scaffoldKey.currentState?.openDrawer() : null,
          model: widget.models.isEmpty ? null : _selectedModel,
          models: widget.models,
          onModelChanged: (model) => setState(() => _selectedModel = model),
          onUpgrade: () => _showUnavailable('Premium plans'),
          onProfile: () => _showUnavailable('Account management'),
        ),
        if (_showStartupMessage && widget.startupMessage != null)
          MaterialBanner(
            content: Text(widget.startupMessage!),
            actions: [
              TextButton(
                onPressed: () => setState(() => _showStartupMessage = false),
                child: const Text('Dismiss'),
              ),
            ],
          ),
        if (_selectedSection == 'Chat')
          Expanded(child: _buildChatBody(context, localizations))
        else if (_selectedSection == 'Memory' && _hasSampleMemory)
          Expanded(
            child: MemoryDetailPanel(onDelete: _deleteSampleMemory),
          )
        else
          Expanded(
            child: _selectedSection == 'Memory'
                ? const Center(child: Text('No saved memories'))
                : _WorkspaceFeatureView(section: _selectedSection),
          ),
      ],
    );
  }

  Widget _buildChatBody(
    BuildContext context,
    AppLocalizations localizations,
  ) {
    final session = _activeConversation.sessionController;
    return Column(
      children: [
        Expanded(
          child: ListenableBuilder(
            listenable: session ?? _activeConversation.controller,
            builder: (context, _) {
              final messages =
                  session?.messages ?? _activeConversation.controller.messages;
              final failure =
                  session?.failure ?? _activeConversation.controller.failure;
              if (messages.isEmpty && failure == null) {
                return _WelcomeView(
                  onSuggestion: (prompt) {
                    if (session == null) {
                      _sendMessage(prompt);
                    } else {
                      unawaited(_sendRemoteMessage(prompt));
                    }
                  },
                );
              }
              return Column(
                children: [
                  if (failure != null)
                    MaterialBanner(
                      content: Text(failure.message),
                      actions: [
                        TextButton(
                          onPressed: () {
                            if (session != null) {
                              session.clearFailure();
                            } else {
                              _activeConversation.controller.clearFailure();
                            }
                          },
                          child: Text(localizations.dismiss),
                        ),
                      ],
                    ),
                  Expanded(
                    child: _ConversationView(messages: messages),
                  ),
                ],
              );
            },
          ),
        ),
        MessageComposer(
          onSend: session == null ? _sendMessage : null,
          onSendAsync: session == null ? null : _sendRemoteMessage,
          isGenerating: session?.isGenerating ?? false,
          onStop: session?.stopGeneration,
          onAttach: _pickAttachments,
          onThink: () => _showUnavailable('Thinking mode'),
          onVoice: () => _showUnavailable('Voice input'),
          attachments: _selectedFiles,
          onRemoveAttachment: _removeAttachment,
        ),
      ],
    );
  }
}

class _ConversationEntry implements SidebarConversation {
  _ConversationEntry({
    required this.id,
    required this.controller,
    required this.ownsController,
    required this.sessionController,
    String title = 'New chat',
  }) : _title = title;

  @override
  final String id;

  @override
  final ChatController controller;

  @override
  final bool ownsController;

  @override
  final ChatSessionController? sessionController;

  String _title;

  bool _hasCustomTitle = false;
  bool _hasGeneratedTitle = false;

  @override
  String get title => _title;

  @override
  set title(String value) {
    _title = value;
    _hasCustomTitle = true;
  }

  @override
  bool get hasMessages =>
      controller.messages.isNotEmpty ||
      sessionController?.messages.isNotEmpty == true;

  @override
  void recordMessage(String content) {
    if (_hasCustomTitle || _hasGeneratedTitle) return;
    final firstLine = content.trim().split('\n').first;
    _title = firstLine.length > 36
        ? '${firstLine.substring(0, 36).trimRight()}…'
        : firstLine;
    _hasGeneratedTitle = true;
  }
}

class _MainHeader extends StatelessWidget {
  const _MainHeader({
    required this.compact,
    required this.title,
    required this.onUpgrade,
    required this.onProfile,
    required this.models,
    required this.onModelChanged,
    this.model,
    this.onMenu,
  });

  final bool compact;
  final String title;
  final String? model;
  final List<String> models;
  final ValueChanged<String> onModelChanged;
  final VoidCallback? onMenu;
  final VoidCallback onUpgrade;
  final VoidCallback onProfile;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return SizedBox(
      height: 56,
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: compact ? 8 : 20),
        child: Row(
          children: [
            if (compact)
              IconButton(
                tooltip: 'Open navigation',
                onPressed: onMenu,
                icon: const Icon(Icons.menu),
              )
            else
              const SizedBox(width: 8),
            if (compact)
              Expanded(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              )
            else
              const Spacer(),
            if (model != null)
              SizedBox(
                width: compact ? 112 : 156,
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: model,
                    isExpanded: true,
                    items: [
                      for (final item in models)
                        DropdownMenuItem(
                          value: item,
                          child: Text(
                            item,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                    ],
                    onChanged: models.length < 2
                        ? null
                        : (value) {
                            if (value != null) onModelChanged(value);
                          },
                  ),
                ),
              ),
            TextButton.icon(
              onPressed: onUpgrade,
              icon: Icon(Icons.auto_awesome, color: colorScheme.primary),
              label: const Text('Upgrade'),
            ),
            const SizedBox(width: 8),
            Tooltip(
              message: 'Account',
              child: InkWell(
                onTap: onProfile,
                customBorder: const CircleBorder(),
                child: CircleAvatar(
                  radius: 16,
                  backgroundColor: colorScheme.primaryContainer,
                  foregroundColor: colorScheme.onPrimaryContainer,
                  child: const Text('M'),
                ),
              ),
            ),
            const SizedBox(width: 8),
          ],
        ),
      ),
    );
  }
}

class _WelcomeView extends StatelessWidget {
  const _WelcomeView({required this.onSuggestion});

  final ValueChanged<String> onSuggestion;

  static const _suggestions = [
    ('Explain a difficult topic', Icons.lightbulb_outline),
    ('Help me write or improve code', Icons.code),
    ('Summarize a document', Icons.description_outlined),
    ('Help me plan a project', Icons.account_tree_outlined),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 28),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 760),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.auto_awesome,
                  color: theme.colorScheme.primary,
                  size: 26,
                ),
              ),
              const SizedBox(height: 18),
              Text(
                'Good to see you.',
                textAlign: TextAlign.center,
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'What would you like to explore today?',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 24),
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 10,
                runSpacing: 10,
                children: [
                  for (final suggestion in _suggestions)
                    ActionChip(
                      avatar: Icon(suggestion.$2, size: 17),
                      label: Text(suggestion.$1),
                      onPressed: () => onSuggestion(suggestion.$1),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ConversationView extends StatelessWidget {
  const _ConversationView({required this.messages});

  final List<ChatMessage> messages;

  @override
  Widget build(BuildContext context) {
    if (messages.isEmpty) {
      return const Center(child: Text('Start a conversation with Mana AI.'));
    }
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 840),
        child: ListView.builder(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
          itemCount: messages.length,
          itemBuilder: (context, index) => MessageBubble(
            message: messages[index],
          ),
        ),
      ),
    );
  }
}

class _WorkspaceFeatureView extends StatelessWidget {
  const _WorkspaceFeatureView({required this.section});

  final String section;

  static const _descriptions = <String, String>{
    'Images': 'Create and organize AI-generated images. Connect a secure image '
        'generation service to enable this workspace.',
    'Library': 'Your uploaded documents and saved files will appear here after '
        'secure file storage is connected.',
    'Scheduled tasks':
        'Create recurring AI tasks after a scheduler service is configured.',
    'Plugins': 'Connect approved tools and integrations to extend Mana AI.',
    'Projects': 'Organize conversations with project-specific context.',
    'Codex': 'Use a configured coding model for code review, explanation, and '
        'debugging assistance.',
    'Memory':
        'Manage the information you choose to save for future conversations.',
  };

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final description = _descriptions[section] ??
        'Manage your $section preferences when an account service is '
            'connected.';
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 640),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                _iconForSection(section),
                size: 42,
                color: theme.colorScheme.primary,
              ),
              const SizedBox(height: 16),
              Text(section, style: theme.textTheme.headlineSmall),
              const SizedBox(height: 8),
              Text(
                description,
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 20),
              const Chip(
                avatar: Icon(Icons.cloud_off_outlined, size: 18),
                label: Text('Backend setup required'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _iconForSection(String section) => switch (section) {
        'Images' => Icons.image_outlined,
        'Library' => Icons.folder_open_outlined,
        'Scheduled tasks' => Icons.schedule_outlined,
        'Plugins' => Icons.extension_outlined,
        'Projects' => Icons.work_outline,
        'Codex' => Icons.code,
        'Memory' => Icons.psychology_outlined,
        _ => Icons.tune,
      };
}
