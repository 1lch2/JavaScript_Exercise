// 1. 最简短方便的方式
const uniqueArray1 = (array) => {
  return [...new Set(array)];
};

// 2. indexOf去重
const uniqueArray2 = (array) => {
  let result = [];

  array.forEach(val => {
    if (result.indexOf(val) === -1) {
      result.push(val);
    }
  });

  return result;
};

// 3. indexOf去重另一个版本
const uniqueArray3 = (array) => {
  return array.filter((it, i) => array.indexOf(it) === i);
};

// 4. Array.from去重
const uniqueArray4 = (array) => {
  return Array.from(new Set(array));
};

(function() {
  let testArray = [1, 2, 3, 1, 2, 3, 4];

  console.log(uniqueArray1(testArray));
  console.log(uniqueArray2(testArray));
  console.log(uniqueArray3(testArray));
  console.log(uniqueArray4(testArray));
})();