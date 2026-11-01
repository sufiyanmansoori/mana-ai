import { ADMIN_AUDIT_ACTION } from '../constants/events.js';
import { ERROR_CODES } from '../constants/error-codes.js';
import { ApiError } from '../errors.js';
export class AdminFeatureFlagRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async list() {
        const result = await this.pool.query(`SELECT flag_key AS key, description, enabled, created_at, updated_at, updated_by
       FROM admin_feature_flags
       ORDER BY flag_key
       LIMIT 500`);
        return result.rows;
    }
    async listAudit(limit) {
        const result = await this.pool.query(`SELECT id::text, flag_key AS key, action, actor_subject,
              previous_value, new_value, occurred_at
       FROM admin_feature_flag_audit
       ORDER BY occurred_at DESC, id DESC
       LIMIT $1`, [limit]);
        return result.rows;
    }
    async create(input) {
        return this._inTransaction(async (client) => {
            const result = await client.query(`INSERT INTO admin_feature_flags (
           flag_key, description, enabled, updated_by
         ) VALUES ($1, $2, $3, $4)
         RETURNING flag_key AS key, description, enabled, created_at, updated_at, updated_by`, [input.key, input.description, input.enabled, input.actorSubject]);
            const created = result.rows[0];
            await this._writeAudit(client, {
                key: input.key,
                action: ADMIN_AUDIT_ACTION.created,
                actorSubject: input.actorSubject,
                newValue: this._auditValue(created),
            });
            return created;
        });
    }
    async setEnabled(input) {
        return this._inTransaction(async (client) => {
            const currentResult = await client.query(`SELECT flag_key AS key, description, enabled, created_at, updated_at, updated_by
         FROM admin_feature_flags
         WHERE flag_key = $1
         FOR UPDATE`, [input.key]);
            const current = currentResult.rows[0];
            if (!current) {
                throw new ApiError(404, ERROR_CODES.featureFlagNotFound, 'The feature flag was not found.');
            }
            if (current.enabled === input.enabled)
                return current;
            const result = await client.query(`UPDATE admin_feature_flags
         SET enabled = $2, updated_by = $3, updated_at = now()
         WHERE flag_key = $1
         RETURNING flag_key AS key, description, enabled, created_at, updated_at, updated_by`, [input.key, input.enabled, input.actorSubject]);
            const updated = result.rows[0];
            await this._writeAudit(client, {
                key: input.key,
                action: ADMIN_AUDIT_ACTION.updated,
                actorSubject: input.actorSubject,
                previousValue: this._auditValue(current),
                newValue: this._auditValue(updated),
            });
            return updated;
        });
    }
    async delete(input) {
        await this._inTransaction(async (client) => {
            const result = await client.query(`SELECT flag_key AS key, description, enabled, created_at, updated_at, updated_by
         FROM admin_feature_flags
         WHERE flag_key = $1
         FOR UPDATE`, [input.key]);
            const current = result.rows[0];
            if (!current) {
                throw new ApiError(404, ERROR_CODES.featureFlagNotFound, 'The feature flag was not found.');
            }
            await client.query('DELETE FROM admin_feature_flags WHERE flag_key = $1', [input.key]);
            await this._writeAudit(client, {
                key: input.key,
                action: ADMIN_AUDIT_ACTION.deleted,
                actorSubject: input.actorSubject,
                previousValue: this._auditValue(current),
            });
        });
    }
    async _inTransaction(operation) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await operation(client);
            await client.query('COMMIT');
            return result;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async _writeAudit(client, entry) {
        await client.query(`INSERT INTO admin_feature_flag_audit (
         flag_key, action, actor_subject, previous_value, new_value
       ) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)`, [
            entry.key,
            entry.action,
            entry.actorSubject,
            entry.previousValue ? JSON.stringify(entry.previousValue) : null,
            entry.newValue ? JSON.stringify(entry.newValue) : null,
        ]);
    }
    _auditValue(flag) {
        return {
            key: flag.key,
            description: flag.description,
            enabled: flag.enabled,
            updated_by: flag.updated_by,
        };
    }
}
//# sourceMappingURL=feature-flag-repository.js.map