import type { ProviderMessage } from '../providers/base-provider.provider.js';
import { buildContextMessage, type ContextDocument } from './context-builder.js';
import { truncateHistory, type HistoryLimits } from './history-truncator.js';
import { buildPersonaInstruction } from './persona-injector.js';
import { DEFAULT_SYSTEM_PROMPT } from './system-prompts.js';

export interface PromptInput {
  history: readonly ProviderMessage[];
  userMessage: string;
  persona?: string;
  context?: readonly ContextDocument[];
  systemPrompt?: string;
}

export function buildPrompt(
  input: PromptInput,
  limits: HistoryLimits,
): ProviderMessage[] {
  if (!Number.isInteger(limits.maxMessages) || limits.maxMessages < 2) {
    throw new RangeError('maxMessages must allow a system prompt and a user message.');
  }
  if (!Number.isInteger(limits.maxCharacters) || limits.maxCharacters < 1) {
    throw new RangeError('maxCharacters must be a positive integer.');
  }
  if (input.userMessage.trim().length === 0) {
    throw new TypeError('The latest user message must not be empty.');
  }
  const systemParts = [
    input.systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT,
    input.persona ? buildPersonaInstruction(input.persona) : '',
    input.context ? buildContextMessage(input.context) ?? '' : '',
  ].filter(Boolean);
  const systemContent = systemParts.join('\n\n');
  const remainingCharacters = limits.maxCharacters - systemContent.length - input.userMessage.length;
  if (remainingCharacters < 0) {
    throw new RangeError('The system prompt and latest user message exceed the configured character limit.');
  }
  const historyCapacity = limits.maxMessages - 2;
  const history = historyCapacity > 0 && remainingCharacters > 0
    ? truncateHistory(input.history, {
      maxMessages: historyCapacity,
      maxCharacters: remainingCharacters,
    }).filter((message) => message.role !== 'system')
    : [];

  return [
    { role: 'system', content: systemContent },
    ...history,
    { role: 'user', content: input.userMessage },
  ];
}
