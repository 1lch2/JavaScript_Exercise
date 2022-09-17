import fs from "fs/promises";
import path from "path";
import process from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_PATH = __dirname + path.sep + "leetcode";

/**
 * Revise a random LeetCode challenge.
 */
async function getRandomChallenge() {
  // Get random genre
  let genres = await fs.readdir(ROOT_PATH);
  let randomGenre = Math.floor(Math.random() * genres.length);

  // Get random challenge
  let tests = await fs.readdir(ROOT_PATH + path.sep + genres[randomGenre]);
  let randomChallenge = Math.floor(Math.random() * tests.length);

  let filePath = ROOT_PATH + path.sep + genres[randomGenre] + path.sep + tests[randomChallenge];
  console.log("Random LeetCode: " + tests[randomChallenge].split(".")[0]);

  // Open in VSCode
  process.exec("code " + filePath);
}

getRandomChallenge();
