/**
 * @param {Function[]} middlewares 
 * @return {Function} Composed middlewares
 */
function compose(middlewares) {
  return () => {
    // 启动调用
    dispatch(0);

    function dispatch(index) {
      const func = middlewares[index];

      // 取到 undefined 时停止
      if(!func) {
        return null;
      }

      // next 函数负责调用下一个中间件
      func(function next() {
        dispatch(index + 1);
      });
    }
  };
}


// 用例测试
async function mid1(next) {
  console.log(1);
  await next();
  console.log(4);
}

async function mid2(next) {
  console.log(2);
  await next();
  console.log(5);
}

async function mid3(next) {
  console.log(3);
  await next();
  console.log(6);
}

const middleware = [mid1, mid2, mid3];
compose(middleware)(); // 1 2 3 6 5 4
