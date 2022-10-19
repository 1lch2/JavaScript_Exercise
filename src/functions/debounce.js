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
  let timer;

  return function() {
    // 保存this的指向
    let context = this;
    // 获取event对象
    let args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function() {
      func.apply(context, args);
    }, timeout);
  };
}

export default debounce;