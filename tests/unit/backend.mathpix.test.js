import "@backend/config/config.js";
import { postImageAndRecieveText } from "@backend/utils/mathpix";
import { test, expect } from "playwright/test";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
test("test mathpix ocr from image, give it a image in fromdata in multipart/form-data format and recieve it in text with latex wrapped in $$", async function () {
  const formData = new FormData();
  formData.append(
    "files",
    fs.createReadStream(
      path.join(__dirname, "../assets/imgs/ocr_math_test.jpg")
    )
  );

  const text = await postImageAndRecieveText(formData);
  expect(text?.length).toBeGreaterThan(0);
});
