/**
 * 实现 new 关键字
 * @param {Function} func 构造函数
 * @param {...any} args 参数
 */
export default function newObj(func, ...args) {
  if(typeof func !== "function") {
    throw new Error("First argument must be a function.");
  }

  // 相当于 obj.__proto__ = func.prototype
  let obj = Object.create(func.prototype);
  // 执行构造函数并绑定 this
  let res = func.apply(obj, args);

  // 需要判断函数是否返回了一个对象（是否为构造函数），如果不是，则返回创建的新对象
  return res instanceof Object ? res : obj;
}
