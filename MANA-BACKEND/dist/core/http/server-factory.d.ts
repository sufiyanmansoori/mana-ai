import { type Express } from 'express';
export declare function createHttpServer(configure: (app: Express) => void): Express;
