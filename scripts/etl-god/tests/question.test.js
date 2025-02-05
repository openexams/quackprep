import { test, expect } from "playwright/test";
import { boilerQuestionToJsonQuestion } from "../func/question.js";

test("test boilerQuestionToJsonQuestion given a question id and a PARENT question to correctly parse the question and return the correct amt of question correctly, expect the question to have the same topics and explanation url as the og parent", async function () {
  const questions = await boilerQuestionToJsonQuestion(
    "8eeec429-b7d4-4bce-931c-9aa52f6e7a13"
  );
  console.log(questions);
  expect(questions.length).toEqual(3);
});

test("test boilerQuestionToJsonQuestion given a question id and a question from ECON make sure the question is parsed correctly", async function () {
  const questions = await boilerQuestionToJsonQuestion(
    "e98b024c-87d0-40d1-b667-5ed3862b5efe"
  );
  expect(questions.length).toEqual(1);
  const question = questions[0];
  expect(question.question).toEqual(
    "In economics, scarcity refers to the situation of:"
  );
  expect(question.explanation_url).toEqual(
    "https://youtu.be/QG5T6wqAn3w?si=h1jlO3umJ_mrxQ8l"
  );
  expect(question.choices[0].type).toEqual("mcq");
  expect(question.choices[1].is_correct).toEqual(1);
  expect(question.choices[1].answer).toEqual(
    "Having more wants than the amount of available resources."
  );
  expect(question.topics).toEqual(["Chapter 1-3"]);
});
