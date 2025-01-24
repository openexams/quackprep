import { test, expect } from "playwright/test";
import { checkAllFieldsForBadWords } from "@backend/middleware/badwordsMiddleware";

test("should block bad words", function () {
  const obj = {
    name: "fuck",
    description: "nno",
  };
  const result = checkAllFieldsForBadWords(obj);
  expect(result).toBe(true);
});

test("checkAllFieldsForBadWords should not identify math equations wrapped in latex $$3. expect result to be false", function () {
  const obj = {
    name: "Consider the surface: $$3x^2 - 12x + 5y^3 + z + 6 = 0$$. Find the points on the surface at which the tangent plane is parallel to the xy-plane.",
  };
  const result = checkAllFieldsForBadWords(obj);
  expect(result).toBe(false);
});
