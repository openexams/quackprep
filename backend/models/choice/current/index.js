import sqlExe from "#db/dbFunctions.js";

export async function selectCurrentChoice(WHERE, params) {
  return await sqlExe.executeCommand(
    ` SELECT ac.id, ac.choice_id, ac.question_id, ac.user_id, c.is_correct 
        FROM answers_current ac 
        JOIN choices c ON c.id = ac.choice_id
        WHERE ${WHERE}`,
    params
  );
}

export async function getCurrentChoiceByQuestionIdAndUserId() {}

export async function getCurrentChoicesByUserId(user_id) {
  return await selectCurrentChoice("ac.user_id = :user_id", { user_id });
}

export async function upsertCurrentChoice(user_id, choice_id, question_id) {
  const params = { choice_id, user_id, question_id };
  // if user already has row with this question update it, if not create a new one.
  const result = await sqlExe.executeCommand(
    `INSERT INTO answers_current (choice_id, user_id, question_id) VALUES(:choice_id,:user_id,:question_id)
      ON DUPLICATE KEY
      UPDATE choice_id = :choice_id`,
    params
  );
  // TODO DO BOTH OF THESE AT ONCE INSTEAD OF CALLING DB TWICE
  return (
    await selectCurrentChoice(
      "ac.user_id = :user_id AND ac.question_id=:question_id",
      params
    )
  )?.[0];
}
