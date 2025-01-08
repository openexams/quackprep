import sqlExe from "#db/dbFunctions";

export async function selectCurrentChoice(WHERE: string, params: any) {
  return await sqlExe.executeCommand(
    ` SELECT ac.id, ac.choice_id, ac.question_id, ac.user_id, c.is_correct 
        FROM answers_current ac 
        JOIN choices c ON c.id = ac.choice_id
        WHERE ${WHERE}`,
    params
  );
}

export async function getCurrentChoicesByUserId(user_id: number) {
  return await selectCurrentChoice("ac.user_id = :user_id", { user_id });
}

export async function upsertCurrentChoice(
  user_id: number,
  choice_id: number,
  question_id: number,
  answers_transactional_id: number
) {
  const params = {
    choice_id,
    user_id,
    question_id,
    answers_transactional_id,
  };
  // if user already has row with this question update it, if not create a new one.
  const result = await sqlExe.executeCommand(
    `INSERT INTO answers_current (choice_id, user_id, question_id,  trans_id) VALUES(:choice_id,:user_id,:question_id,:answers_transactional_id)
      ON DUPLICATE KEY
      UPDATE 
      choice_id = :choice_id,
      trans_id=:answers_transactional_id`,
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
