import sqlExe from "#db/dbFunctions.js";

export async function selectCurrentChoice(WHERE, params) {
  return await sqlExe.executeCommand(
    ` SELECT ac.id, ac.choice_id, ac.question_id, ac.created_by, c.is_correct, ac.trans_id, at.text, fart.response as ai_response, fart.grade
        FROM answers_current ac 
        JOIN choices c ON c.id = ac.choice_id
        JOIN answers_transactional at on at.id = ac.trans_id 
        LEFT JOIN frq_ai_response fart on fart.trans_id = at.id
        WHERE ${WHERE}`,
    params
  );
}

export async function getCurrentChoicesByUserId(user_id) {
  return await selectCurrentChoice("ac.created_by = :user_id", { user_id });
}

export async function upsertCurrentChoice(
  user_id,
  choice_id,
  question_id,
  answers_transactional_id
) {
  const params = {
    choice_id,
    user_id,
    question_id,
    answers_transactional_id,
  };
  // if user already has row with this question update it, if not create a new one.
  const result = await sqlExe.executeCommand(
    `INSERT INTO answers_current (choice_id, created_by, question_id,  trans_id) VALUES(:choice_id,:user_id,:question_id,:answers_transactional_id)
      ON DUPLICATE KEY
      UPDATE 
      choice_id = :choice_id,
      trans_id=:answers_transactional_id`,
    params
  );
  // TODO DO BOTH OF THESE AT ONCE INSTEAD OF CALLING DB TWICE
  return (
    await selectCurrentChoice(
      "ac.created_by = :user_id AND ac.question_id=:question_id",
      params
    )
  )?.[0];
}
