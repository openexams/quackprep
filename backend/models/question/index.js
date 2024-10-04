import sqlExe from "#db/dbFunctions.js";
export async function getQuestionsByTopic(topic_id) {
  const params = { topic_id };
  return await sqlExe.executeCommand(
    `SELECT * FROM questions WHERE topic_id = :topic_id ORDER BY id ASC`,
    params
  );
}
