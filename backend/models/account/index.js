import sqlExe from "#db/dbFunctions.js";

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
