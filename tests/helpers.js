import { TEST_ACCOUNT_EMAIL, TEST_ACCOUNT_PASS } from "../constants.js";

export async function login(page) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`Console error: ${msg.text()}`);
    }
  });
  await page.getByRole("link", { name: "Login / Signup" }).click();
  await page.getByPlaceholder("Enter email...").click();
  await page.getByPlaceholder("Enter email...").fill(TEST_ACCOUNT_EMAIL);
  await page.getByPlaceholder("Enter password...").click();
  await page.getByPlaceholder("Enter password...").fill(TEST_ACCOUNT_PASS);
  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL((url) => !url.pathname.includes("/auth"));
}

export async function getState(page) {
  return await page.evaluate(() => window.__REDUX_STATE__());
}
