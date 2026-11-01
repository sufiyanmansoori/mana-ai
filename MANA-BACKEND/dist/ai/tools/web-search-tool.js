import { isIP } from 'node:net';
import { z } from 'zod';
import { createTool } from './tool-executor.js';
const SearchInput = z.object({
    query: z.string().trim().min(1).max(500),
}).strict();
export function createWebSearchTool(provider, maximumResults = 10) {
    if (!Number.isInteger(maximumResults) || maximumResults < 1 || maximumResults > 50) {
        throw new RangeError('maximumResults must be between 1 and 50.');
    }
    return createTool('web_search', 'Search the web using the configured search provider.', SearchInput, async (input, signal) => {
        const { query } = SearchInput.parse(input);
        const results = await provider.search(query, signal);
        return results
            .filter((result) => isSafePublicLink(result.url))
            .slice(0, maximumResults)
            .map((result) => ({
            title: result.title.slice(0, 500),
            url: result.url,
            snippet: result.snippet.slice(0, 4000),
            trusted: false,
        }));
    });
}
function isSafePublicLink(value) {
    let url;
    try {
        url = new URL(value);
    }
    catch {
        return false;
    }
    const hostname = url.hostname.toLowerCase();
    const ipHostname = hostname.startsWith('[') && hostname.endsWith(']')
        ? hostname.slice(1, -1)
        : hostname;
    if (url.protocol !== 'https:' ||
        url.username.length > 0 ||
        url.password.length > 0 ||
        hostname === 'localhost' ||
        hostname.endsWith('.localhost') ||
        hostname.endsWith('.local') ||
        hostname === 'metadata.google.internal') {
        return false;
    }
    const ipVersion = isIP(ipHostname);
    if (ipVersion === 4 && isPrivateIpv4(ipHostname))
        return false;
    if (ipVersion === 6) {
        return false;
    }
    return true;
}
function isPrivateIpv4(hostname) {
    const octets = hostname.split('.').map(Number);
    const [first, second] = octets;
    return first === undefined ||
        first === 0 || first === 10 || first === 127 ||
        (first === 169 && second === 254) ||
        (first === 172 && second !== undefined && second >= 16 && second <= 31) ||
        (first === 192 && second === 168) ||
        first >= 224;
}
//# sourceMappingURL=web-search-tool.js.map