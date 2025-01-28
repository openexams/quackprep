import { sendDeepSeekPromptAndRecieveJSONResult } from "@backend/utils/deepseek";
import { test, expect } from "playwright/test";

test("test sendDeepSeekPromptAndRecieveJSONResult using deepseek-reasoner expect it to send a result in the format specified", async function () {
  const result = await sendDeepSeekPromptAndRecieveJSONResult(
    "9x^2 = 5",
    "you are a math prof",
    undefined
  );
  console.log(result);
  expect(result).not.toBe(undefined);
});
