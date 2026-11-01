import type { Writable } from 'node:stream';

export async function writeWithBackpressure(
  writable: Writable,
  chunk: string | Uint8Array,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) throw signal.reason;
  if (writable.destroyed || writable.writableEnded) {
    throw new Error('Cannot write to a closed stream.');
  }
  if (writable.write(chunk)) return;

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      writable.off('drain', onDrain);
      writable.off('error', onError);
      writable.off('close', onClose);
      signal?.removeEventListener('abort', onAbort);
    };
    const onDrain = () => {
      cleanup();
      resolve();
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onClose = () => {
      cleanup();
      reject(new Error('Stream closed while waiting for backpressure to clear.'));
    };
    const onAbort = () => {
      cleanup();
      reject(signal?.reason);
    };

    writable.once('drain', onDrain);
    writable.once('error', onError);
    writable.once('close', onClose);
    signal?.addEventListener('abort', onAbort, { once: true });
    if (signal?.aborted) onAbort();
  });
  if (writable.destroyed || writable.writableEnded) {
    throw new Error('Stream closed while waiting for backpressure to clear.');
  }
}
