import pino from 'pino';
export declare function createLogger(level: string): pino.Logger<never, boolean>;
export type AppLogger = ReturnType<typeof createLogger>;
