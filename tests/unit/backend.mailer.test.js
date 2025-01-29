import { email_auth } from "@backend/config/config.js";
import EmailService from "@backend/utils/EmailService.js";
import { test, expect } from "playwright/test";
import "@backend/utils/utils.js";

test("send email to quackprep.com using emailer service and response should be a success", async function () {
  const response = await new EmailService(email_auth.user).sendEmail(
    "hello world",
    "test email"
  );
  expect(response.includes("OK") && response.includes("250")).toBe(true);
});
