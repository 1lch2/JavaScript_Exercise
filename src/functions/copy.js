/**
 * 深拷贝 - 递归实现
 * @param {Any} obj 待拷贝变量
 * @returns {Any} 深拷贝的新变量
 */
function deepCopy(obj) {
  if (obj instanceof Object) {
    let clone = Array.isArray(obj) ? [] : {};

    // 无法拷贝函数
    for (const key in obj) {
      clone[key] = deepCopy(obj[key]);
    }
    return clone;
  } else {
    return obj;
  }
}

/**
 * 浅拷贝
 * @param {Object}} target 待拷贝目标
 * @returns 浅拷贝对象
 */
function shallowCopy(target) {
  let clone = {};
  for (const key in target) {
    clone[key] = target[key];
  }
  return clone;
}

(function(){
  let testObj = {
    base: 114514,
    arr: ["a", "b"],
    obj: {
      hi: function() {
        console.log("hi");
      },
      age: 24
    }
  };

  console.log(">>> testObj: ", testObj);

  let deepClone = deepCopy(testObj);
  testObj.arr.push("c");
  console.log(">>> deepClone after change: ", deepClone);

  let shallowClone = shallowCopy(testObj);
  testObj.arr.push("d");
  console.log(">>> shallow clone after change: ", shallowClone);
})();