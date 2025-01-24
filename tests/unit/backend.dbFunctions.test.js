import { test, expect } from "playwright/test";
import sqlExe from "@backend/database/dbFunctions.js";

test("test sql connection using sql exe expect not to throw a error", async function () {
  await expect(sqlExe.testConnection).not.toThrow();
});
