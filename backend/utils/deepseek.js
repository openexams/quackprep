import { deepseek } from "#config/config.js";
import { MAX_USER_PROMPT_LENGTH } from "#config/constants.js";
import "#utils/utils.js";

/**
 * Choose any model this is not a assistant.
 * @param {String} prompt
 * @param {Object} json_schema
 * @param {String} model use openai model naming pls.
 * @param {String} context initial message to send to chat
 * @returns {Object} the result of the chat
 */
export async function sendDeepSeekPromptAndRecieveJSONResult(
  prompt,
  context = "Answer questions with accuracy",
  model = "deepseek-reasoner"
) {
  if (context.length > MAX_USER_PROMPT_LENGTH) {
    // prompt should be from dev, context is from user
    throw new Error("prompt or context is too long");
  }
  dlog("calling deepseek with prompt:", prompt);
  try {
    const completion = await deepseek.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system", // o1 has to have it from user sadly. should be system
          content: context,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      store: true,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(
      "failed to call deepseek api sendPromptAndRecieveJSONResult, rethrowing error"
    );
    throw error;
  }
}
