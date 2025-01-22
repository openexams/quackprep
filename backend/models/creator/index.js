import sqlExe from "#db/dbFunctions.js";

export async function submitCreatorForm(user_id, the_why, school) {
  return await sqlExe.executeCommand(
    `INSERT INTO creator_form_submissions (user_id,school,the_why) VALUES(:user_id,:school,:the_why)`,
    { user_id, school, the_why }
  );
}

export async function makeUserACreator(user_id) {
  return await sqlExe.executeCommand(
    `UPDATE users SET is_creator = 1 WHERE id = :user_id`,
    { user_id }
  );
}
