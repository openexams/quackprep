import { test, expect } from "playwright/test";
import { sendOpenAiAssistantPromptAndRecieveResult } from "@backend/utils/openAi.js";
import { QUACK_GRADE_ASS_ID } from "../../constants.js";

test.describe("using QUACK_GRADE assitant, which grades and responds in json format", () => {
  test("should successfully grade a student's answer", async () => {
    const question = "What is 2+2?";
    const studentAnswer = "4";
    const correctAnswer = "The answer is 4";

    const result = await sendOpenAiAssistantPromptAndRecieveResult(
      QUACK_GRADE_ASS_ID,
      `question is: ${question}\n grade this answer: "${studentAnswer}"\ncorrect answer is: ${correctAnswer}`
    );

    // Check that the response has the expected structure
    expect(result).toHaveProperty("grade");
    expect(result).toHaveProperty("explanation");

    // Grade should be a number between 0 and 100
    expect(typeof result.grade).toBe("number");
    expect(result.grade).toBeGreaterThanOrEqual(0);
    expect(result.grade).toBeLessThanOrEqual(100);

    // Explanation should be a non-empty string
    expect(typeof result.explanation).toBe("string");
    expect(result.explanation.length).toBeGreaterThan(0);
  });

  test("should handle incorrect answers appropriately", async () => {
    const question = "What is 2+2?";
    const studentAnswer = "5";
    const correctAnswer = "The answer is 4";

    const result = await sendOpenAiAssistantPromptAndRecieveResult(
      QUACK_GRADE_ASS_ID,
      `question is: ${question}\n grade this answer: "${studentAnswer}"\ncorrect answer is: ${correctAnswer}`
    );

    expect(result.grade).toBeLessThan(100);
  });

  test("should handle empty student answers", async () => {
    const question = "What is 2+2?";
    const studentAnswer = "";
    const correctAnswer = "The answer is 4";

    const result = await sendOpenAiAssistantPromptAndRecieveResult(
      QUACK_GRADE_ASS_ID,
      `question is: ${question}\n grade this answer: "${studentAnswer}"\ncorrect answer is: ${correctAnswer}`
    );

    expect(result.grade).toBe(0);
  });

  test("should handle long response times", async () => {
    const question = "Explain quantum mechanics in detail";
    const studentAnswer = "It's complicated and involves particles and waves";
    const correctAnswer =
      "Quantum mechanics is a fundamental theory in physics...";

    const result = await sendOpenAiAssistantPromptAndRecieveResult(
      QUACK_GRADE_ASS_ID,
      `question is: ${question}\n grade this answer: "${studentAnswer}"\ncorrect answer is: ${correctAnswer}`,
      { retire_time: 10000, max_retires: 3 }
    );

    expect(result).toHaveProperty("grade");
    expect(result).toHaveProperty("explanation");
  });
});
