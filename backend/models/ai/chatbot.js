import { sendAiMessageChainAndRecieveResult } from "#utils/openAi.js";

/**
 * @param {ChatCompletionMessageParam[]} messages
 * @param {String} model
 * @returns {ChatCompletionMessageParam} the new message from the chatbot
 */
export async function sendChatbotPromptAndRecieveResult(messages, model) {
  // if there 5 or more messages, take the last 5 and add the system message
  const newMessages = // optimal number of messages to send to the chatbot
    messages.length >= 5
      ? messages.slice(messages.length - 5, messages.length)
      : messages;
  // add system message to back
  newMessages.unshift({
    role: "system",
    content:
      "Assist students by providing accurate, clear solutions and explanations. Use accessible language, ensure accuracy, and encourage learning with guiding questions. Act respectfully like a supportive professor.",
  });
  const res = await sendAiMessageChainAndRecieveResult(
    newMessages,
    "deepseek-chat",
    {
      max_completion_tokens: 5000,
    }
  ); // todo maybe premium user gets diff model
  return res;
}
