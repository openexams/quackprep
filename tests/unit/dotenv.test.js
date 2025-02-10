import { test, expect } from "playwright/test";
import { secrets } from "@backend/config/secrets.js";

test("test dotenv config has all needed values", function () {
  expect(secrets.SESSION_SECRET).toBeTruthy();
  expect(secrets.MADDOX_MYSQL_USERNAME).toBeTruthy();
  expect(secrets.MADDOX_MYSQL_PASSWORD).toBeTruthy();
  expect(secrets.MADDOX_MYSQL_SERVER).toBeTruthy();
  expect(secrets.MADDOX_MYSQL_DB).toBeTruthy();
  expect(secrets.MADDOX_MYSQL_PORT).toBeTruthy();
  expect(secrets.REDIS_URL).toBeTruthy();
  expect(secrets.NODE_ENV).toBeTruthy();
  expect(secrets.GOOGLE_CLIENT_ID).toBeTruthy();
  expect(secrets.GOOGLE_CLIENT_SECRET).toBeTruthy();
  expect(secrets.FRONTEND_URL).toBeTruthy();
  expect(secrets.BACKEND_URL).toBeTruthy();
  expect(secrets.OPENAI_API_KEY).toBeTruthy();
  expect(secrets.MATHPIX_API_KEY).toBeTruthy();
  expect(secrets.MATHPIX_APP_ID).toBeTruthy();
  expect(secrets.DEEPSEEK_API_KEY).toBeTruthy();
  expect(secrets.QUACKPREP_EMAIL_USER).toBeTruthy();
  expect(secrets.QUACKPREP_EMAIL_PASS).toBeTruthy();
  expect(secrets.R2_ACCESS_KEY_ID).toBeTruthy();
  expect(secrets.R2_SECRET_ACCESS_KEY).toBeTruthy();
  expect(secrets.R2_ENDPOINT).toBeTruthy();
});
