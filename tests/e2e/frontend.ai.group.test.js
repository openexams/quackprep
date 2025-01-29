import { test, expect } from "playwright/test";
import { login } from "../helpers.js";
import { path_to_assets } from "../index.js";
import fs from "fs";

test("given a file and being logged in test that a user with a class can use the AI Create To create material and on finish jump to that material.", async ({
  page,
}) => {
  test.setTimeout(70000); // 70 seconds
  const fileExists = fs.existsSync(path_to_assets + "imgs/cs251_rbt.png");
  expect(fileExists).toBe(true);
  await login(page);
  await page.getByRole("link", { name: "AI Create" }).click();
  await page.getByRole("alert").click();
  await page.getByRole("option", { name: "Test's Study Content" }).click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path_to_assets + "imgs/cs251_rbt.png");
  await page.getByRole("button", { name: "Upload" }).click();
  await page.waitForURL("http://localhost:3001/class/General/72/group");
  await page.waitForTimeout(3000); // wait for my site to load
  await page.getByText("Test's Study Content: Study").click();
});
