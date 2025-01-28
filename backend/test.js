import { sendDeepSeekPromptAndRecieveJSONResult } from "#utils/deepseek.js";
const result = await sendDeepSeekPromptAndRecieveJSONResult(
  "9x^2 = 5",
  "you are a math prof",
  undefined
);
console.log(result);
