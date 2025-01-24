import dotenv from "dotenv";
import { test, expect } from "playwright/test";

if (!process.env.NODE_ENV) {
  dotenv.config({ path: "../../../secrets" });
}

test("test dotenv config has all needed values", async function () {
  expect(process.env.SESSION_SECRET).toBeTruthy();
  expect(process.env.MADDOX_MYSQL_USERNAME).toBeTruthy();
  expect(process.env.MADDOX_MYSQL_PASSWORD).toBeTruthy();
  expect(process.env.MADDOX_MYSQL_SERVER).toBeTruthy();
  expect(process.env.MADDOX_MYSQL_DB).toBeTruthy();
  expect(process.env.MADDOX_MYSQL_PORT).toBeTruthy();
  expect(process.env.REDIS_URL).toBeTruthy();
  expect(process.env.NODE_ENV).toBeTruthy();
  expect(process.env.GOOGLE_CLIENT_ID).toBeTruthy();
  expect(process.env.GOOGLE_CLIENT_SECRET).toBeTruthy();
  expect(process.env.FRONTEND_URL).toBeTruthy();
  expect(process.env.BACKEND_URL).toBeTruthy();
  expect(process.env.OPENAI_API_KEY).toBeTruthy();
  expect(process.env.MATHPIX_API_KEY).toBeTruthy();
  expect(process.env.MATHPIX_APP_ID).toBeTruthy();
});
