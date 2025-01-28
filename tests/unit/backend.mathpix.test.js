// basically pings the mathpix api
import "@backend/config/config.js";
import { postImageAndRecieveText } from "@backend/utils/mathpix";
import { test, expect } from "playwright/test";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
test("test mathpix ocr from image, give it a image in fromdata in multipart/form-data format and recieve it in text with latex wrapped in $$", async function () {
  const file = await fs.readFile(
    // await to not block main event loop
    path.join(__dirname, "../assets/imgs/ocr_math_test.jpg")
  );
  const text = await postImageAndRecieveText(file);
  console.log(text);
  expect(text?.length).toBeGreaterThan(0);
});
