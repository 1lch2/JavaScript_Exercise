/**
 * 防抖函数
 * 
 * n 秒后再执行该事件，若在 n 秒内被重复触发，则重新计时
 * 
 * @param {Function} func 待进行防抖处理的函数
 * @param {Number} timeout 等待时间阈值
 * @returns {Function} 经过防抖处理的函数
 */
function debounce(func, timeout) {
  let timer = null;

  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export default debounce;