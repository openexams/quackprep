import { openai } from "#config/config.js";
import {
  getWhatGroupsQuestionisIn,
  setDeletedQuestionAndCascadeChoices,
  upsertQuestion,
} from "../index.js";
import { addManyChoicesToQuestion } from "#models/choice/index.js";
import sqlExe from "#db/dbFunctions";
import { GenQuestion } from "../../../../shared-types/question-types";
/**
 *
 * @param {Integer} user_id add which user ai generated the question (does not rlly matter)
 * @param {String} likeQuestionText to feed to AI
 * @param {Number} likeQuestionId so that we can attach the AI question to the same groups as likeQuestion
 * @returns {Object} question object back to the user who generated it
 */
export async function generateQuestionLike(
  user_id: number,
  likeQuestionText: string,
  likeQuestionId: number
) {
  let question_added = null;
  dlog(`ai generating like q_id: ${likeQuestionId}`);
  // find the assistant I created
  try {
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
    let quackAssistResponseJSON: GenQuestion = JSON.parse(
      quackAssistResponse?.[0]?.text?.value
    );
    // needed for sql db
    for (let i = 0; i < quackAssistResponseJSON.options.length; i++) {
      quackAssistResponseJSON.options[i] = {
        ...quackAssistResponseJSON.options[i],
        type: "mcq",
      };
    }

    // get what groups curQuestion has
    const object_w_groups = await getWhatGroupsQuestionisIn(likeQuestionId);
    const groups_question_is_in = [];
    for (let i = 0; i < object_w_groups.length; i++) {
      groups_question_is_in.push(object_w_groups[i].group_id);
    }

    const question_with_2 = await upsertQuestion(
      null,
      quackAssistResponseJSON.question,
      user_id,
      groups_question_is_in,
      true
    );
    question_added = question_with_2?.[0];

    if (!question_added?.id) {
      throw new Error("failed to add AI question, question not created");
      return;
    }

    const choices_added = await addManyChoicesToQuestion(
      question_added?.id,
      user_id,
      quackAssistResponseJSON.options
    );
    return { question: question_with_2, choices: choices_added };
  } catch (error) {
    if (question_added?.id) {
      // if we added a question & errored then->
      await setDeletedQuestionAndCascadeChoices(question_added?.id);
    }
    throw error;
  }
}
// DO NOT FUCKING RUN THIS!!
export async function deleteAllAIGeneratedQuestion() {
  await sqlExe.executeCommand(`UPDATE questions q
LEFT JOIN choices c on c.question_id = q.id
SET q.deleted=1, c.deleted=1 WHERE q.ai = 1`);
}
