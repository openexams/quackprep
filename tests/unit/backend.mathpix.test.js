// basically pings the mathpix api
import "@backend/config/config.js";
import { postImageAndRecieveText } from "@backend/utils/mathpix";
import { test, expect } from "playwright/test";
import fsp from "fs/promises";
import fs from "fs";
import { path_to_assets } from "tests";

test("test mathpix ocr from image, give it a image in fromdata in multipart/form-data format and recieve it in text with latex wrapped in $$", async function () {
  const fileExists = fs.existsSync(path_to_assets + "imgs/ocr_math_test.jpg");
  expect(fileExists).toBe(true);
  const file = await fsp.readFile(
    // await to not block main event loop
    path_to_assets + "imgs/ocr_math_test.jpg"
  );
  const text = await postImageAndRecieveText(file);
  expect(text).toEqual(
    `\\( f(x)=\\left\\{\\begin{array}{ll}x^{2} & \\text { if } x<0 \\\\ 2 x & \\text { if } x \\geq 0\\end{array}\\right. \\)`
  );
});
