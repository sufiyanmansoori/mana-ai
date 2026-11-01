export interface SseEvent<T> {
  event?: string;
  id?: string;
  data: T;
}

export function formatSseEvent<T>(input: SseEvent<T>): string {
  const lines: string[] = [];
  if (input.id !== undefined) {
    if (/[\r\n\0]/u.test(input.id)) throw new TypeError('SSE event IDs cannot contain line breaks or nulls.');
    lines.push(`id: ${input.id}`);
  }
  if (input.event !== undefined) {
    if (!/^[A-Za-z0-9_.-]+$/u.test(input.event)) throw new TypeError('SSE event names contain invalid characters.');
    lines.push(`event: ${input.event}`);
  }
  const serialized = JSON.stringify(input.data);
  if (serialized === undefined) throw new TypeError('SSE event data must be JSON serializable.');
  for (const line of serialized.split(/\r?\n/u)) lines.push(`data: ${line}`);
  return `${lines.join('\n')}\n\n`;
}
