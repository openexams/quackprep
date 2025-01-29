import { test, expect } from "playwright/test";
import sqlExe from "../../backend/database/dbFunctions.js";
import { TEST_ACCOUNT_USER } from "constants.js";

test.describe("Database Functions", () => {
  test("should execute a valid query", async () => {
    const result = await sqlExe.executeCommand(
      "SELECT * FROM users WHERE username = :username",
      { username: TEST_ACCOUNT_USER }
    );
    expect(Array.isArray(result)).toBeTruthy();
  });

  test("should handle query errors gracefully", async () => {
    await expect(async () => {
      await sqlExe.executeCommand("INVALID SQL");
    }).rejects.toThrow();
  });
});
