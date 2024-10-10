import sqlExe from "#db/dbFunctions.js";
export async function getTopicsByClassId(class_id) {
  const params = { class_id };
  return await sqlExe.executeCommand(
    `SELECT * FROM topics WHERE class_id = :class_id ORDER BY id ASC`,
    params
  );
}

export async function getTopicIdByClassNameAndTopicName(topicName, className) {
  const params = { topicName, className };
  return await sqlExe.executeCommand(
    `SELECT t.id,t.name FROM topics t JOIN classes c on t.class_id = c.id WHERE t.name = :topicName AND c.name = :className`,
    params
  );
}

export async function addTopicToClass(name, class_id, description, user_id) {
  const params = { name, class_id, description, user_id };
  return await sqlExe.executeCommand(
    `INSERT INTO topics (name,class_id,description,created_by) VALUES (:name,:class_id,:description,:user_id);`,
    params
  );
}
