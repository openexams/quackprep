import sqlExe from "#db/dbFunctions";

export async function upsertTimeSpent(user_id) {
  return await sqlExe.executeCommand(
    `INSERT INTO time_spent (user_id, time_spent) VALUES(:user_id,5)
    ON DUPLICATE KEY
    UPDATE time_spent = time_spent + 5`,
    { user_id }
  );
}

export async function checkIfCreator(user_id) {
  const result = await sqlExe.executeCommand(
    `SELECT u.is_creator FROM users u WHERE id = :user_id`,
    { user_id }
  );
  if (result?.[0]?.is_creator === 1) {
    // may not return a int may return 1 as a string
    return true;
  }
  return false;
}

export async function getMyStats(user_id) {
  return (
    await sqlExe.executeCommand(
      `SELECT
    (SELECT COUNT(*)
     FROM answers_current ac
     JOIN choices c ON c.id = ac.choice_id
     WHERE ac.user_id = :user_id AND c.is_correct = 1) AS correct_answer_count,
     
    (SELECT COUNT(*)
     FROM answers_transactional
     WHERE user_id = :user_id) AS total_questions_answered,
     
     (select time_spent from time_spent where user_id = :user_id) as time_spent;`,
      { user_id }
    )
  )?.[0];
}

export async function getTotalTimeSpent() {
  return (
    await sqlExe.executeCommand(`SELECT SUM(time_spent) as tts FROM time_spent`)
  )?.[0]?.tts;
}
