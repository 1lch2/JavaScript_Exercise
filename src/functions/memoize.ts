type Fn = (...params: number[]) => number;

/**
 * 记忆函数是一个对于相同的输入永远不会被调用两次的函数。对于同样参数的调用，它将返回一个缓存值。
 */
function memoize(fn: Fn): Fn {
  const cache = new Map<string, any>();
  return function (...args) {
    const serialized = JSON.stringify(args);
    if (cache.has(serialized)) {
      return cache.get(serialized);
    } else {
      const result = fn(...args);
      cache.set(serialized, result);
      return result;
    }
  };
}
