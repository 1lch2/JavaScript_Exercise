/**
 * 返回一个缓存结果的函数
 * 
 * @copyright https://github.com/features/copilot
 * @param {Function} fn 输入函数
 * @returns {Function} 带缓存的函数
 */
function memoize(fn) {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    return (cache[key] = cache[key] || fn(...args));
  };
}