export type PiiType = 'email' | 'phone' | 'payment_card';

export interface PiiMatch {
  type: PiiType;
  start: number;
  end: number;
  value: string;
}

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu;
const PHONE_PATTERN = /(?<!\w)(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)\d{3,4}[\s.-]?\d{3,4}(?!\w)/gu;
const CARD_PATTERN = /(?<!\d)(?:\d[ -]?){13,19}(?!\d)/gu;

export function detectPii(text: string): PiiMatch[] {
  const matches: PiiMatch[] = [];
  addMatches(matches, text, EMAIL_PATTERN, 'email');
  addMatches(matches, text, CARD_PATTERN, 'payment_card', (value) => isLuhnValid(value));
  addMatches(matches, text, PHONE_PATTERN, 'phone');

  const priority: Record<PiiType, number> = { email: 0, payment_card: 1, phone: 2 };
  const nonOverlapping: PiiMatch[] = [];
  for (const match of matches.sort((left, right) =>
    priority[left.type] - priority[right.type] || left.start - right.start
  )) {
    if (nonOverlapping.some((existing) => match.start < existing.end && match.end > existing.start)) {
      continue;
    }
    nonOverlapping.push(match);
  }
  return nonOverlapping.sort((left, right) => left.start - right.start);
}

export function redactPii(text: string, replacement = '[REDACTED]'): string {
  const matches = detectPii(text).sort((left, right) => right.start - left.start);
  let redacted = text;
  for (const match of matches) {
    redacted = `${redacted.slice(0, match.start)}${replacement}${redacted.slice(match.end)}`;
  }
  return redacted;
}

function addMatches(
  result: PiiMatch[],
  text: string,
  pattern: RegExp,
  type: PiiType,
  validate: (value: string) => boolean = () => true,
): void {
  pattern.lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    const value = match[0];
    const start = match.index;
    if (start === undefined || !validate(value)) continue;
    result.push({ type, start, end: start + value.length, value });
  }
}

function isLuhnValid(value: string): boolean {
  const digits = value.replace(/\D/gu, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}
