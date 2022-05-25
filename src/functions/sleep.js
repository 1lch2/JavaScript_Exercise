/**
 * sleep
 * @param {Number} delay delay time in miliseconds
 */
async function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

// 实际使用
async function foo() {
  let start = Date.now();
  await sleep(2000);
  console.log(Date.now() - start); // 2000
}

foo();