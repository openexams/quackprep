import { deepseek } from "#config/config.js";
import "#utils/utils.js";

/**
 * Choose any model this is not a assistant.
 * @param {String} prompt
 * @param {String} model use openai model naming pls.
 * @param {String} context what is chat like? given by dev
 * @returns {Object} the result of the chat
 */
export async function sendDeepSeekPromptAndRecieveJSONResult(
  prompt,
  context = "Answer questions with accuracy",
  model = "deepseek-reasoner"
) {
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
