import { test, expect } from "playwright/test";
import { boilerQuestionToJsonQuestion } from "../func/question.js";

test("test boilerQuestionToJsonQuestion given a question id and a PARENT question to correctly parse the question and return the correct amt of question correctly, expect the question to have the same topics and explanation url as the og parent", async function () {
  test.setTimeout(60000);
  const questions = await boilerQuestionToJsonQuestion(
    "8eeec429-b7d4-4bce-931c-9aa52f6e7a13"
  );
  console.log(questions);
  expect(questions.length).toEqual(3);
});
