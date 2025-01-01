import sqlExe from "#db/dbFunctions.js";
import { openai } from "#config/config.js";
import "#utils/utils.js";
import { upsertQuestion } from "..";
import { addManyChoicesToQuestion } from "#models/choice";

/**
 * Represents a question with multiple-choice options.
 * @typedef {Object} GenQuestion
 * @property {string} question - The text of the question.
 * @property {Option[]} options - An array of options for the question.
 */

/**
 * Represents an option for a multiple-choice question.
 * @typedef {Object} Option
 * @property {string} text - The text of the option.
 * @property {boolean} is_correct - Indicates whether the option is correct.
 */

/**
 *
 * @param {Integer} user_id add which user ai generated the question (does not rlly matter)
 * @param {String} likeQuestionText to feed to AI
 * @param {Number} likeQuestionId so that we can attach the AI question to the same groups as likeQuestion
 * @returns {Object} question object back to the user who generated it
 */
export async function generateQuestionLike(
  user_id,
  likeQuestionText,
  likeQuestionId
) {
  // find the assistant I created
  const quackAssist = await openai.beta.assistants.retrieve(
    "asst_a168JvA9PlzK2WaKZ6oukDe4"
  );

  // create the thread which to send messages and send a starter msg
  const quackThread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: `create a question like: "${likeQuestionText}"\nin json format`,
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
    dlog("run not finished retrying in 2s");
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
  const quackAssistResponse = allMessages?.data[0]?.content;
  /**@type {GenQuestion} */
  let quackAssistResponseJSON = JSON.parse(
    quackAssistResponse?.[0]?.text?.value
  );
  // needed for sql db
  for (let i = 0; i < quackAssistResponseJSON.options.length; i++) {
    quackAssistResponseJSON.options[i] = {
      ...quackAssistResponseJSON.options[i],
      type: "mcq",
    };
  }
  upsertQuestion(); // add ai flag to upsert
  addManyChoicesToQuestion();
}

generateQuestionLike(
  1,
  "Consider the surface: 2x^3 - 4xy + 3z^2 + 7 = 0. Find the points on the surface at which the tangent plane is parallel to the xy-plane.",
  1
);
