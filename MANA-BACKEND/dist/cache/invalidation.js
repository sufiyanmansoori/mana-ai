export class MemoryCacheTagIndex {
    entries = new Map();
    async add(tag, key) {
        validatePart(tag, 'tag');
        validatePart(key, 'key');
        const keys = this.entries.get(tag) ?? new Set();
        keys.add(key);
        this.entries.set(tag, keys);
    }
    async keys(tag) {
        validatePart(tag, 'tag');
        return [...(this.entries.get(tag) ?? [])];
    }
    async remove(tag, key) {
        validatePart(tag, 'tag');
        validatePart(key, 'key');
        const keys = this.entries.get(tag);
        if (!keys)
            return;
        keys.delete(key);
        if (keys.size === 0)
            this.entries.delete(tag);
    }
}
export async function invalidateTag(tag, index, cache) {
    validatePart(tag, 'tag');
    const keys = await index.keys(tag);
    const results = await Promise.allSettled(keys.map(async (key) => {
        await cache.delete(key);
        await index.remove(tag, key);
    }));
    const errors = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason);
    if (errors.length > 0) {
        throw new AggregateError(errors, `Failed to invalidate every cache entry for tag "${tag}".`);
    }
    return keys.length;
}
function validatePart(value, name) {
    if (value.trim().length === 0)
        throw new TypeError(`Cache ${name} is required.`);
}
//# sourceMappingURL=invalidation.js.map