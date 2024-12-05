import sqlExe from "#db/dbFunctions.js";

export async function getFavoriteQuestionsByUserId(user_id) {
  return await sqlExe.executeCommand(
    `SELECT * FROM favorite_questions WHERE user_id =:user_id`,
    { user_id }
  );
}

export async function getFavoriteQuestionsByQuestionIdAndUserId(
  question_id,
  user_id
) {
  return await sqlExe.executeCommand(
    `SELECT * FROM favorite_questions WHERE user_id =:user_id AND question_id=:question_id`,
    { question_id, user_id }
  );
}

export async function upsertFavoriteQuestion(
  id = null,
  question_id,
  is_favorite,
  user_id
) {
  const insertId = (
    await sqlExe.executeCommand(
      `INSERT INTO favorite_questions (question_id, is_favorite,user_id) VALUES(:question_id,:is_favorite,:user_id)
    ON DUPLICATE KEY UPDATE
    is_favorite=:is_favorite`,
      { question_id, is_favorite, user_id }
    )
  )?.insertId;
  const result = (
    await getFavoriteQuestionsByQuestionIdAndUserId(question_id, user_id)
  )?.[0];
  return result;
}
