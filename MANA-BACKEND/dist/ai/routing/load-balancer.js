export function createWeightedLoadBalancer(routes) {
    const active = routes.filter((route) => route.enabled !== false);
    if (active.length === 0)
        throw new RangeError('At least one enabled route is required.');
    for (const route of active) {
        if (!Number.isInteger(route.weight) || route.weight < 1 || route.weight > 100) {
            throw new RangeError('Route weights must be positive integers no greater than 100.');
        }
    }
    const totalWeight = active.reduce((total, route) => total + route.weight, 0);
    if (totalWeight > 1000)
        throw new RangeError('Combined route weight must not exceed 1000.');
    const schedule = active.flatMap((route) => Array.from({ length: route.weight }, () => route.value));
    let index = 0;
    return () => {
        const selected = schedule[index % schedule.length];
        index = (index + 1) % schedule.length;
        if (selected === undefined)
            throw new Error('Weighted route schedule is empty.');
        return selected;
    };
}
//# sourceMappingURL=load-balancer.js.map