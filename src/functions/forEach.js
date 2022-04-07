/**
 * array.forEach()
 * @param {Function} func callback function
 */
Array.prototype.myForEach = function(func) {
  if (typeof func !== "function") {
    throw new Error("Not a function");
  }

  let arr = new Object(this); // new Object() 并不是深拷贝

  for (let i = 0; i < this.length; i++) {
    func.call(this, this[i], i, arr);
  }
};

let input = ["first", "second", "third"];

input.myForEach(function(value, index, array) {
  console.log(">>> current value: " + value);
  console.log(">>> current index: " + index);
  console.log(">>> array itself: " + array);
});