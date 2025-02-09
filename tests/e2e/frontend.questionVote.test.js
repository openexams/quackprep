import { test, expect } from "playwright/test";
import { login } from "../helpers.js";
// import store from "@frontend/src/app/store/store.js";
// import { selectQuestionState } from "@frontend/src/app/class/question/questionSlice.js";
// import { questionSchema } from "schema/question.schema.js";

// test("test questionvoting. go into a certain class, downvote a question, make sure it is was correct, then upvote, then check state to see if the question is still the correct schema", async ({
//   page,
// }) => {
//   await page.goto("http://localhost:3001/");
//   await login(page);
//   await page.getByRole("button", { name: "Get Started" }).click();
//   await page.getByRole("button", { name: "Purdue" }).click();
//   await page.getByRole("textbox", { name: "Search for classes..." }).click();
//   await page
//     .getByRole("textbox", { name: "Search for classes..." })
//     .fill("ma26100");

//   await page.locator("#class_6_card").first().hover(); // Ensure the element is hovered
//   await page.locator("#class_6_study_by_exam").first().click();
//   await page
//     .locator("#group_29_card")
//     .getByRole("button", { name: "Study Group" })
//     .click();
//   await page.locator("#upvotes_num").click();
//   await page.locator("#question_64_vote").getByRole("button").nth(1).click();
//   await page.getByText("voted on question! thanks for").click();
//   await page
//     .locator("#root div")
//     .filter({ hasText: "Success!voted on question!" })
//     .getByRole("button")
//     .click();
//   await page.locator("#question_64_vote").getByRole("button").first().click();
//   await page.locator("#upvotes_num").click();
//   await page
//     .locator("#root div")
//     .filter({ hasText: "Success!voted on question!" })
//     .getByRole("button")
//     .click();
//   // add state checks and # > and < checks
// });
