import sqlExe from "#db/dbFunctions";

export async function submitCreatorForm(user_id, the_why, school) {
  return await sqlExe.executeCommand(
    `INSERT INTO creator_form_submissions (user_id,school,the_why) VALUES(:user_id,:school,:the_why)`,
    { user_id, school, the_why }
  );
}
