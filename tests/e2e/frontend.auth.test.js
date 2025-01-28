import { test, expect } from "playwright/test";
// todo fix
export async function login(page) {
  await page.goto("http://localhost:3001/");
  await page.getByRole("link", { name: "Login / Signup" }).click();
  await page.getByPlaceholder("Enter email...").click();
  await page.getByPlaceholder("Enter email...").fill("test@gmail.com");
  await page.getByPlaceholder("Enter password...").click();
  await page.getByPlaceholder("Enter password...").fill("Test");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForTimeout(2000); // Wait for 2000 milliseconds (2 seconds)
  await page.getByText("TestStreakAccountSign Out").click();
  await page.getByRole("option", { name: "Account" }).click();
  await page.getByText("@Test").click();
  await page.getByText("test@gmail.com").click();
  await page.getByText("User ID:").click();
}

test("login", async ({ page }) => {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`Console error: ${msg.text()}`);
    }
  });
  await login(page);
  await expect(page.url()).toContain("");
});
