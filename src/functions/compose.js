/**
 * compose a series of functions
 * @param  {...Function} funcs composable functions
 * @returns {Function} composed function
 */
function compose(...funcs) {
  funcs = funcs.reverse();
  return function (...args) {
    let res;
    funcs.forEach((fn, index) => {
      if (index == 0) {
        res = fn.apply(this, args);
      } else {
        res = fn(res);
      }
    })
    return res;
  }
}

function testCompose() {
  function add(input) {
    return input + 5;
  }

  function multiply(input) {
    return input * 2;
  }

  function sq(input) {
    return input ** 2;
  }

  // functions run from right to left
  let composed = compose(add, multiply, sq);
  console.log(composed(1));
}

testCompose();