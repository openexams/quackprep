import { test, expect } from "playwright/test";
import { login } from "../helpers.js";
import { path_to_assets } from "../index.js";
import fs from "fs";
import { TEST_ACCOUNT_USER } from "constants.js";

test("check if auto create class when no classes found works, given a new account create a default class for the user", async ({
  page,
}) => {
  await page.goto("http://localhost:3001/");
  await login(page);
  await page.getByRole("link", { name: "AI Exam Parser" }).click();
  await page.getByText("Please select a class from").click();
  await page.getByText("No Class Selected").click();
  await page.getByText("Please select a class from").click();
  await page.getByRole("alert").click();
  await page
    .getByRole("option", { name: "test69696969696999's Study" })
    .click();
  await page.getByRole("heading", { name: "Upload Past Exams" }).click();
});

test("given a file and being logged in test that a user with a class can use the AI Exam Parser To create material and on finish jump to that material.", async ({
  page,
}) => {
  test.setTimeout(70000); // 70 seconds
  const fileExists = fs.existsSync(path_to_assets + "imgs/cs251_rbt.png");
  expect(fileExists).toBe(true);
  await page.goto("http://localhost:3001/");
  await login(page);
  await page.getByRole("link", { name: "AI Exam Parser" }).click();
  await page.getByRole("alert").click();
  await page
    .getByRole("option", { name: `${TEST_ACCOUNT_USER}'s Study Content` })
    .click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path_to_assets + "imgs/cs251_rbt.png");
  await page.getByRole("button", { name: "Submit" }).click(); // if someone changes this button, it will break
  await page.waitForURL(
    "http://localhost:3001/class/General/*/group/*/question/"
  );
  await page.waitForTimeout(3000); // wait for my site to load
  await page.getByText(`Choose a Question`).click();
});
