import { sendOpenAiAssistantPromptAndRecieveResult } from "#utils/openAi.js";
import sqlExe from "#db/dbFunctions.js";
import { selectCurrentChoice } from "../current/index.js";

export async function checkStudentFRQAnswer(
  trans_id,
  question_text,
  student_answer_text,
  correct_answer_text
) {
  const responseJSON = await sendOpenAiAssistantPromptAndRecieveResult(
    "asst_m0Af7T1ZzVNKZqJ4QvFp7a2p",
    `question is: ${question_text}\n grade this answer: "${student_answer_text.slice(
      0,
      500
    )}"\ncorrect answer is: ${correct_answer_text || `no correct answer given`}`
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
