const IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/u;
const OPERATORS = new Set(['=', '<>', '<', '<=', '>', '>=']);
export class SelectQueryBuilder {
    table;
    columns;
    conditions = [];
    values = [];
    orderClause;
    limitValue;
    offsetValue;
    constructor(table, columns = ['*']) {
        this.table = table;
        this.columns = columns;
        this.assertIdentifier(table);
        for (const column of columns)
            if (column !== '*')
                this.assertIdentifier(column);
        if (columns.length === 0)
            throw new TypeError('At least one column must be selected.');
    }
    where(column, operator, value) {
        this.assertIdentifier(column);
        if (!OPERATORS.has(operator))
            throw new TypeError('SQL comparison operator is not supported.');
        this.values.push(value);
        this.conditions.push(`${column} ${operator} $${this.values.length}`);
        return this;
    }
    orderBy(column, direction = 'ASC') {
        this.assertIdentifier(column);
        if (direction !== 'ASC' && direction !== 'DESC') {
            throw new TypeError('SQL sort direction must be ASC or DESC.');
        }
        this.orderClause = `${column} ${direction}`;
        return this;
    }
    paginate(limit, offset = 0) {
        if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(offset) || offset < 0) {
            throw new RangeError('Pagination requires a positive limit and non-negative offset.');
        }
        this.limitValue = limit;
        this.offsetValue = offset;
        return this;
    }
    build() {
        let text = `SELECT ${this.columns.join(', ')} FROM ${this.table}`;
        if (this.conditions.length)
            text += ` WHERE ${this.conditions.join(' AND ')}`;
        if (this.orderClause)
            text += ` ORDER BY ${this.orderClause}`;
        if (this.limitValue !== undefined) {
            this.values.push(this.limitValue);
            text += ` LIMIT $${this.values.length}`;
        }
        if (this.offsetValue !== undefined) {
            this.values.push(this.offsetValue);
            text += ` OFFSET $${this.values.length}`;
        }
        return { text, values: [...this.values] };
    }
    assertIdentifier(value) {
        if (!IDENTIFIER.test(value))
            throw new TypeError('SQL identifiers must be simple unquoted names.');
    }
}
//# sourceMappingURL=query-builder.js.map