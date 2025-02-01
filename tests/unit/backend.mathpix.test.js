// basically pings the mathpix api
import "@backend/config/config.js";
import {
  postImageAndRecieveText,
  postPdfAndRetriveParsedPdf,
} from "@backend/utils/mathpix";
import { test, expect } from "playwright/test";
import fsp from "fs/promises";
import fs from "fs";
import { path_to_assets } from "tests";
import FormData from "form-data";

test("test mathpix ocr from image, give it a image in fromdata in multipart/form-data format and recieve it in text with latex wrapped in $$", async function () {
  const fileExists = fs.existsSync(path_to_assets + "imgs/ocr_math_test.jpg");
  expect(fileExists).toBe(true);
  const file = await fsp.readFile(
    // await to not block main event loop
    path_to_assets + "imgs/ocr_math_test.jpg"
  );
  const text = await postImageAndRecieveText({
    type: "image/jpeg",
    buffer: file,
  });
  console.log(text);

  expect(text).toEqual(
    `$$f(x)=\\left\\{\\begin{array}{ll}x^{2} & \\text { if } x<0 \\\\ 2 x & \\text { if } x \\geq 0\\end{array}\\right.$$`
  );
});

test("test mathpix parse pdf, give it a pdf in fromdata in multipart/form-data format and recieve it in text with latex wrapped in $$", async function () {
  const fileExists = fs.existsSync(path_to_assets + "pdfs/wabags.pdf");
  expect(fileExists).toBe(true);
  const file = await fsp.readFile(
    // await to not block main event loop
    path_to_assets + "pdfs/wabags.pdf"
  );
  console.log(file);
  const formData = new FormData();
  formData.append("file", file, "wabags.pdf");
  const text = await postPdfAndRetriveParsedPdf(formData);
  console.log(text);

  expect(text).not.toBeNull();
});
