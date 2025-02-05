import { test, expect } from "playwright/test";

test("test ", async function () {
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
