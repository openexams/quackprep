import sqlExe from "#db/dbFunctions.js";

export async function getQuestionsByGroupId(group_id, type) {
  const params = { group_id, type };
  return await sqlExe.executeCommand(
    // PULL IN MORE!
    `SELECT q.id, q.question, gq.id as group_id, gt.type_name as type FROM questions q 
    JOIN group_question gq ON gq.id = :group_id AND gq.question_id = q.id 
    JOIN cgroups g ON gq.id = g.id 
    JOIN group_types gt ON gt.id = g.type
    ORDER BY q.id ASC
`,
    params
  );
}

// TODO create question in group
