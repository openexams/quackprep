import { test, expect } from "playwright/test";
import sqlExe from "../../backend/database/dbFunctions.js";

test.describe("Database Functions", () => {
  test("should execute a valid query", async () => {
    const result = await sqlExe.queryCommand(
      "SELECT * FROM users WHERE username = ?",
      ["Test"]
    );
    expect(Array.isArray(result)).toBeTruthy();
  });

  test("should handle query errors gracefully", async () => {
    await expect(async () => {
      await sqlExe.queryCommand("INVALID SQL");
    }).rejects.toThrow();
  });
});
