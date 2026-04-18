// node callback 有两个条件：
// 1. 回调函数在主函数中的参数位置必须是最后一个
// 2. 回调函数参数中的第一个参数必须是 error
// 如下例所示

// 原有的callback调用

// fs.readFile('test.js', function(err, data) {
//   if (!err) {
//       console.log(data);
//   } else {
//       console.log(err);
//   }
// });

// promisify后

// var readFileAsync = promisify(fs.readFile);
// readFileAsync('test.js').then(data => {
//   console.log(data);
// }, err => {
//   console.log(err);
// });

/**
 * Convert callback function to promise-based function
 * @param {Function} fn node callback function
 */
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const callback = (err, ...results) => {
        if (err) {
          reject(err);
        } else {
          // 根据结果数量决定 resolve 的值
          // 0 个结果 -> undefined
          // 1 个结果 -> 直接传递该值
          // 多个结果 -> 以数组形式传递
          resolve(results.length <= 1 ? results[0] : results);
        }
      };

      // 将回调追加到参数列表，并调用原函数，保留 this 上下文
      fn.apply(this, [...args, callback]);
    });
  };
}

/**
 * test function
 * @param {Integer} arg1
 * @param {Integer} arg2
 * @param {Function} cb
 */
function test(arg1, arg2, cb) {
  let err = null;
  if (arg2 === 0) {
    err = new Error("err");
  }

  let data = arg1 / arg2;
  cb(err, data);
}

// original
test(1, 2, (err, data) => {
  if (err != null) {
    console.log(err);
  }

  console.log(data);
});

test(1, 0, (err, data) => {
  if (err != null) {
    console.log(err);
  }

  console.log(data);
});

// promisified
let _test = promisify(test);
_test(1, 2)
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
_test(1, 0)
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
