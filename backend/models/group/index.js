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
  const result = (
    await sqlExe.executeCommand(
      `INSERT INTO topics (name,description,created_by) VALUES (:name,:description,:user_id);`,
      params
    )
  ).insertId;
  params["result"] = result;
  const bridge_tbl_res = await sqlExe.executeCommand(
    `INSERT INTO class_topic (class_id,topic_id) VALUES (:class_id,:result);`,
    params
  );
  return result;
}

export async function getExamsByClassId(class_id) {
  // TODO TEST SQL COMMAND
  return await sqlExe.executeCommand(
    `SELECT e.id, e.year, e.semester, e.exam_num, e.created_by, ce.class_id  FROM exams e JOIN class_exam ce ON ce.class_id = :class_id AND ce.exam_id = e.id `,
    { class_id }
  );
}
