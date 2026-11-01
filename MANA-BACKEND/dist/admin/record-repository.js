import { ApiError } from '../errors.js';
import { AdminRecordIdSchema } from './record-schemas.js';
export class AdminRecordRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async list(input) {
        const position = input.cursor ? decodeCursor(input.cursor) : undefined;
        const values = [];
        let cursorFilter = '';
        if (position) {
            values.push(position.createdAt, position.id);
            cursorFilter = `WHERE (created_at < $1 OR (created_at = $1 AND id > $2))`;
        }
        values.push(input.limit + 1);
        const limitParameter = `$${values.length}`;
        const result = await this.pool.query(`SELECT id, created_at
       FROM admin_records
       ${cursorFilter}
       ORDER BY created_at DESC, id ASC
       LIMIT ${limitParameter}`, values);
        const hasMore = result.rows.length > input.limit;
        const rows = hasMore ? result.rows.slice(0, input.limit) : result.rows;
        const records = rows.map(toRecord);
        return {
            records,
            nextCursor: hasMore ? encodeCursor(records[records.length - 1]) : null,
        };
    }
    async getById(id) {
        const result = await this.pool.query(`SELECT id, created_at FROM admin_records WHERE id = $1`, [validateId(id)]);
        const row = result.rows[0];
        return row ? toRecord(row) : null;
    }
    async save(record) {
        const id = validateId(record.id);
        if (!(record.createdAt instanceof Date) || !Number.isFinite(record.createdAt.getTime())) {
            throw new ApiError(400, 'invalid_record_timestamp', 'A valid record timestamp is required.');
        }
        const result = await this.pool.query(`INSERT INTO admin_records (id, created_at)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET created_at = EXCLUDED.created_at
       RETURNING id, created_at`, [id, record.createdAt]);
        return toRecord(result.rows[0]);
    }
    async delete(id) {
        await this.pool.query('DELETE FROM admin_records WHERE id = $1', [validateId(id)]);
    }
}
function validateId(id) {
    const result = AdminRecordIdSchema.safeParse(id);
    if (!result.success) {
        throw new ApiError(400, 'invalid_admin_record_id', 'The admin record ID is invalid.');
    }
    return result.data;
}
function toRecord(row) {
    return {
        id: row.id,
        createdAt: row.created_at,
    };
}
function encodeCursor(record) {
    return Buffer.from(JSON.stringify({
        createdAt: record.createdAt.toISOString(),
        id: record.id,
    })).toString('base64url');
}
function decodeCursor(token) {
    try {
        if (!/^[A-Za-z0-9_-]+$/.test(token))
            throw new Error('Malformed cursor.');
        const decoded = Buffer.from(token, 'base64url').toString('utf8');
        if (Buffer.from(decoded).toString('base64url') !== token) {
            throw new Error('Non-canonical cursor.');
        }
        const value = JSON.parse(decoded);
        if (value === null ||
            typeof value !== 'object' ||
            !('createdAt' in value) ||
            !('id' in value) ||
            typeof value.createdAt !== 'string' ||
            typeof value.id !== 'string') {
            throw new Error('Invalid cursor payload.');
        }
        const createdAt = new Date(value.createdAt);
        if (!Number.isFinite(createdAt.getTime()) ||
            createdAt.toISOString() !== value.createdAt) {
            throw new Error('Invalid cursor timestamp.');
        }
        return { createdAt, id: validateId(value.id) };
    }
    catch {
        throw new ApiError(400, 'invalid_cursor', 'The pagination cursor is invalid.');
    }
}
//# sourceMappingURL=record-repository.js.map