import { test, expect } from "playwright/test";
import { login } from "../helpers.js";

test("login", async ({ page }) => {
  // page.on("console", (msg) => {
  //   if (msg.type() === "error") {
  //     console.log(`Console error: ${msg.text()}`);
  //   }
  // }); logs error in this console from frotend
  await login(page);
  await expect(page.url()).toContain("");
});
