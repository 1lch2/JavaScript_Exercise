/**
 * 节流函数 - 时间戳写法
 * @param {Function} fn 
 * @param {Number} delay 
 * @returns {Function}
 */
function throttleDate(fn, delay = 500) {
  let oldtime = Date.now();
  return function(...args) {
    let newtime = Date.now();
    if (newtime - oldtime >= delay) {
      fn.apply(null, args);
      oldtime = Date.now();
    }
  };
}

/**
 * 节流函数 - 定时器写法
 * @param {Function} fn 
 * @param {Number} delay 
 * @returns {Function}
 */
function throttledTimeout(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

export default {throttleDate, throttledTimeout};