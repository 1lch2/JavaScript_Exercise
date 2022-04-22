// Robot Bounded In Circle Solution
// On an infinite plane, a robot initially stands at (0, 0) and faces north. 
// The robot can receive one of three instructions:

// "G": go straight 1 unit;
// "L": turn 90 degrees to the left;
// "R": turn 90 degrees to the right.
// The robot performs the instructions given in order, and repeats them forever.

// Return true if and only if there exists a circle in the plane such that the robot never leaves the circle.

// Example 1:
// Input: instructions = "GGLLGG"
// Output: true
// Explanation: The robot moves from (0,0) to (0,2), turns 180 degrees, and then returns to (0,0).
// When repeating these instructions, the robot remains in the circle of radius 2 centered at the origin.

// Example 2:
// Input: instructions = "GG"
// Output: false
// Explanation: The robot moves north indefinitely.

// Example 3:
// Input: instructions = "GL"
// Output: true
// Explanation: The robot moves from (0, 0) -> (0, 1) -> (-1, 1) -> (-1, 0) -> (0, 0) -> ...

// Constraints:
// 1 <= instructions.length <= 100
// instructions[i] is 'G', 'L' or, 'R'.

/**
 * 
 * @param {String} instructions 
 * @returns {Boolean}
 */
function isRobotBounded(instructions) {
  // 原方向左转后的方向矢量
  let vectorL = {};
  vectorL["0 1"] = "-1 0";
  vectorL["0 -1"] = "1 0";
  vectorL["1 0"] = "0 1";
  vectorL["-1 0"] = "0 -1";

  // 原方向右转后的方向矢量
  let vectorR = {};
  vectorR["0 1"] = "1 0";
  vectorR["0 -1"] = "-1 0";
  vectorR["1 0"] = "0 -1";
  vectorR["-1 0"] = "0 1";

  // 当前坐标
  let coordinate = {
    x: 0,
    y: 0
  };

  // 当前方向
  let direction = "0 1";

  // 根据指令和当前方向移动坐标或调整方向
  for(let i = 0; i < instructions.length; i++) {
    let current = instructions[i];
    if(current === "G") {
      coordinate.x += direction.split(" ")[0];
      coordinate.y += direction.split(" ")[1];
    } else if(current === "L") {
      direction = vectorL[direction];
    } else if(current === "R") {
      direction = vectorR[direction];
    }
  }

  // 回到原点
  if(coordinate.x === 0 && coordinate.y === 0) {
    return true;
  }

  // 若一轮下来方向不变则不可能回到原点
  // 否则循环多次后会回到原点
  if(direction === "0 1") {
    return false;
  }

  return true;
}

(function() {
  console.log(isRobotBounded("GLL"));
})();
