import 'package:flutter/material.dart';

import '../chat_controller.dart';

class WorkspaceSidebar extends StatefulWidget {
  const WorkspaceSidebar({
    required this.selectedSection,
    required this.conversations,
    required this.activeConversationId,
    required this.collapsed,
    required this.onToggleCollapsed,
    required this.onNewChat,
    required this.onSelectSection,
    required this.onSelectConversation,
    required this.onRenameConversation,
    required this.onDeleteConversation,
    required this.onUpgrade,
    required this.onOpenProfile,
    super.key,
  });

  final String selectedSection;
  final List<SidebarConversation> conversations;
  final String activeConversationId;
  final bool collapsed;
  final VoidCallback onToggleCollapsed;
  final VoidCallback onNewChat;
  final ValueChanged<String> onSelectSection;
  final ValueChanged<SidebarConversation> onSelectConversation;
  final ValueChanged<SidebarConversation> onRenameConversation;
  final ValueChanged<SidebarConversation> onDeleteConversation;
  final VoidCallback onUpgrade;
  final VoidCallback onOpenProfile;

  @override
  State<WorkspaceSidebar> createState() => _WorkspaceSidebarState();
}

abstract interface class SidebarConversation {
  String get id;

  String get title;

  set title(String value);

  ChatController get controller;

  bool get ownsController;

  bool get hasMessages;

  void recordMessage(String content);
}

class _WorkspaceSidebarState extends State<WorkspaceSidebar> {
  final _searchController = TextEditingController();
  final _searchFocusNode = FocusNode();
  String _query = '';
  bool _showSearch = false;
  bool _showMore = false;

  static const _primaryItems = <_NavigationItemData>[
    _NavigationItemData('Images', Icons.image_outlined),
    _NavigationItemData('Library', Icons.collections_bookmark_outlined),
    _NavigationItemData('Scheduled tasks', Icons.schedule_outlined),
    _NavigationItemData('Plugins', Icons.extension_outlined),
    _NavigationItemData('Projects', Icons.work_outline),
    _NavigationItemData('Codex', Icons.code),
  ];

  static const _moreItems = <_NavigationItemData>[
    _NavigationItemData('Memory', Icons.psychology_outlined),
    _NavigationItemData('General settings', Icons.settings_outlined),
    _NavigationItemData('Account', Icons.account_circle_outlined),
    _NavigationItemData('Privacy', Icons.shield_outlined),
    _NavigationItemData('Billing', Icons.credit_card_outlined),
    _NavigationItemData('Capabilities', Icons.tune),
    _NavigationItemData('Feedback and support', Icons.help_outline),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  List<SidebarConversation> get _filteredConversations {
    final query = _query.trim().toLowerCase();
    return widget.conversations
        .where((conversation) => conversation.hasMessages)
        .where(
          (conversation) =>
              query.isEmpty || conversation.title.toLowerCase().contains(query),
        )
        .toList();
  }

  void _toggleSearch() {
    if (widget.collapsed) {
      widget.onToggleCollapsed();
    }
    setState(() => _showSearch = !_showSearch);
    if (_showSearch) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _searchFocusNode.requestFocus();
      });
    } else {
      _searchController.clear();
      setState(() => _query = '');
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final collapsed = widget.collapsed;
    return Material(
      color: colorScheme.surfaceContainerLowest,
      child: Column(
        children: [
          _buildBrandRow(context, collapsed),
          if (!collapsed && _showSearch)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 8),
              child: SizedBox(
                height: 38,
                child: TextField(
                  controller: _searchController,
                  focusNode: _searchFocusNode,
                  onChanged: (value) => setState(() => _query = value),
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Search chats',
                    prefixIcon: const Icon(Icons.search, size: 18),
                    prefixIconConstraints:
                        const BoxConstraints(minWidth: 38, minHeight: 38),
                    suffixIcon: IconButton(
                      tooltip: 'Close search',
                      onPressed: _toggleSearch,
                      icon: const Icon(Icons.close, size: 16),
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 8),
                    isDense: true,
                  ),
                ),
              ),
            ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.fromLTRB(collapsed ? 8 : 10, 4, 10, 12),
              children: [
                _SidebarButton(
                  label: 'New chat',
                  icon: Icons.edit_square,
                  selected: widget.selectedSection == 'Chat' &&
                      !widget.conversations.any(
                        (conversation) =>
                            conversation.id == widget.activeConversationId &&
                            conversation.hasMessages,
                      ),
                  collapsed: collapsed,
                  onTap: widget.onNewChat,
                ),
                const SizedBox(height: 4),
                _SidebarButton(
                  label: 'Search chats',
                  icon: Icons.search,
                  collapsed: collapsed,
                  onTap: _toggleSearch,
                ),
                for (final item in _primaryItems)
                  _SidebarButton(
                    label: item.label,
                    icon: item.icon,
                    selected: widget.selectedSection == item.label,
                    collapsed: collapsed,
                    onTap: () => widget.onSelectSection(item.label),
                  ),
                _SidebarButton(
                  label: _showMore ? 'Show less' : 'More',
                  icon: _showMore ? Icons.keyboard_arrow_up : Icons.more_horiz,
                  collapsed: collapsed,
                  onTap: () => setState(() => _showMore = !_showMore),
                ),
                if (_showMore)
                  for (final item in _moreItems)
                    _SidebarButton(
                      label: item.label,
                      icon: item.icon,
                      selected: widget.selectedSection == item.label,
                      collapsed: collapsed,
                      onTap: () => widget.onSelectSection(item.label),
                    ),
                if (!collapsed) ...[
                  Padding(
                    padding: const EdgeInsets.fromLTRB(8, 18, 8, 6),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            _query.isEmpty ? 'Recents' : 'Search results',
                            style: Theme.of(context)
                                .textTheme
                                .labelMedium
                                ?.copyWith(color: colorScheme.primary),
                          ),
                        ),
                        if (_filteredConversations.isNotEmpty)
                          Text(
                            '${_filteredConversations.length}',
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall
                                ?.copyWith(
                                  color: colorScheme.onSurfaceVariant,
                                ),
                          ),
                      ],
                    ),
                  ),
                  if (_filteredConversations.isEmpty)
                    Padding(
                      padding: const EdgeInsets.fromLTRB(8, 6, 8, 10),
                      child: Text(
                        _query.isEmpty
                            ? 'Your conversations will appear here.'
                            : 'No matching conversations.',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                      ),
                    ),
                  for (final conversation in _filteredConversations)
                    _ConversationTile(
                      conversation: conversation,
                      selected: conversation.id == widget.activeConversationId,
                      onTap: () => widget.onSelectConversation(conversation),
                      onRename: () => widget.onRenameConversation(conversation),
                      onDelete: () => widget.onDeleteConversation(conversation),
                    ),
                ],
              ],
            ),
          ),
          const Divider(height: 1),
          if (!collapsed)
            _ProfileFooter(
              onUpgrade: widget.onUpgrade,
              onOpenProfile: widget.onOpenProfile,
            )
          else
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: IconButton(
                tooltip: 'Account',
                onPressed: widget.onOpenProfile,
                icon: const CircleAvatar(
                  radius: 15,
                  child: Text('M', style: TextStyle(fontSize: 12)),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBrandRow(BuildContext context, bool collapsed) {
    return SizedBox(
      height: 56,
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: collapsed ? 8 : 14),
        child: Row(
          children: [
            if (!collapsed)
              Expanded(
                child: Row(
                  children: [
                    Icon(
                      Icons.auto_awesome,
                      size: 21,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(width: 9),
                    Expanded(
                      child: Text(
                        'Mana AI',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style:
                            Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                      ),
                    ),
                  ],
                ),
              )
            else
              const Spacer(),
            IconButton(
              tooltip: collapsed ? 'Expand sidebar' : 'Collapse sidebar',
              onPressed: widget.onToggleCollapsed,
              icon: Icon(
                collapsed ? Icons.view_sidebar_outlined : Icons.menu_open,
                size: 20,
              ),
            ),
            if (!collapsed)
              IconButton(
                tooltip: _showSearch ? 'Close chat search' : 'Search chats',
                onPressed: _toggleSearch,
                icon: const Icon(Icons.search, size: 20),
              ),
          ],
        ),
      ),
    );
  }
}

