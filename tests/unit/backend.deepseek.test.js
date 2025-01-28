import { sendDeepSeekPromptAndRecieveJSONResult } from "@backend/utils/deepseek";
import { test, expect } from "playwright/test";

// test("test sendDeepSeekPromptAndRecieveJSONResult using deepseek-reasoner expect it to send a result in the format specified", async function () {
//   const result = await sendDeepSeekPromptAndRecieveJSONResult(
//     "Consider the surface: $$3x^2 - 12x + 5y^3 + z + 6 = 0$$. Find the points on the surface at which the tangent plane is parallel to the xy-plane.",
//     QUACK_GEN_QUESTION_CONTEXT,
//     "deepseek-chat"
//   );
//   console.log(result);
//   expect(result).not.toBe(undefined);
// });
