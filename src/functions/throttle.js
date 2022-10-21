/**
 * 节流函数 - 定时器写法
 * @param {Function} func
 * @param {Number} delay 
 * @returns {Function}
 */
export function throttledTimeout(func, delay = 500) {
  // 标记位
  let flag = true;

  return function(...args) {
    if (!flag) {
      return;
    }

    flag = false;
    setTimeout(() => {
      func.apply(this, args);
      flag = true;
    }, delay);
  };
}
