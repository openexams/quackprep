import { test, expect } from "playwright/test";
import { getBoilerClassAndParseToJsonClass } from "../func/class.js";
import { JSONClassSchema } from "../schema/schema.js";

test("test get getBoilerClassAndParseToJsonClass given a subject it returns only that class in that subject in correct format", async function () {
  const classes = await getBoilerClassAndParseToJsonClass({
    courseName: "CS25100",
  });
  const result = JSONClassSchema.array().parse(classes);
  console.log(result[0].name);
  expect(result.length).toEqual(1);
  expect(result[0].name === "CS25100");
  expect(result[0].category === 1);
  expect(result[0].groups).toBeNull();
});
