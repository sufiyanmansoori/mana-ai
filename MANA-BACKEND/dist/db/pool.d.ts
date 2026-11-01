import { Pool } from 'pg';
import type { AppConfig } from '../config.js';
export declare function createPool(config: AppConfig): Pool;
