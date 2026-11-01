export function addMilliseconds(date: Date, milliseconds: number): Date {
  if (!Number.isFinite(date.getTime()) || !Number.isFinite(milliseconds)) {
    throw new RangeError('Date and duration must be finite.');
  }
  return new Date(date.getTime() + milliseconds);
}

export function isWithinLast(date: Date, durationMs: number, now = Date.now()): boolean {
  return date.getTime() <= now && date.getTime() >= now - durationMs;
}
