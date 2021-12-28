"use strict";

/**
 * compose a series of functions using forEach
 * @param  {...Function} funcs composable functions
 * @returns {Function} composed function
 */
function composeForEach(...funcs) {
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

/**
 * compose functions using reduce
 * @param  {...Function} funcs composable functions(accept one arg)
 * @returns {Function} composed function
 */
function composeReduce(...funcs) {
  return function (input) {
    funcs.reduceRight((prev, fn) => fn(prev), input);
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
  let composedForEach = composeForEach(add, multiply, sq);
  console.log(composedForEach(1));

  let composedReduce = composeReduce(add, multiply, sq);
  console.log(composedReduce(1)); // TODO: undefined error
}

testCompose();