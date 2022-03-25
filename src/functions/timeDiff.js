/**
 * 返回时间戳之间的相差时间
 * 
 * @param {Number} postTime UNIX 时间戳
 * @returns {String} 发送时间距当前时间过去了多长时间
 */
function timediff(postTime) {
  let currentTime = Date.now();

  if (postTime > currentTime) {
    throw new Error("future time err.");
  }

  // 24h, 1h, 1min
  const intervals = {
    "24h": 24 * 60 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "1min": 60 * 1000
  };

  const justnow = "Just now.";

  let delta = currentTime - postTime;

  let hours = Math.floor(delta / intervals["1h"]);
  let mins = Math.floor((delta - hours * intervals["1h"]) / intervals["1min"]);
  let seconds = Math.floor((delta - hours * intervals["1h"] -
    mins * intervals["1min"]) / 1000);

  if (delta >= intervals["24h"]) {
    return new Date(postTime).toString();
  } else if (delta < intervals["24h"] && delta >= intervals["1h"]) {
    return `${hours} hours, ${mins} mins, ${seconds} seconds ago.`;
  } else if (delta < intervals["1h"] && delta >= intervals["1min"]) {
    return `${mins} mins, ${seconds} seconds ago`;
  } else {
    return justnow;
  }

}

// let postTime = Date.parse('2021-12-17T03:24:00');
let postTime = Date.parse("2022-03-23T17:18:00");

console.log(timediff(postTime));