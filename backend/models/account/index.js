import sqlExe from "#db/dbFunctions.js";

export async function upsertTimeSpent(user_id) {
  return await sqlExe.executeCommand(
    `INSERT INTO time_spent (user_id, time_spent) VALUES(:user_id,5)
    ON DUPLICATE KEY
    UPDATE time_spent = time_spent + 5`,
    { user_id }
  );
}
