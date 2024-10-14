import sqlExe from "#db/dbFunctions.js";
export async function getTopicsByClassId(class_id) {
  const params = { class_id };
  return await sqlExe.executeCommand(
    `SELECT t.name,t.id,t.description,t.created_by, ct.class_id FROM topics t JOIN class_topic ct ON ct.class_id = :class_id AND ct.topic_id = t.id ORDER BY id ASC`,
    params
  );
}

export async function getTopicIdByClassNameAndTopicName(topicName, className) {
  const params = { topicName, className };
  return await sqlExe.executeCommand(
    // todo may be cooked chat
    `SELECT t.id,t.name FROM topics t JOIN class_topic ct ON t.id = ct.topic_id AND (SELECT c.name FROM classes c WHERE c.id = ct.class_id) = :className AND t.name = :topicName`,
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
