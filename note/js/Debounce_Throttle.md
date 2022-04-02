# 防抖与节流

## 防抖
在第一次触发事件时，不立即执行函数，等待指定的事件，如果在时间阈值内又被触发，则重新计时。

```js
/**
 * 防抖函数
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
```

### 效果
设事件阈值为 n。

若每次触发后的 n 时间内继续触发，则会一直等待到最后一次触发，等待阈值时间后触发一次。

若距离上一次触发超过了 n 秒，则正常触发下一次。

## 节流
每隔一段时间，只执行一次函数。

```js
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
```

### 效果
在规定时间阈值内触发多次，会先执行一次。

若在一段较长时间内，以小于阈值的间隔连续不断触发，则会每隔阈值时间运行一次。