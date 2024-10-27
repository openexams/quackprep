import sqlExe from "#db/dbFunctions.js";

export async function getQuestionsByGroupId(group_id, type) {
  const params = { group_id, type };
  return await sqlExe.executeCommand(
    // PULL IN MORE! TODO WTF TEST SPENT10 MIN
    `SELECT q.id, q.question, g.id as group_id, gt.type_name as type FROM questions q 
    JOIN group_question gq ON gq.group_id = 3 AND gq.question_id = q.id 
    JOIN cgroups g ON gq.group_id = g.id 
    JOIN group_types gt ON gt.id = g.type 
    WHERE q.deleted = 0
    ORDER BY q.id ASC
`,
    params
  );
}

export async function createQuestionInGroups(
  user_id,
  question,
  question_num_on_exam,
  ...group_ids
) {
  if (!group_ids.length) {
    console.log("created question w NO group id??");
    return null;
  }
  const params = { user_id, question, question_num_on_exam };
  const res_id = (
    await sqlExe.executeCommand(
      `INSERT INTO questions (question,created_by,question_num_on_exam) 
    VALUES(:question,:user_id,:question_num_on_exam);`,
      params
    )
  ).insertId;
  params["res"] = res_id;
  for (let i = 0; i < group_ids.length; i++) {
    params["cur_group_id"] = group_ids[i];
    await sqlExe.executeCommand(
      `INSERT INTO group_question (question_id,group_id) 
    VALUES(:res, :cur_group_id);`,
      params
    );
  }
  return res_id;
}
