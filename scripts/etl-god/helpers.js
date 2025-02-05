import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function writeToFile(data, fileName) {
  await fs.writeFile(`${__dirname}/output/` + fileName, data);
  console.log(`Data successfully written to ${__dirname}/output/${fileName}`);
}
/**
 *
 * @param {String} fileName
 * @returns {String} String of entire file content
 */
export async function readFromFile(fileName) {
  const file = await fs.readFile(`${__dirname}/output/` + fileName, {
    encoding: "utf-8",
  });
  console.log(`Data successfully read from ${__dirname}/output/${fileName}`);
  return file;
}
