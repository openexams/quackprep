import { test, expect } from "playwright/test";
import { login } from "../helpers.js";
import {
  TEST_ACCOUNT_USER,
  TEST_ACCOUNT_EMAIL,
  TEST_ACCOUNT_PASS,
} from "../../constants.js";

test("login", async ({ page }) => {
  await page.goto("http://localhost:3001/");
  await page.getByRole("link", { name: "Login / Signup" }).click();
  await page.getByPlaceholder("Enter email...").click();
  await page.getByPlaceholder("Enter email...").fill(TEST_ACCOUNT_EMAIL);
  await page.getByPlaceholder("Enter password...").click();
  await page.getByPlaceholder("Enter password...").fill(TEST_ACCOUNT_PASS);
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForTimeout(2000); // Wait for 2000 milliseconds (2 seconds)
  await page.getByText(`${TEST_ACCOUNT_USER}StreakAccountSign Out`).click();
  await page.getByRole("option", { name: "Account" }).click();
  await page.getByText(`@${TEST_ACCOUNT_USER}`).click();
  await page.getByText(TEST_ACCOUNT_EMAIL).click();
  await page.getByText("User ID:").click();
});

test("test auth pushes you to last page, go to create, and then login and expect to be on create after login", async ({
  page,
}) => {
  await page.goto("http://localhost:3001/");
  await page.getByRole("link", { name: "AI Create" }).click();
  await page.waitForURL("**/create");
  await login(page);
  await page.waitForURL("**/create");
});
