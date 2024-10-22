import { randomizeArray } from "../../shared/globalFuncs.js";

test("given an arr to randomize with 5 elements, call randomizeArr, assert its the same size as the og arr", () => {
  const array = [0, 1, 2, 3, 4];
  const randomized = randomizeArray(array);
  expect(randomized.length).toBe(5);
});
