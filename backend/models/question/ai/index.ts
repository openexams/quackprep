import {
  getWhatGroupsQuestionisIn,
  setDeletedQuestionAndCascadeChoices,
  upsertQuestion,
} from "../index.js";
import { addManyChoicesToQuestion } from "#models/choice/index.js";
import sqlExe from "#db/dbFunctions";
import { GenQuestion } from "../../../../shared-types/question.types";
import { sendOpenAiAssistantPromptAndRecieveResult } from "#utils/openAi.js";
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
    const quackAssistResponseJSON: GenQuestion =
      await sendOpenAiAssistantPromptAndRecieveResult(
        "asst_a168JvA9PlzK2WaKZ6oukDe4",
        `create a question like: "${likeQuestionText}"\nin json format`
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

export async function checkStudentFRQAnswer(
  trans_id: number,
  question_text: string,
  student_answer_text: string,
  correct_answer_text: string | null
) {
  const responseJSON = await sendOpenAiAssistantPromptAndRecieveResult(
    "asst_m0Af7T1ZzVNKZqJ4QvFp7a2p",
    `question is: ${question_text}\n grade this answer: "${student_answer_text.slice(
      0,
      500
    )}"\ncorrect answer is: ${correct_answer_text || `no correct answer given`}`
  );
  const grade: number = responseJSON.grade;
  const explanation: string = responseJSON.explanation;

  const insertId = (
    await sqlExe.executeCommand(
      `INSERT INTO frq_ai_response (trans_id,grade,response) VALUES(:trans_id,:grade,:explanation)`,
      { trans_id, grade, explanation }
    )
  ).insertId;
  const frq_ai_response_row = (
    await sqlExe.executeCommand(
      `SELECT * 
FROM frq_ai_response 
WHERE id = :insertId`,
      { insertId }
    )
  )[0];
  return frq_ai_response_row;
}
