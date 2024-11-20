import { findNeedlesInArrayOfObjectsLINEAR } from "../../frontend/src/utils/functions.js"; // switch to module import
import { test, expect } from "playwright/test";

test("given a array and 2 values in a object to check findNeedlesInArrayOfObjectsLINEAR returns correct return key when all givens keys to check are in the array object", () => {
  const array = [
    { id: 15, name: "hillbilly", class_id: 1 },
    { id: 1, name: "Test_Topic", class_id: 1 },
    { id: 2, name: "Test_Topic", class_id: 3 },
  ];
  const keyNamesToCheck = ["name", "class_id"];
  const needles = ["Test_Topic", 3];
  const topicId = findNeedlesInArrayOfObjectsLINEAR(
    array,
    keyNamesToCheck,
    needles,
    "id"
  );
  expect(topicId).toBe(2);
});
