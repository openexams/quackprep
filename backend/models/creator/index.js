import sqlExe from "#db/dbFunctions.js";

export async function makeUserACreator(user_id) {
  return await sqlExe.executeCommand(
    `UPDATE users SET is_creator = 1 WHERE id = :user_id`,
    { user_id }
  );
}
