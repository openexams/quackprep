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
  console.log(`Data successfully written to ${fileName}`);
}
