import { test, expect } from "playwright/test";
test("test blog working by going to footer, clicking blog, and then clicking on a blog post, then verifying the title of the blog post", async ({
  page,
}) => {
  await page.goto("http://localhost:3001/");
  await page.getByText("Blog").click();
  await page.getByRole("heading", { name: "Helpful Articles" }).click();
  await page
    .getByText("Unlocking The Secrets Of Success: The Value Of Past Exam")
    .click();
  await page
    .getByRole("heading", {
      name: "Unlocking The Secrets Of Success: The Value Of Past Exam Papers In Exam Preparation",
      exact: true,
    })
    .click();
  // make sure url is correct
  await expect(page).toHaveURL(
    "http://localhost:3001/blog/unlocking-the-secrets-of-success:-the-value-of-past-exam-papers-in-exam-preparation"
  );
});
