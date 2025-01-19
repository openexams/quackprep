import { openai } from "#config/config.js";
import { sleep } from "./utils.js";

export async function sendOpenAiAssistantPromptAndRecieveResult(
  assistant_id,
  prompt
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
      assistant_id: quackAssist.id,
    });
    let runRes = await openai.beta.threads.runs.retrieve(
      quackThread.id,
      quackRun.id
    );
    // keep checking till its completed.
    while (runRes.status === "queued" || runRes.status === "in_progress") {
      dlog("openAi run not finished retrying in 2s");
      await sleep(1500);
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
