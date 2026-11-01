export function createVectorDbRuntimeConfig(env) {
    return {
        enabled: env.VECTOR_DB_ENABLED,
        provider: 'pgvector',
        dimensions: env.VECTOR_DB_DIMENSIONS,
        table: env.VECTOR_DB_TABLE,
    };
}
//# sourceMappingURL=vector-db.js.map