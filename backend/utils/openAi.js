import { deepseek, openai } from "#config/config.js";
import {
  MAX_PROMPT_LENGTH,
  MAX_PROMPT_TOKENS,
  MAX_USER_PROMPT_LENGTH,
} from "../../constants.js";
import { AI_PROMPT_TOO_LONG, MAX_RETRIES_EXCEEDED } from "../../error_codes.js";
import { sleep } from "./utils.js";
import ApiError from "./ApiError.js";

function returnCorrectOpenAiClass(model) {
  if (!model) {
    throw new Error("model is required");
  }
  if (model?.includes("deepseek")) {
    dlog("using deepseek");

    return deepseek;
  } else {
    dlog("using openai");
    return openai;
  }
}
/**
 * @param {ChatCompletionMessageParam[]} messages
 * @param {String} model
 * @param {Object} options
 * @param {Number} options.max_completion_tokens
 * @returns {ChatCompletionMessageParam} the new message from the chatbot
 */

export async function sendAiMessageChainAndRecieveResult(
  messages,
  model = "gpt-4o",
  options
) {
  try {
    const completion = await returnCorrectOpenAiClass(
      model
    ).chat.completions.create({
      model: model,
      messages: messages,
      max_completion_tokens: options.max_completion_tokens || undefined,
    });

    const { role, content } = completion.choices[0].message;
    return { role, content };
  } catch (error) {
    console.error(
      "failed to call openai api at sendAiMessageChainAndRecieveResult, rethrowing error"
    );
    throw error;
  }
}

/**
 * If you need to hold a convo etc, do not use this.
 * @param {String} assistant_id
 * @param {String} prompt
 * @param {Object} [options={}]
 * @param {Number} options.retire_time
 * @param {Number} options.max_retires
 * @returns {String} result the ais result;
 */
export async function sendOpenAiAssistantPromptAndRecieveResult(
  assistant_id,
  prompt,
  options = {}
) {
  dlog(
    `calling openAi with prompt:${prompt?.slice(0, 100)}...\nprompt.len: ${
      prompt.length
    }`
  );
  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw new ApiError(
      `prompt is too long, max len is ${MAX_PROMPT_LENGTH}, your len was ${prompt.length}`,
      400,
      AI_PROMPT_TOO_LONG
    );
  }
  try {
    const quackAssist = await openai.beta.assistants.retrieve(assistant_id);

    // create the thread which to send messages and send a starter msg
    const quackThread = await openai.beta.threads.create({
      messages: [
        {
          role: "assistant",
          content: "Any response given MUST be in md with LaTeX wrapped in $$.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // run the message
    const quackRun = await openai.beta.threads.runs.create(quackThread.id, {
      max_prompt_tokens: MAX_PROMPT_TOKENS,
      // can change max tokens used here
      assistant_id: quackAssist.id,
    });

    dlog("quackRun RUN started");

    // keep checking till its completed.

    await checkThreadUntilCompleted(quackThread.id, quackRun.id, options);

    // get message from AI when completed.
    const allMessages = await openai.beta.threads.messages.list(quackThread.id);

    return JSON.parse(allMessages?.data[0]?.content?.[0]?.text?.value);
  } catch (error) {
    console.error("failed to call openai api, rethrowing error");
    throw error;
  }
}

/**
 * Choose from gpt4o or none others.
 * @param {String} prompt
 * @param {Object} json_schema
 * @param {String} model use openai model naming pls.
 * @param {String} context initial message to send to chat
 * @returns {Object} the result of the chat
 */
export async function sendPromptAndRecieveJSONResult(
  prompt,
  response_format,
  model = "o1-preview",
  context = "Answer questions with accuracy"
) {
  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw new ApiError(
      `prompt is too long, max len is ${MAX_PROMPT_LENGTH}, your len was ${prompt.length}`,
      400,
      AI_PROMPT_TOO_LONG
    );
  }
  if (context.length > MAX_USER_PROMPT_LENGTH) {
    // prompt should be from dev, context is from user
    throw new Error("prompt or context is too long");
  }
  dlog("calling normal openAi with prompt:", prompt);
  try {
    const completion = await returnCorrectOpenAiClass(
      model
    ).chat.completions.create({
      model: model,

      messages: [
        {
          role: "user", // o1 has to have it from user sadly. should be system
          content: context,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: response_format,
      store: true,
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error(
      "failed to call openai api sendPromptAndRecieveJSONResult, rethrowing error"
    );
    throw error;
  }
}
/**
 *
 * @param {*} threadId
 * @param {*} runId
 * @param {Object} options
 * @param {Number} options.retire_time defaults to 5000ms
 * @param {Number} options.max_retires defaults to 20 retriees
 */
export async function checkThreadUntilCompleted(threadId, runId, options) {
  let retries = 0;
  let runRes = await returnCorrectOpenAiClass(model).beta.threads.runs.retrieve(
    threadId,
    runId
  );

  while (runRes.status === "queued" || runRes.status === "in_progress") {
    if (retries > (options.max_retires || 50)) {
      throw new ApiError(
        `openAi run failed, status was ${runRes.status}, max retries reached`,
        500,
        MAX_RETRIES_EXCEEDED
      );
    }
    dlog(
      `openAi run not finished retrying in ${options.retire_time || 5000}ms`
    );
    await sleep(options.retire_time || 5000);
    runRes = await returnCorrectOpenAiClass(model).beta.threads.runs.retrieve(
      threadId,
      runId
    );

    retries++;
  }

  if (runRes.status !== "completed") {
    if (retries > (options.max_retires ? options.max_retires : 50)) {
      throw new ApiError(
        `openAi run failed, status was ${runRes.status}, max retries reached`,
        500,
        MAX_RETRIES_EXCEEDED
      );
    }
    throw new ApiError(
      `openAi run failed, status was ${runRes.status}`,
      500,
      "OPENAI_RUN_FAILED"
    );
  }
  return;
}
