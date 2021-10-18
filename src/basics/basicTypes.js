/**
 * Basic variable types.
 */
function basicTypes() {
  //* Number 类型代表整数和浮点数，声明并赋值后可以重新赋值为另一种类型
  let number = 42;
  number = 3.14;

  // Infinity
  let inf = 1 / 0;
  console.log("inf: " + inf + ", type: " + typeof inf);

  // NaN
  console.log("NaN: " + ("str" / 2));
  // 对NaN的任何操作都会返回NaN
  console.log("str"/ 2 + 5 + Infinity);

  //* BigInt 类型用于表示任意长度的整数
  let bigNumber = 12345678901234567890n;
  console.log(typeof bigNumber);

  //* String 类型
  let plainStr = "i am a plain string";
  let templetStr = `i am a templet string with ${number} as value`;
  console.log(plainStr);
  console.log(templetStr);

  //* Boolean 类型
  let plainTrue = true;
  // TODO:
}

function nullAndUndefined() {
  // 已声明但未赋值的变量值为 undefined
  let v1;
  console.log("v1: " + v1);
}

basicTypes();
nullAndUndefined();