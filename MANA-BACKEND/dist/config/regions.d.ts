import type { ParsedEnvironment } from './env-schema.js';
export interface RegionsRuntimeConfig {
    current: string;
    available: string[];
    multiRegion: boolean;
}
export declare function createRegionsRuntimeConfig(env: ParsedEnvironment): RegionsRuntimeConfig;
