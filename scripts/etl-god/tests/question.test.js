import { test, expect } from "playwright/test";
import { boilerQuestionToJsonQuestion } from "../func/question.js";

test("test boilerQuestionToJsonQuestion given a question id and a PARENT question to correctly parse the question and return the correct amt of question correctly, expect the question to have the same topics and explanation url as the og parent", async function () {
  const questions = await boilerQuestionToJsonQuestion(
    "8eeec429-b7d4-4bce-931c-9aa52f6e7a13"
  );
  const parentTopic = "Huffman Coding";
  const parentExplanationUrl = "https://youtu.be/5uU8q5Ec3yU?t=3339";
  expect(questions.length).toEqual(3);
  // expected all questions to have the same topics and explanation url as the og parent
  expect(questions[0].topics).toEqual([parentTopic]);
  expect(questions[0].explanation_url).toEqual(parentExplanationUrl);
  expect(questions[1].topics).toEqual([parentTopic]);
  expect(questions[1].explanation_url).toEqual(parentExplanationUrl);
  expect(questions[2].topics).toEqual([parentTopic]);
  expect(questions[2].explanation_url).toEqual(parentExplanationUrl);
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

test("test boilerQuestionToJsonQuestion given a question id and a question from AAE20300 make sure the question is parsed correctly as expected", async function () {
  const questions = await boilerQuestionToJsonQuestion(
    "b4e62772-7b0c-4ad4-a03c-4451ad3330de"
  );
  expect(questions.length).toEqual(1);
  const question = questions[0];
  expect(question.question).toEqual(
    "The small bead P is moving along the portion of the wire which is inclined at a fixed angle $\\theta$ relative to the horizontal plane. The wire rotates at a constant rate $\\Omega$ about a vertical axis relative to the ground. \n\nFind nice expressions for the velocity and acceleration of P relative to the ground.  ![](https://boilerexams-production.s3.us-east-2.amazonaws.com/qnIDFVIu-hcyp4S3S7mvS)"
  );
  expect(question.choices[0].type).toEqual("frq");
  expect(question.choices[0].answer).toEqual("");
});

test("test boilerQuestionToJsonQuestion given a question id and a question which is free response with a image that should relate to the frq choice from CS25100 make sure the question is parsed correctly as expected", async function () {
  const questions = await boilerQuestionToJsonQuestion(
    "2067c797-cf23-46b8-badc-9c37a2d0ef3d"
  );
  expect(questions.length).toEqual(1);
  const question = questions[0];
  expect(question.question).toEqual(
    "Consider the Left-Leaning Red-Black below. All nodes/links are black. Show the steps in the tree for\ndelete(7). ![](https://boilerexams-production.s3.us-east-2.amazonaws.com/tsY0pn3ftjkjRZuX-rpj2)"
  );
  expect(question.choices[0].type).toEqual("frq");
  expect(question.choices[0].answer).toEqual(
    "This question is still under review, as some of you have pointed out, the below solution doesn't maintain black height because pathway 8-\u003E11-\u003E9-\u003ENULL has black height 4 while all other paths to NULL have black height 5 so the given solution is incorrect. You need to find a way to change the tree we found to maintain black height. This is why deletion in RB trees is hard :-( ![](https://boilerexams-production.s3.us-east-2.amazonaws.com/z-7TWXSYXdnGztp5ZHWNP)"
  );
});
