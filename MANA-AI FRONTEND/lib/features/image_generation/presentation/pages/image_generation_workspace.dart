import 'package:flutter/material.dart';

import '../../data/datasources/image_generation_api_data_source.dart';

final class ImageGenerationWorkspace extends StatefulWidget {
  const ImageGenerationWorkspace({
    required this.dataSource,
    super.key,
  });

  final ImageGenerationApiDataSource dataSource;

  @override
  State<ImageGenerationWorkspace> createState() =>
      _ImageGenerationWorkspaceState();
}

final class _ImageGenerationWorkspaceState
    extends State<ImageGenerationWorkspace> {
  final _promptController = TextEditingController();
  String _size = '1024x1024';
  GeneratedImage? _image;
  String? _error;
  bool _isGenerating = false;

  @override
  void dispose() {
    _promptController.dispose();
    super.dispose();
  }

  Future<void> _generate() async {
    if (_isGenerating) return;
    setState(() {
      _isGenerating = true;
      _error = null;
    });
    try {
      final image = await widget.dataSource.generate(
        prompt: _promptController.text,
        size: _size,
      );
      if (!mounted) return;
      setState(() => _image = image);
    } on ImageGenerationApiException catch (error) {
      if (!mounted) return;
      setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _isGenerating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Images')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
        children: [
          Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 840),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Create an image with Mana AI',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Describe the image you want. Your prompt is sent to the '
                    'Mana AI API; provider credentials stay on the server.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _promptController,
                    minLines: 3,
                    maxLines: 7,
                    maxLength: 4000,
                    textCapitalization: TextCapitalization.sentences,
                    decoration: const InputDecoration(
                      labelText: 'Describe your image',
                      hintText:
                          'A quiet mountain lake at sunrise, cinematic light...',
                      alignLabelWithHint: true,
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    alignment: WrapAlignment.spaceBetween,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      DropdownButton<String>(
                        value: _size,
                        onChanged: _isGenerating
                            ? null
                            : (value) {
                                if (value != null) setState(() => _size = value);
                              },
                        items: const [
                          DropdownMenuItem(
                            value: '1024x1024',
                            child: Text('Square · 1024 × 1024'),
                          ),
                          DropdownMenuItem(
                            value: '1536x1024',
                            child: Text('Landscape · 1536 × 1024'),
                          ),
                          DropdownMenuItem(
                            value: '1024x1536',
                            child: Text('Portrait · 1024 × 1536'),
                          ),
                        ],
                      ),
                      FilledButton.icon(
                        onPressed: _isGenerating ? null : _generate,
                        icon: _isGenerating
                            ? const SizedBox.square(
                                dimension: 18,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.auto_awesome),
                        label: Text(
                          _isGenerating ? 'Generating…' : 'Generate image',
                        ),
                      ),
                    ],
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 16),
                    MaterialBanner(
                      content: Text(_error!),
                      actions: [
                        TextButton(
                          onPressed: () => setState(() => _error = null),
                          child: const Text('Dismiss'),
                        ),
                      ],
                    ),
                  ],
                  if (_isGenerating && _image == null) ...[
                    const SizedBox(height: 24),
                    const LinearProgressIndicator(),
                    const SizedBox(height: 8),
                    const Text(
                      'This may take up to a few minutes. Keep this page open.',
                      textAlign: TextAlign.center,
                    ),
                  ],
                  if (_image case final image?) ...[
                    const SizedBox(height: 24),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.memory(
                        image.bytes,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) => const Padding(
                          padding: EdgeInsets.all(24),
                          child: Text('The generated image could not be displayed.'),
                        ),
                      ),
                    ),
                    if (image.revisedPrompt case final revisedPrompt?)
                      Padding(
                        padding: const EdgeInsets.only(top: 12),
                        child: Text(
                          'Image prompt: $revisedPrompt',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
