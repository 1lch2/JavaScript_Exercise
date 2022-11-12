function negativeArray(elements) {
  return new Proxy(elements, {
    get: (target, propKey, receiver) => {
      let indexNum = Number(propKey);
      let reflectKey = indexNum < 0 ? String(target.length + indexNum) : propKey;
      return Reflect.get(target, reflectKey, receiver);
    }
  });
}

let input = [0, 1, 2, 3, 4, 5];
let list = negativeArray(input);

console.log(list[-1]); // 5