class _SidebarButton extends StatelessWidget {
  const _SidebarButton({
    required this.label,
    required this.icon,
    required this.collapsed,
    required this.onTap,
    this.selected = false,
  });

  final String label;
  final IconData icon;
  final bool selected;
  final bool collapsed;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: collapsed ? label : '',
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 1),
        child: Material(
          color: selected ? scheme.surfaceContainerHigh : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              height: 38,
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: collapsed ? 0 : 10),
                child: Row(
                  mainAxisAlignment: collapsed
                      ? MainAxisAlignment.center
                      : MainAxisAlignment.start,
                  children: [
                    Icon(icon, size: 19, color: scheme.onSurface),
                    if (!collapsed) ...[
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(
                                fontWeight: selected ? FontWeight.w600 : null,
                              ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ConversationTile extends StatelessWidget {
  const _ConversationTile({
    required this.conversation,
    required this.selected,
    required this.onTap,
    required this.onRename,
    required this.onDelete,
  });

  final SidebarConversation conversation;
  final bool selected;
  final VoidCallback onTap;
  final VoidCallback onRename;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 1),
      child: Material(
        color: selected ? scheme.surfaceContainerHigh : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: SizedBox(
            height: 36,
            child: Padding(
              padding: const EdgeInsets.only(left: 10, right: 4),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      conversation.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ),
                  PopupMenuButton<String>(
                    tooltip: 'Conversation actions',
                    iconSize: 18,
                    padding: EdgeInsets.zero,
                    onSelected: (action) {
                      if (action == 'rename') onRename();
                      if (action == 'delete') onDelete();
                    },
                    itemBuilder: (context) => const [
                      PopupMenuItem(
                        value: 'rename',
                        child: Text('Rename'),
                      ),
                      PopupMenuItem(
                        value: 'delete',
                        child: Text('Delete'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ProfileFooter extends StatelessWidget {
  const _ProfileFooter({
    required this.onUpgrade,
    required this.onOpenProfile,
  });

  final VoidCallback onUpgrade;
  final VoidCallback onOpenProfile;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              onTap: onOpenProfile,
              borderRadius: BorderRadius.circular(10),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 16,
                      backgroundColor: scheme.primaryContainer,
                      foregroundColor: scheme.onPrimaryContainer,
                      child: const Text('M', style: TextStyle(fontSize: 12)),
                    ),
                    const SizedBox(width: 9),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Guest',
                            style: Theme.of(context).textTheme.labelLarge,
                          ),
                          Text(
                            'Local preview',
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall
                                ?.copyWith(
                                  color: scheme.onSurfaceVariant,
                                ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          OutlinedButton(
            onPressed: onUpgrade,
            style: OutlinedButton.styleFrom(
              visualDensity: VisualDensity.compact,
              padding: const EdgeInsets.symmetric(horizontal: 10),
            ),
            child: const Text('Upgrade'),
          ),
        ],
      ),
    );
  }
}

class _NavigationItemData {
  const _NavigationItemData(this.label, this.icon);

  final String label;
  final IconData icon;
}
