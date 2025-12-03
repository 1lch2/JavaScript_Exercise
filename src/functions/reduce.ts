// 通过声明合并扩展Array接口
declare global {
  interface Array<T> {
    // 重载：无初始值时
    myReduce(
      callback: (
        accumulator: T,
        currentValue: T,
        currentIndex: number,
        array: T[]
      ) => T
    ): T;
    // 重载：有初始值时
    myReduce<U>(
      callback: (
        accumulator: U,
        currentValue: T,
        currentIndex: number,
        array: T[]
      ) => U,
      initialValue: U
    ): U;
  }
}

// 标记为模块以启用declare global
export {};

// 实现方法，使用泛型保证类型安全
// 注意：这里使用的类型断言是因为函数实现需要兼容两个重载
Array.prototype.myReduce = function <ElementType, ReturnType>(
  this: ElementType[],
  callback: (
    accumulator: ElementType | ReturnType,
    currentValue: ElementType,
    currentIndex: number,
    array: ElementType[]
  ) => ElementType | ReturnType,
  initialValue?: ReturnType
): ElementType | ReturnType {
  // 检查第一个参数是否是函数
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const array = this;
  const length = array.length;

  // 空数组且没有初始值的情况
  if (length === 0 && arguments.length === 1) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let accumulator: ElementType | ReturnType | undefined;
  let startIndex: number;

  // 判断是否传入了初始值
  if (arguments.length >= 2) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // 没有初始值时，将数组第一个元素作为初始值
    accumulator = array[0];
    startIndex = 1;
  }

  // 使用for循环遍历数组
  for (let i = startIndex; i < length; i++) {
    // 跳过稀疏数组中的空位
    if (i in array) {
      accumulator = callback(
        accumulator as ElementType | ReturnType,
        array[i],
        i,
        array
      );
    }
  }

  return accumulator as ElementType | ReturnType;
};

// 测试用例
const numbers = [1, 2, 3, 4, 5];

// 求和
const sum = numbers.myReduce((acc, cur) => acc + cur, 0);
console.log(sum); // 15

// 不带初始值
const product = numbers.myReduce((acc, cur) => acc * cur);
console.log(product); // 120 (1*2*3*4*5)

// 将数组转为对象
const fruits = ["apple", "banana", "orange"];
const fruitCounts = fruits.myReduce((obj: Record<string, number>, fruit) => {
  obj[fruit] = (obj[fruit] || 0) + 1;
  return obj;
}, {});
console.log(fruitCounts); // { apple: 1, banana: 1, orange: 1 }
