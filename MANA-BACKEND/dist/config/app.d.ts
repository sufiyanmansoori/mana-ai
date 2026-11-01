import type { ParsedEnvironment } from './env-schema.js';
export interface AppRuntimeConfig {
    environment: ParsedEnvironment['NODE_ENV'];
    host: string;
    port: number;
    shutdownTimeoutMs: number;
}
export declare function createAppRuntimeConfig(env: ParsedEnvironment): AppRuntimeConfig;
