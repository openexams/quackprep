import { test, expect } from "playwright/test";

export async function login(page) {
  await page.goto("http://localhost:5173/"); // TODO WTF ARE U DOING
  await page.getByText("Login/Signup").click();
  await page.getByPlaceholder("email").click();
  await page.getByPlaceholder("email").fill("Admin");
  await page.getByPlaceholder("email").press("Tab");
  await page.getByPlaceholder("password").fill("Admin");
  await page.getByPlaceholder("password").press("Tab");
  await page.getByRole("button", { name: "Submit" }).press("Enter");
  await page.waitForTimeout(2000); // Wait for 2000 milliseconds (2 seconds)
}

test("login", async ({ page }) => {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`Console error: ${msg.text()}`);
    }
  });
  await login(page);
  await expect(page.url()).toContain("profile");
});

test("withAuth goto class", async ({ page }) => {
  await login(page);
  await page.getByText("Home").click();
  await page.getByRole("button", { name: "Start Practicing" }).click();

  await page.getByText("CS180").click();
});
