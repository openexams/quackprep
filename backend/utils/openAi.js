import { openai } from "#config/config.js";
import { sleep } from "./utils.js";

/**
 * If you need to hold a convo etc, do not use this.
 * @param {String} assistant_id
 * @param {String} prompt
 * @param {Object} [options={}]
 * @param {Number} options.retire_time
 * @returns {String} result the ais result;
 */
export async function sendOpenAiAssistantPromptAndRecieveResult(
  assistant_id,
  prompt,
  options = {}
) {
  try {
    const quackAssist = await openai.beta.assistants.retrieve(assistant_id);

    // create the thread which to send messages and send a starter msg
    const quackThread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // run the message
    const quackRun = await openai.beta.threads.runs.create(quackThread.id, {
      // can change max tokens used here
      assistant_id: quackAssist.id,
    });
    let runRes = await openai.beta.threads.runs.retrieve(
      quackThread.id,
      quackRun.id
    );
    // keep checking till its completed.
    while (runRes.status === "queued" || runRes.status === "in_progress") {
      dlog(
        `openAi run not finished retrying in ${options.retire_time || 5000}ms`
      );
      await sleep(options.retire_time || 5000);
      runRes = await openai.beta.threads.runs.retrieve(
        quackThread.id,
        quackRun.id
      );
    }
    if (runRes.status !== "completed") {
      throw new Error("failed to generate AI question & choices.");
      return;
    }
    // get message from AI when completed.
    const allMessages = await openai.beta.threads.messages.list(quackThread.id);
    return JSON.parse(allMessages?.data[0]?.content?.[0]?.text?.value);
  } catch (error) {
    console.error("failed to call openai api, rethrowing error");
    throw error;
  }
}

/**
 * Choose any model this is not a assistant.
 * @param {String} prompt
 * @param {Object} json_schema
 * @param {String} model use openai model naming pls.
 * @param {String} context initial message to send to chat
 * @returns {Object} the result of the chat
 */
export async function sendPromptAndRecieveJSONResult(
  prompt,
  json_schema,
  model = "o1-preview",
  context = "Answer questions with accuracy"
) {
  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "developer",
        content: context,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: json_schema,
    },
    store: true,
  });
  return completion.choices[0].message.content;
}
