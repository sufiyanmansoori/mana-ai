export function truncate(value: string, maximum: number, suffix = '…'): string {
  if (!Number.isSafeInteger(maximum) || maximum < 0) throw new RangeError('Maximum length must be non-negative.');
  if (value.length <= maximum) return value;
  if (maximum <= suffix.length) return suffix.slice(0, maximum);
  return value.slice(0, maximum - suffix.length) + suffix;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}
