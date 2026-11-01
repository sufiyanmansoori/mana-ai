import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../domain/entities/feature_flag.dart';
import '../controllers/feature_flags_controller.dart';

final class AdminFeaturePage extends StatefulWidget {
  const AdminFeaturePage({
    this.controller,
    super.key,
  });

  final AdminFeatureFlagsController? controller;

  @override
  State<AdminFeaturePage> createState() => _AdminFeaturePageState();
}

final class _AdminFeaturePageState extends State<AdminFeaturePage> {
  final _searchController = TextEditingController();
  String _query = '';

  @override
  void initState() {
    super.initState();
    widget.controller?.load();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _createFlag() async {
    final controller = widget.controller;
    if (controller == null) return;
    final keyController = TextEditingController();
    final descriptionController = TextEditingController();
    var initiallyEnabled = false;

    final input =
        await showDialog<({String key, String description, bool enabled})>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Create feature flag'),
          content: SizedBox(
            width: 420,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: keyController,
                  autofocus: true,
                  maxLength: 64,
                  textCapitalization: TextCapitalization.none,
                  decoration: const InputDecoration(
                    labelText: 'Flag key',
                    hintText: 'new_chat_feature',
                    helperText: 'Use lowercase letters, numbers, ., _, or -.',
                  ),
                ),
                TextField(
                  controller: descriptionController,
                  maxLength: 500,
                  minLines: 2,
                  maxLines: 4,
                  decoration: const InputDecoration(
                    labelText: 'Description',
                    alignLabelWithHint: true,
                  ),
                ),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Enabled immediately'),
                  value: initiallyEnabled,
                  onChanged: (value) =>
                      setDialogState(() => initiallyEnabled = value),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(
                (
                  key: keyController.text,
                  description: descriptionController.text,
                  enabled: initiallyEnabled,
                ),
              ),
              child: const Text('Create'),
            ),
          ],
        ),
      ),
    );
    keyController.dispose();
    descriptionController.dispose();
    if (input == null || !mounted) return;

    final created = await controller.create(
      key: input.key,
      description: input.description,
      enabled: input.enabled,
    );
    if (!mounted) return;
    if (created) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Feature flag created.')),
      );
    }
  }

  Future<void> _deleteFlag(String key) async {
    final controller = widget.controller;
    if (controller == null) return;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        icon: const Icon(Icons.warning_amber_outlined),
        title: const Text('Delete feature flag?'),
        content: Text(
          '“$key” will be removed. This action is recorded in the admin audit log.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Delete flag'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    final deleted = await controller.delete(key);
    if (!mounted) return;
    if (deleted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Feature flag deleted.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = widget.controller;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Feature flags'),
        actions: [
          IconButton(
            tooltip: 'Refresh feature flags',
            onPressed: controller?.load,
            icon: const Icon(Icons.refresh),
          ),
          IconButton(
            tooltip: 'Create feature flag',
            onPressed: controller == null ? null : _createFlag,
            icon: const Icon(Icons.add),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: controller == null
          ? const _AdminUnavailable()
          : ListenableBuilder(
              listenable: controller,
              builder: (context, _) => _buildContent(controller),
            ),
    );
  }

  Widget _buildContent(AdminFeatureFlagsController controller) {
    if (controller.isLoading && controller.flags.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }
    if (controller.flags.isEmpty && controller.error != null) {
      return _LoadError(
        message: controller.error!,
        onRetry: controller.load,
      );
    }

    final normalizedQuery = _query.trim().toLowerCase();
    final flags = controller.flags
        .where(
          (flag) =>
              normalizedQuery.isEmpty ||
              flag.key.toLowerCase().contains(normalizedQuery) ||
              flag.description.toLowerCase().contains(normalizedQuery),
        )
        .toList(growable: false);
    final enabledCount = controller.flags.where((flag) => flag.enabled).length;

    return RefreshIndicator(
      onRefresh: controller.load,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
        children: [
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Control staged features safely',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Changes apply immediately. Every create, update, and '
                    'delete is recorded with the administrator identity.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                  const SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Wrap(
                        spacing: 36,
                        runSpacing: 12,
                        children: [
                          _Metric(
                            label: 'Total flags',
                            value: '${controller.flags.length}',
                          ),
                          _Metric(label: 'Enabled', value: '$enabledCount'),
                          _Metric(
                            label: 'Disabled',
                            value: '${controller.flags.length - enabledCount}',
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (controller.error != null) ...[
                    const SizedBox(height: 12),
                    MaterialBanner(
                      content: Text(controller.error!),
                      actions: [
                        TextButton(
                          onPressed: controller.clearError,
                          child: const Text('Dismiss'),
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: 18),
                  TextField(
                    controller: _searchController,
                    onChanged: (value) => setState(() => _query = value),
                    textInputAction: TextInputAction.search,
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.search),
                      hintText: 'Search flags',
                      border: const OutlineInputBorder(),
                      suffixIcon: _query.isEmpty
                          ? null
                          : IconButton(
                              tooltip: 'Clear search',
                              onPressed: () {
                                _searchController.clear();
                                setState(() => _query = '');
                              },
                              icon: const Icon(Icons.close),
                            ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (flags.isEmpty)
                    _EmptyFlags(hasFlags: controller.flags.isNotEmpty)
                  else
                    for (final flag in flags)
                      Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          title: Text(
                            flag.key,
                            style: const TextStyle(
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(flag.description),
                                const SizedBox(height: 4),
                                Text(
                                  'Updated ${DateFormat.yMMMd().add_jm().format(flag.updatedAt.toLocal())} · ${flag.updatedBy}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: Theme.of(context).textTheme.labelSmall,
                                ),
                              ],
                            ),
                          ),
                          isThreeLine: true,
                          leading: Icon(
                            flag.enabled
                                ? Icons.flag_circle
                                : Icons.outlined_flag,
                            color: flag.enabled
                                ? Theme.of(context).colorScheme.primary
                                : Theme.of(context).colorScheme.outline,
                          ),
                          trailing: SizedBox(
                            width: 112,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Switch(
                                  value: flag.enabled,
                                  onChanged: controller.isMutating
                                      ? null
                                      : (value) => controller.setEnabled(
                                            key: flag.key,
                                            enabled: value,
                                          ),
                                ),
                                IconButton(
                                  tooltip: 'Delete ${flag.key}',
                                  onPressed: controller.isMutating
                                      ? null
                                      : () => _deleteFlag(flag.key),
                                  icon: const Icon(Icons.delete_outline),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                  if (controller.isMutating) ...[
                    const SizedBox(height: 4),
                    const LinearProgressIndicator(),
                  ],
                  const SizedBox(height: 16),
                  _AuditHistory(entries: controller.audit),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

final class _Metric extends StatelessWidget {
  const _Metric({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Semantics(
        label: '$label: $value',
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value, style: Theme.of(context).textTheme.headlineSmall),
            Text(label, style: Theme.of(context).textTheme.labelMedium),
          ],
        ),
      );
}

final class _EmptyFlags extends StatelessWidget {
  const _EmptyFlags({required this.hasFlags});

  final bool hasFlags;

  @override
  Widget build(BuildContext context) => Card(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            children: [
              const Icon(Icons.flag_outlined, size: 36),
              const SizedBox(height: 10),
              Text(
                hasFlags
                    ? 'No flags match your search.'
                    : 'No feature flags yet.',
              ),
              if (!hasFlags)
                const Text('Create a flag to begin managing staged releases.'),
            ],
          ),
        ),
      );
}

final class _AuditHistory extends StatelessWidget {
  const _AuditHistory({required this.entries});

  final List<AdminFeatureFlagAuditEntry> entries;

  @override
  Widget build(BuildContext context) => Card(
        child: ExpansionTile(
          leading: const Icon(Icons.history),
          title: const Text('Recent admin activity'),
          subtitle: Text('${entries.length} recent changes'),
          children: [
            if (entries.isEmpty)
              const ListTile(
                title: Text('No admin changes have been recorded.'),
              ),
            for (final entry in entries)
              ListTile(
                dense: true,
                leading: Icon(
                  switch (entry.action) {
                    'created' => Icons.add_circle_outline,
                    'deleted' => Icons.delete_outline,
                    _ => Icons.edit_outlined,
                  },
                ),
                title: Text('${entry.action} ${entry.key}'),
                subtitle: Text(
                  '${entry.actorSubject} · '
                  '${DateFormat.yMMMd().add_jm().format(entry.occurredAt.toLocal())}',
                ),
              ),
          ],
        ),
      );
}

final class _LoadError extends StatelessWidget {
  const _LoadError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.admin_panel_settings_outlined, size: 48),
              const SizedBox(height: 12),
              Text(message, textAlign: TextAlign.center),
              const SizedBox(height: 12),
              FilledButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Try again'),
              ),
            ],
          ),
        ),
      );
}

final class _AdminUnavailable extends StatelessWidget {
  const _AdminUnavailable();

  @override
  Widget build(BuildContext context) => const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'Admin tools are unavailable because the API session is not '
            'configured. Connect the authenticated Mana AI API to continue.',
            textAlign: TextAlign.center,
          ),
        ),
      );
}
