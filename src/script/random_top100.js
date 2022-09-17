import axios from "axios";

import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import process from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LEETCODE_PATH = path.resolve(__dirname, "..", "leetcode");
const CACHE_PATH = __dirname + path.sep + "cache.json";
const UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000;

/**
 * Get local LeetCode tests.
 * @returns {Promise<Map<number, string>} Map containing test number to local file path
 */
async function getCodeList() {
  let fileMap = new Map();

  // Map test num to file path
  let genres;
  try {
    genres = await readdir(LEETCODE_PATH);
  } catch (err) {
    console.log(err);
  }
  for (let genre of genres) {
    let tests = await readdir(LEETCODE_PATH + path.sep + genre);

    for (let test of tests) {
      let testNum = test.split(".")[0];
      if (isNaN(+testNum)) {
        continue;
      }
      let filePath = LEETCODE_PATH + path.sep + genre + path.sep + test;
      fileMap.set(+testNum, filePath);
    }
  }

  return fileMap;
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

/**
 * Read from local cache
 * @returns {Promise<number[]>} Return cached data if it is still valid. Otherwise, return `[]` instead.
 */
async function getLocalCache() {
  let cache = await readFile(CACHE_PATH, { encoding: "utf-8" });
  let cacheObj = JSON.parse(cache);

  let timestamp = cacheObj.timestamp;
  let data = cacheObj.data;
  let now = Date.now();

  // Compare timestamp
  if (timestamp - now < UPDATE_INTERVAL) {
    return data;
  }

  // Return an empty array if local cache is exipred
  return [];
}

/**
 * Fetch top 100 LeetCode questions from CodeTop
 * @returns {Promise<number[]>} Top 100 LeetCode question id in an array.
 */
async function fetchDataFromCodeTop() {
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

  // Write to local cache.
  let newCache = {
    timestamp: Date.now(),
    data: testList
  };
  try {
    await writeFile(CACHE_PATH, JSON.stringify(newCache), { encoding: "utf-8" });
  } catch (err) {
    console.log(err);
  }
  return testList;
}

/**
 * Get a random top 100 LeetCode question and open it in local VSCode editor.
 */
async function getRandomTop100() {
  let testList = await getLocalCache();
  if (testList.length === 0) {
    testList = await fetchDataFromCodeTop();
  }

  // Get random one
  let randomTest = testList[Math.floor(Math.random() * testList.length)];
  getLocalRandom(randomTest);
}

getRandomTop100();
