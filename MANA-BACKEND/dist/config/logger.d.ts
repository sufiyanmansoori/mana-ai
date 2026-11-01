import pino from 'pino';
import type { ParsedEnvironment } from './env-schema.js';
export interface LoggerRuntimeConfig {
    level: ParsedEnvironment['LOG_LEVEL'];
    serviceName: string;
    redactPaths: string[];
}
export declare function createLoggerRuntimeConfig(env: ParsedEnvironment): LoggerRuntimeConfig;
export declare function createConfiguredLogger(config: LoggerRuntimeConfig): pino.Logger<never, boolean>;
