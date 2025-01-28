import { sendDeepSeekPromptAndRecieveJSONResult } from "#utils/deepseek.js";
import { QUACK_GEN_QUESTION_CONTEXT } from "#config/constants.js";
import "#utils/utils.js";
const result = await sendDeepSeekPromptAndRecieveJSONResult(
  "Consider the surface: $$3x^2 - 12x + 5y^3 + z + 6 = 0$$. Find the points on the surface at which the tangent plane is parallel to the xy-plane.",
  QUACK_GEN_QUESTION_CONTEXT,
  "deepseek-chat"
);
console.log(result);
