import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Pool } from 'pg';
import { CatalogRepository } from '../src/store/catalog-repository.js';

test('catalog search escapes SQL wildcards and binds every filter value', async () => {
  const queries: Array<{ sql: string; values: unknown[] }> = [];
  const pool = {
    async query(sql: string, values: unknown[] = []) {
      queries.push({ sql, values });
      if (sql.includes('COUNT(*)')) return { rows: [{ total: 3 }], rowCount: 1 };
      return { rows: [], rowCount: 0 };
    },
  } as unknown as Pool;
  const repository = new CatalogRepository(pool);

  const result = await repository.listProducts({
    category: 'mobiles',
    query: '100%_\\ phone',
    sort: 'price_asc',
    page: 2,
    limit: 12,
  });

  assert.deepEqual(result, { data: [], total: 3 });
  assert.deepEqual(queries[0]?.values, ['mobiles', '%100\\%\\_\\\\ phone%']);
  assert.match(queries[0]!.sql, /p\.name ILIKE \$2 ESCAPE/);
  assert.deepEqual(queries[1]?.values, ['mobiles', '%100\\%\\_\\\\ phone%', 12, 12]);
  assert.match(queries[1]!.sql, /ORDER BY p\.price_paise ASC, p\.id/);
});

test('product lookup binds the slug and excludes inactive inventory', async () => {
  const queries: Array<{ sql: string; values: unknown[] }> = [];
  const pool = {
    async query(sql: string, values: unknown[] = []) {
      queries.push({ sql, values });
      return { rows: [], rowCount: 0 };
    },
  } as unknown as Pool;
  const repository = new CatalogRepository(pool);

  assert.equal(await repository.getProduct('everyday-phone'), undefined);
  assert.deepEqual(queries[0]?.values, ['everyday-phone']);
  assert.match(queries[0]!.sql, /p\.status = 'active'/);
  assert.match(queries[0]!.sql, /p\.stock_quantity > 0/);
  assert.match(queries[0]!.sql, /c\.is_active/);
});
