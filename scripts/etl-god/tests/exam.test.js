import { test, expect } from "playwright/test";
import { getJsonGroupsFromJsonClass } from "../func/exam.js";

test("test getJsonGroupsFromJsonClass given a class name, return the correct json groups", async function () {
  const result = await getJsonGroupsFromJsonClass({ name: "CS25100" });
  expect(result.groupJson.length).toBeGreaterThanOrEqual(1);
  expect(result.groupJson[0].name.includes("Exam")).toEqual(true);
  expect(result.groupJson[0].type).toEqual("exam");
});
