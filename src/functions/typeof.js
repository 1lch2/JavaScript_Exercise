/**
 * 获取变量类型
 * 
 * @param {Object} obj 待判断类型的对象
 * @param {Function} fullClass 待比较的类
 * @returns {String} 类型
 */
function type(obj, fullClass) {
  // get toPrototypeString() of obj (handles all types)
  // Early JS environments return '[object Object]' for null, so it's best to directly check for it.
  if (fullClass) {
    return (obj === null) ? "[object Null]" : Object.prototype.toString.call(obj);
  }
  if (obj == null) {
    return (obj + "").toLowerCase();
  } // implicit toString() conversion

  var deepType = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  if (deepType === "generatorfunction") {
    return "function";
  }

  // Prevent overspecificity (for example, [object HTMLDivElement], etc).
  // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
  // String.prototype.match is universally supported.

  return deepType.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/) ? deepType :
    (typeof obj === "object" || typeof obj === "function") ? "object" : typeof obj;
}

(function(){
  let num = 1;
  let numObj = new Number(2);
  let date = new Date();
  let fn = new Function();

  console.log(type(num));
  console.log(type(numObj));
  console.log(type(date));
  console.log(type(fn));
})();