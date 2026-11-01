export interface CacheTagIndex {
  add(tag: string, key: string): Promise<void>;
  keys(tag: string): Promise<readonly string[]>;
  remove(tag: string, key: string): Promise<void>;
}

export interface CacheKeyDeleter {
  delete(key: string): Promise<void>;
}

export class MemoryCacheTagIndex implements CacheTagIndex {
  private readonly entries = new Map<string, Set<string>>();

  async add(tag: string, key: string): Promise<void> {
    validatePart(tag, 'tag');
    validatePart(key, 'key');
    const keys = this.entries.get(tag) ?? new Set<string>();
    keys.add(key);
    this.entries.set(tag, keys);
  }

  async keys(tag: string): Promise<readonly string[]> {
    validatePart(tag, 'tag');
    return [...(this.entries.get(tag) ?? [])];
  }

  async remove(tag: string, key: string): Promise<void> {
    validatePart(tag, 'tag');
    validatePart(key, 'key');
    const keys = this.entries.get(tag);
    if (!keys) return;
    keys.delete(key);
    if (keys.size === 0) this.entries.delete(tag);
  }
}

export async function invalidateTag(
  tag: string,
  index: CacheTagIndex,
  cache: CacheKeyDeleter,
): Promise<number> {
  validatePart(tag, 'tag');
  const keys = await index.keys(tag);
  const results = await Promise.allSettled(keys.map(async (key) => {
    await cache.delete(key);
    await index.remove(tag, key);
  }));
  const errors = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result) => result.reason);
  if (errors.length > 0) {
    throw new AggregateError(errors, `Failed to invalidate every cache entry for tag "${tag}".`);
  }
  return keys.length;
}

function validatePart(value: string, name: string): void {
  if (value.trim().length === 0) throw new TypeError(`Cache ${name} is required.`);
}
