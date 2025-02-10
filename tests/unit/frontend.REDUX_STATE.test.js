import { test, expect } from "playwright/test";
import { getState } from "tests/helpers";

test("window.__REDUX_STATE__() function that on dev it correctly gets redux state and rets it", async function ({
  page,
}) {
  await page.goto("localhost:3001");
  const state = await getState(page);
  expect(state).toHaveProperty("flashMessage");
  expect(state).toHaveProperty("loading");
  expect(state).toHaveProperty("app");
  expect(state).toHaveProperty("auth");
  expect(state).toHaveProperty("show401");
});
