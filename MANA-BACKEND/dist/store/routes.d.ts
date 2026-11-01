import { Router } from 'express';
import type { CatalogRepository } from './catalog-repository.js';
export declare function createStoreRouter(repository: CatalogRepository): Router;
