export function debounce<Args extends unknown[]>(
  operation: (...args: Args) => void,
  delayMs: number,
): (...args: Args) => void {
  if (!Number.isFinite(delayMs) || delayMs < 0) throw new RangeError('Debounce delay must not be negative.');
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      operation(...args);
    }, delayMs);
  };
}
