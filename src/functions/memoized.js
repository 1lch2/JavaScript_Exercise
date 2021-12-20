/**
 * memoized any pure function
 * 
 * @param {Function} fn pure function that will be memoized
 * @returns a memoized function
 */
function memoize(fn) {
  let lastRes;
  let isCalculated = false;

  return function() {
    if (isCalculated) {
      console.log(">>> Memoized result >>>")
      return lastRes;
    }
    let res = fn();
    lastRes = res;
    isCalculated = true;
    return res;
  }
}

function getCalculatedResult(input) {
  return input ** 2;
}

function testMemoized() {
  let memoizedCalculate = memoize(getCalculatedResult);

  let inputArr = [2, 2, 3];
  inputArr.forEach((val, index, array) => {
    let res = memoizedCalculate(val);
    console.log(`input: ${val}, res: ${res}`); // TODO: NaN error
  });
}

testMemoized();