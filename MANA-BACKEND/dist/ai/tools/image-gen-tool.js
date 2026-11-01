import { z } from 'zod';
import { createTool } from './tool-executor.js';
const ImageInput = z.object({
    prompt: z.string().trim().min(1).max(4000),
    size: z.enum(['1024x1024', '1536x1024', '1024x1536']).default('1024x1024'),
}).strict();
export function createImageGenerationTool(provider) {
    return createTool('generate_image', 'Generate one image with the configured image provider.', ImageInput, async (input) => {
        const parsed = ImageInput.parse(input);
        return provider.generate(parsed);
    });
}
//# sourceMappingURL=image-gen-tool.js.map