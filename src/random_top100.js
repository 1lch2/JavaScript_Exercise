import axios from "axios";

import fs from "fs/promises";
import path from "path";
import process from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_PATH = __dirname + path.sep + "leetcode";

/**
 * Get local LeetCode tests.
 * @returns {Promise<Map<number, string>} Map containing test number to local file path
 */
async function getCodeList() {
  let fileMap = new Map();

  // Map test num to file path
  let genres = await fs.readdir(ROOT_PATH);
  for (let genre of genres) {
    let tests = await fs.readdir(ROOT_PATH + path.sep + genre);

    for (let test of tests) {
      let testNum = test.split(".")[0];
      if (isNaN(+testNum)) {
        continue;
      }
      let filePath = ROOT_PATH + path.sep + genre + path.sep + test;
      fileMap.set(+testNum, filePath);
    }
  }

  return Promise.resolve(fileMap);
}

/**
 * Open local LeetCode test if exists.
 * @param {number} testNum LeetCode test number
 */
async function getLocalRandom(testNum) {
  let fileMap = await getCodeList();
  let localPath = fileMap.get(testNum);

  if (localPath === undefined) {
    console.log("No local LeetCode test");
    return;
  }

  console.log("Random LeetCode Top 100: " + testNum);
  process.exec("code " + localPath);
}

async function getRandomTop100() {
  let testList = [];

  // Get top 100 code challanges
  for (let pageNum = 1; pageNum <= 5; pageNum++) {
    let URL = `https://codetop.cc/api/questions/?page=${pageNum}&search=&ordering=-frequency`;

    let response = await axios.get(URL, {
      headers: {
        Accept: "application/json"
      }
    });

    let data = response.data;
    let codeList = data.list;

    for (let code of codeList) {
      let num = code.leetcode.frontend_question_id;
      if (isNaN(+num)) {
        continue;
      }
      testList.push(+num);
    }
  }

  // Get random one
  let randomTest = testList[Math.floor(Math.random() * testList.length)];
  getLocalRandom(randomTest);
}

getRandomTop100();
