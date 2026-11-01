const IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/u;
const OPERATORS = new Set(['=', '<>', '<', '<=', '>', '>=']);

export class SelectQueryBuilder {
  private readonly conditions: string[] = [];
  private readonly values: unknown[] = [];
  private orderClause?: string;
  private limitValue?: number;
  private offsetValue?: number;

  constructor(private readonly table: string, private readonly columns: readonly string[] = ['*']) {
    this.assertIdentifier(table);
    for (const column of columns) if (column !== '*') this.assertIdentifier(column);
    if (columns.length === 0) throw new TypeError('At least one column must be selected.');
  }

  where(column: string, operator: '=' | '<>' | '<' | '<=' | '>' | '>=', value: unknown): this {
    this.assertIdentifier(column);
    if (!OPERATORS.has(operator)) throw new TypeError('SQL comparison operator is not supported.');
    this.values.push(value);
    this.conditions.push(`${column} ${operator} $${this.values.length}`);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.assertIdentifier(column);
    if (direction !== 'ASC' && direction !== 'DESC') {
      throw new TypeError('SQL sort direction must be ASC or DESC.');
    }
    this.orderClause = `${column} ${direction}`;
    return this;
  }

  paginate(limit: number, offset = 0): this {
    if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(offset) || offset < 0) {
      throw new RangeError('Pagination requires a positive limit and non-negative offset.');
    }
    this.limitValue = limit;
    this.offsetValue = offset;
    return this;
  }

  build(): { text: string; values: unknown[] } {
    let text = `SELECT ${this.columns.join(', ')} FROM ${this.table}`;
    if (this.conditions.length) text += ` WHERE ${this.conditions.join(' AND ')}`;
    if (this.orderClause) text += ` ORDER BY ${this.orderClause}`;
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

  private assertIdentifier(value: string): void {
    if (!IDENTIFIER.test(value)) throw new TypeError('SQL identifiers must be simple unquoted names.');
  }
}
