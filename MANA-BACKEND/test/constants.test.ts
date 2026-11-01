import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CACHE_NAMESPACES,
  CACHE_TTLS_SECONDS,
  createCacheKey,
} from '../src/constants/cache-keys.js';
import { DOMAIN_EVENTS, ADMIN_AUDIT_ACTION, ADMIN_AUDIT_ACTIONS } from '../src/constants/events.js';
import { ERROR_CODES } from '../src/constants/error-codes.js';
import { HTTP_STATUS } from '../src/constants/http-status.js';
import { LIMITS } from '../src/constants/limits.js';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isSupportedLocale } from '../src/constants/locales.js';
import {
  DEFAULT_CHAT_MODEL_ID,
  DEFAULT_IMAGE_MODEL_ID,
  MODEL_ID_PATTERN,
  parseModelAllowlist,
} from '../src/constants/model-ids.js';
import { PERMISSIONS, ROLE_PERMISSIONS } from '../src/constants/permissions.js';
import { BILLING_INTERVALS, SUBSCRIPTION_STATUSES } from '../src/constants/plans.js';
import { QUEUE_NAMES } from '../src/constants/queues.js';
import { REGEX } from '../src/constants/regex.js';
import { ROLES, resolveRole, roleHasPermission } from '../src/constants/roles.js';

test('cache key builder namespaces keys and rejects unsafe parts', () => {
  assert.equal(
    createCacheKey(CACHE_NAMESPACES.conversation, 'user-1', 'conversation-1'),
    'mana-ai:conversation:user-1:conversation-1',
  );
  assert.throws(() => createCacheKey(CACHE_NAMESPACES.session, 'unsafe/value'), TypeError);
  assert.equal(CACHE_TTLS_SECONDS.productCategories, 60);
});

test('model allowlist enforces valid unique IDs and includes the selected model', () => {
  assert.deepEqual(parseModelAllowlist(undefined, DEFAULT_CHAT_MODEL_ID), [DEFAULT_CHAT_MODEL_ID]);
  assert.deepEqual(parseModelAllowlist('model-a, model-b', 'model-a'), ['model-a', 'model-b']);
  assert.equal(MODEL_ID_PATTERN.test(DEFAULT_IMAGE_MODEL_ID), true);
  assert.throws(() => parseModelAllowlist('model-a,model-a', 'model-a'), /unique/u);
  assert.throws(() => parseModelAllowlist('model-a,invalid/model', 'model-a'), /valid model IDs/u);
  assert.throws(() => parseModelAllowlist('model-a', 'model-b'), /AI_MODEL/u);
});

test('role permissions preserve the exact configured-admin allowlist', () => {
  assert.equal(resolveRole('admin-1', ['admin-1']), ROLES.admin);
  assert.equal(resolveRole('admin-2', ['admin-1']), ROLES.user);
  assert.equal(roleHasPermission(ROLES.admin, PERMISSIONS.adminRecordsManage), true);
  assert.equal(roleHasPermission(ROLES.user, PERMISSIONS.adminRecordsManage), false);
  assert.equal(roleHasPermission(ROLES.user, PERMISSIONS.conversationReadOwn), true);
  assert.deepEqual(ROLE_PERMISSIONS.admin.slice(-2), [
    PERMISSIONS.adminFeatureFlagsManage,
    PERMISSIONS.adminRecordsManage,
  ]);
});

test('shared constants expose stable syntax and domain values', () => {
  assert.equal(isSupportedLocale(DEFAULT_LOCALE), true);
  assert.equal(SUPPORTED_LOCALES.includes('hi'), true);
  assert.equal(REGEX.slug.test('everyday-phone'), true);
  assert.equal(REGEX.slug.test('../admin'), false);
  assert.equal(ERROR_CODES.validationError, 'validation_error');
  assert.equal(HTTP_STATUS.TOO_MANY_REQUESTS, 429);
  assert.equal(LIMITS.chatInputMessages.max, 100);
  assert.equal(DOMAIN_EVENTS.chatResponseCompleted, 'chat.response.completed');
  assert.deepEqual(ADMIN_AUDIT_ACTIONS, ['created', 'updated', 'deleted']);
  assert.equal(ADMIN_AUDIT_ACTION.deleted, 'deleted');
  assert.equal(QUEUE_NAMES.documentProcessing, 'document-processing');
  assert.deepEqual(SUBSCRIPTION_STATUSES, ['trialing', 'active', 'past_due', 'canceled', 'incomplete']);
  assert.deepEqual(BILLING_INTERVALS, ['month', 'year']);
});
