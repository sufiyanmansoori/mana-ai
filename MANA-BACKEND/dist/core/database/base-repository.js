export class BaseRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    query(text, values = []) {
        return this.pool.query(text, [...values]);
    }
}
//# sourceMappingURL=base-repository.js.map