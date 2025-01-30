import { test, expect } from "playwright/test";
import { login } from "../helpers.js";

test("test ai chatbot sends message to backend and recieves response and loads it into the chatbot", async ({
  page,
}) => {
  await page.goto("http://localhost:3001/");
  await page.getByRole("button", { name: "Chatbot" }).click();
  await login(page);
  await page.getByPlaceholder("Type here...").click();
  await page.getByPlaceholder("Type here...").fill("I want to jump");
  await page.locator("#send-ai-prompt").click();
  await page.locator(".messages-wrapper > div:nth-child(3)").click();
});
