import { sendOpenAiAssistantPromptAndRecieveResult } from "#utils/openAi";
import sqlExe from "#db/dbFunctions";
import { selectCurrentChoice } from "../current/index";

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

  return (await selectCurrentChoice("at.id = :trans_id", { trans_id }))[0];
}
