export declare class SelectQueryBuilder {
    private readonly table;
    private readonly columns;
    private readonly conditions;
    private readonly values;
    private orderClause?;
    private limitValue?;
    private offsetValue?;
    constructor(table: string, columns?: readonly string[]);
    where(column: string, operator: '=' | '<>' | '<' | '<=' | '>' | '>=', value: unknown): this;
    orderBy(column: string, direction?: 'ASC' | 'DESC'): this;
    paginate(limit: number, offset?: number): this;
    build(): {
        text: string;
        values: unknown[];
    };
    private assertIdentifier;
}
