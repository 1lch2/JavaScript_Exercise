/**
 * obj instanceof cls
 * 
 * @param {Object} obj 待对比的对象
 * @param {Function} cls 待对比的构造函数
 * @returns 构造函数是否在对象的原型链上
 */
const isInstanceOf = function(obj, cls) {
  let clsProto = cls.prototype;
  let objProto = obj.__proto__;

  const trace = (objProto) => {
    if(objProto === null) {
      return false;
    }

    if(objProto === clsProto) {
      return true;
    }

    // 沿原型链向上
    objProto = objProto.__proto__;
    return trace(objProto);
  };

  return trace(objProto);
};

(function(){
  function A() {
  }
  function B() {
  }
  B.prototype = new A();
  
  let b = new B();
  console.log(isInstanceOf(b, B));
  console.log(isInstanceOf(b, A));
  console.log(isInstanceOf(b, Object));

  let a = new A();
  console.log(isInstanceOf(a, B));
})();