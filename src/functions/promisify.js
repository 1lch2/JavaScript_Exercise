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
 * @param {Function} func node callback function
 */
function promisify(func) {
  return function() {
    // 保存一份函数的 this
    let that = this;
    // 保存原函数的参数
    const args = Array.prototype.slice.call(arguments);
    // 返回一个 promise 
    return new Promise((resolve, reject) => {
      func.apply(that, [].concat(args).concat([(err, res) => {
        if (err != null) {
          return reject(err);
        }
        resolve(res);
      }]));
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
  if(arg2 === 0) {
    err = new Error("err");
  }

  let data = arg1 / arg2;
  cb(err, data);
}

// original
test(1, 2, (err, data) => {
  if(err != null) {
    console.log(err);
  }
  
  console.log(data);
});

test(1, 0, (err, data) => {
  if(err != null) {
    console.log(err);
  }
  
  console.log(data);
});

// promisified
let _test = promisify(test);
_test(1, 2).then(data => console.log(data)).catch(err => console.log(err));
_test(1, 0).then(data => console.log(data)).catch(err => console.log(err));