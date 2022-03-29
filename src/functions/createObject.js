/**
 * 创建一个新对象，使用现有的对象来提供新创建的对象的 __proto__
 * 
 * @param {Object} protoObj 新创建对象的原型对象
 * @returns {Object} 一个新对象，带着指定的原型对象和属性
 */
Object.createObj = function(protoObj) {
  let isObj = (typeof protoObj === "object") || (typeof protoObj === "function");
  let isUndefined = typeof protoObj === "undefined";

  if(isUndefined || !isObj) {
    throw new Error("Not an object.");
  }

  // 原型式继承
  function F() {}
  F.prototype = protoObj;
  return new F();
};