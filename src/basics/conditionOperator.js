function testQuestionMark() {
  let age = 10;

  // 使用多个 ? 等价于多个 if-else
  // msgA 和 msgB 有相同的值
  let msgA = (age < 3) ? "a" : (age < 18) ? "b" : (age < 100) ? "c" : "d";
  let msgB = "";
  if (age < 2) {
    msgB = "a";
  } else if (age < 18) {
    msgB = "b";
  } else if (age < 100) {
    msgB = "c";
  } else {
    msgB = "d";
  }
}

testQuestionMark();