import { test, expect } from "playwright/test";
import { isAuthenticated } from "@backend/middleware/authMiddleware";

test("test isAuthenticated middleware, given a valid api key, should go to the next middleware", async function () {
  let res = "";
  await isAuthenticated({ headers: { token: "69EE" } }, null, () => {
    res = "AUTHENTICATED";
  });

  expect(res).toBe("AUTHENTICATED");
});

test("test isAuthenticated middleware, given an invalid api key, should not go to the next middleware", async function () {
  let res = "";
  try {
    await isAuthenticated({ headers: { token: "69" } }, null, () => {
      res = "AUTHENTICATED";
    });
  } catch (e) {
    res = "ERROR";
  }

  expect(res).toBe("ERROR");
});

// test user auth next
