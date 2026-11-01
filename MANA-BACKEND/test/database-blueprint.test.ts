import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import {
  DATABASE_MIGRATIONS,
  DATABASE_SEEDS,
  OPTIONAL_DATABASE_SQL,
} from '../src/database/index.js';

const databaseRoot = new URL('../src/database/', import.meta.url);

test('database blueprint manifest lists all migrations and seed files in dependency order', async () => {
  assert.equal(DATABASE_MIGRATIONS.length, 39);
  assert.equal(new Set(DATABASE_MIGRATIONS).size, 39);
  assert.equal(DATABASE_SEEDS.length, 6);
  assert.equal(new Set(DATABASE_SEEDS).size, 6);
  for (const filename of DATABASE_MIGRATIONS) {
    await readFile(new URL(`migrations/${filename}`, databaseRoot), 'utf8');
  }
  for (const filename of DATABASE_SEEDS) {
    await readFile(new URL(`seeds/${filename}`, databaseRoot), 'utf8');
  }
  await readFile(new URL(OPTIONAL_DATABASE_SQL.extensions, databaseRoot), 'utf8');
  await readFile(new URL(OPTIONAL_DATABASE_SQL.pgvector, databaseRoot), 'utf8');
});

test('sensitive identity data is stored as hashes or encrypted bytes', async () => {
  const sessionMigration = await readFile(
    new URL('migrations/0002-create-sessions.sql', databaseRoot), 'utf8',
  );
  const apiKeyMigration = await readFile(
    new URL('migrations/0004-create-api-keys.sql', databaseRoot), 'utf8',
  );
  const providerKeyMigration = await readFile(
    new URL('migrations/0034-create-provider-keys.sql', databaseRoot), 'utf8',
  );
  const adminSeed = await readFile(new URL('seeds/admin-user.sql', databaseRoot), 'utf8');
  assert.match(sessionMigration, /refresh_token_hash/u);
  assert.match(apiKeyMigration, /key_hash/u);
  assert.match(providerKeyMigration, /secret_ciphertext bytea/u);
  assert.match(adminSeed, /current_setting\('mana\.seed_admin_subject'/u);
});

test('pgvector setup remains optional and does not backfill unvalidated embeddings', async () => {
  const setup = await readFile(new URL(OPTIONAL_DATABASE_SQL.pgvector, databaseRoot), 'utf8');
  assert.match(setup, /CREATE EXTENSION IF NOT EXISTS vector/u);
  assert.match(setup, /ADD COLUMN IF NOT EXISTS embedding_vector vector/u);
  assert.doesNotMatch(setup, /\bUPDATE\b/u);
});
