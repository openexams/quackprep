import { TEST_ACCOUNT_EMAIL, TEST_ACCOUNT_PASS } from "../constants.js";

export async function login(page) {
  await page.getByRole("link", { name: "Login / Signup" }).click();
  await page.getByPlaceholder("Enter email...").click();
  await page.getByPlaceholder("Enter email...").fill(TEST_ACCOUNT_EMAIL);
  await page.getByPlaceholder("Enter password...").click();
  await page.getByPlaceholder("Enter password...").fill(TEST_ACCOUNT_PASS);
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/auth"));
  console.log("logged in");
}
