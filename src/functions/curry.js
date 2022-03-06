/**
 * Curry化
 * 
 * @param {Function} func 带有多个参数的函数
 * @returns {Function} Curry化后只使用一个参数的函数
 */
function curry(fn, currArgs) {
  return function() {
    // 将 arguments 数组化
    let args = Array.prototype.slice.call(arguments);

    // 首次调用时，若未提供最后一个参数currArgs，则不用进行args的拼接
    if (currArgs !== undefined) {
      args = args.concat(currArgs);
    }

    // 当拼接参数的数量小于原函数参数数量时，递归调用
    if (args.length < fn.length) {
      return curry(fn, args);
    }

    // 递归出口
    return fn.apply(null, args);
  };
}


function sum3(a, b, c) {
  return a + b + c;
}

(function() {
  const curriedSum3 = curry(sum3);
  console.log(curriedSum3(1)(2)(3));
  console.log(sum3(1, 2, 3));
})();