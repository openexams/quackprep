import { sendOpenAiAssistantPromptAndRecieveResult } from "#utils/openAi.js";
import sqlExe from "#db/dbFunctions.js";
import { selectCurrentChoice } from "#models/choice/current/index.js";
import {
  MAX_USER_ANSWER_SUBMISSION_LENGTH,
  QUACK_GRADE_ASS_ID,
} from "../../../constants.js";
import CustomError from "#utils/CustomError.js";
import { ANSWER_TO_BE_GRADED_TO_LONG } from "#config/error_codes.js";
/**
 *
 * @param {Number} trans_id the answers_transactional id they submission is tied to.
 * @param {String} question_text
 * @param {String} student_answer_text
 * @param {String} correct_answer_text actual correct answer
 * @returns {Object} updated choice
 */
export async function checkStudentFRQAnswer(
  trans_id,
  question_text,
  student_answer_text,
  correct_answer_text
) {
  if (student_answer_text.length > MAX_USER_ANSWER_SUBMISSION_LENGTH) {
    throw new CustomError(
      "Answer Too Long to be graded",
      400,
      ANSWER_TO_BE_GRADED_TO_LONG
    );
  }
  const responseJSON = await sendOpenAiAssistantPromptAndRecieveResult(
    QUACK_GRADE_ASS_ID,
    `question is: ${question_text}\n grade this answer: "${student_answer_text}"\ncorrect answer is: ${
      correct_answer_text || `no correct answer given`
    }`
  );
  const grade = responseJSON.grade;
  const explanation = responseJSON.explanation;

  const insertId = (
    await sqlExe.executeCommand(
      `INSERT INTO frq_ai_response (trans_id,grade,response) VALUES(:trans_id,:grade,:explanation)`,
      { trans_id, grade, explanation }
    )
  ).insertId;

  return (await selectCurrentChoice("at.id = :trans_id", { trans_id }))[0];
}
