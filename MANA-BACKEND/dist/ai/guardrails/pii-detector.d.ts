export type PiiType = 'email' | 'phone' | 'payment_card';
export interface PiiMatch {
    type: PiiType;
    start: number;
    end: number;
    value: string;
}
export declare function detectPii(text: string): PiiMatch[];
export declare function redactPii(text: string, replacement?: string): string;
